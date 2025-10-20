import type { InboundWebhookPayload } from '@inboundemail/sdk';
import { eventHandler, readBody } from 'h3';
import { app } from '../../bolt/app';
import { getInboundApiKey, getInboundEmailChannelId } from '../../bolt/utils/config';
import { parseEmailContent } from '../../bolt/utils/email-parser';
import { threadStorage } from '../../bolt/utils/thread-storage';

/**
 * Generate an avatar URL using useravatar.vercel.app with user initials
 */
function getAvatarUrl(name: string): string {
  // Extract initials (up to 2 characters)
  const initials =
    name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  // Generate avatar with initials
  return `https://useravatar.vercel.app/api/logo?text=${encodeURIComponent(initials)}&width=200&height=200&fontSize=100&font=Inter`;
}

export default eventHandler(async (event) => {
  console.log('[INBOUND] 📬 Received webhook request');

  try {
    const payload: InboundWebhookPayload = await readBody(event);

    // Extract email data
    const { email } = payload;
    console.log('[INBOUND] ✉️  Processing email:');
    console.log(`  ID: ${email.id}`);
    console.log(`  Thread ID: ${email.threadId || 'none'}`);
    console.log(`  From: ${email.from?.addresses?.[0]?.name || email.from?.addresses?.[0]?.address || 'unknown'}`);
    console.log(`  Subject: ${email.subject || '(No Subject)'}`);
    console.log(`  Thread Position: ${email.threadPosition || 1}`);

    // Log attachments if present
    const attachments = email.parsedData?.attachments;
    if (attachments && attachments.length > 0) {
      console.log('[INBOUND] 📎 Attachments:');
      console.log(JSON.stringify(attachments, null, 2));
    } else {
      console.log('[INBOUND] 📎 No attachments');
    }

    // Atomic idempotency check: Check and mark as processed in one operation
    console.log('[INBOUND] 🔍 Checking idempotency...');
    const alreadyProcessed = await threadStorage.checkAndMarkEmailProcessed(email.id);
    if (alreadyProcessed) {
      console.log(`[IDEMPOTENCY] ⏭️  Email ${email.id} already processed, skipping duplicate webhook`);
      console.log(`  Thread ID: ${email.threadId || 'none'}`);
      console.log(`  Subject: ${email.subject || '(No Subject)'}`);
      return {
        success: true,
        skipped: true,
        reason: 'duplicate',
        emailId: email.id,
      };
    }

    console.log(`[IDEMPOTENCY] ✅ Processing email ${email.id} for the first time`);

    const fromAddress = email.from?.addresses?.[0];
    const fromName = fromAddress?.name || fromAddress?.address || 'Unknown';
    const fromEmail = fromAddress?.address || '';
    const subject = email.subject || '(No Subject)';

    // Parse email content with HTML conversion and image extraction
    console.log('[INBOUND] 📝 Parsing email content...');
    const { text: cleanedText, images } = parseEmailContent(email);
    console.log(`[INBOUND] 📝 Parsed ${cleanedText.length} chars, ${images.length} images`);

    // Check if this email is part of an existing thread
    const inboundThreadId = email.threadId;
    const threadPosition = email.threadPosition || 1;
    let slackThreadTs: string | undefined;

    console.log('[INBOUND] 🧵 Checking for existing thread...');
    if (inboundThreadId) {
      // Try to find existing Slack thread
      const existingThreadTs = await threadStorage.getSlackThreadTs(inboundThreadId);
      if (existingThreadTs) {
        slackThreadTs = existingThreadTs;
        console.log(`[INBOUND] ✅ Found existing thread: ${inboundThreadId} -> ${slackThreadTs}`);
      } else {
        console.log(`[INBOUND] 🆕 No existing thread found for ${inboundThreadId}, will create new`);
      }
    } else {
      console.log('[INBOUND] 🆕 No threadId in email, will create new thread');
    }

    // Build Slack message blocks
    // biome-ignore lint/suspicious/noExplicitAny: Slack Block Kit types are complex, using any for flexibility
    const blocks: any[] = [];

    // For first message in thread (threadPosition 1), show subject and message
    // For replies (threadPosition > 1), just show the cleaned message
    if (threadPosition === 1 || !slackThreadTs) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${subject}*\n\n${cleanedText}`,
        },
      });
    } else {
      // Thread reply - just show the message content
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: cleanedText,
        },
      });
    }

    // Add image blocks for any extracted images
    for (const imageUrl of images) {
      blocks.push({
        type: 'image',
        image_url: imageUrl,
        alt_text: 'Email image',
      });
    }

    // Download and upload attachments to Slack
    const uploadedFileIds: string[] = [];
    if (attachments && attachments.length > 0) {
      console.log(`[INBOUND] 📎 Processing ${attachments.length} attachment(s)...`);
      const inboundApiKey = getInboundApiKey();

      for (const attachment of attachments) {
        try {
          console.log(`[INBOUND] ⬇️  Downloading: ${attachment.filename} (${attachment.size} bytes)`);
          
          // Download attachment from inbound.new
          const downloadResponse = await fetch(attachment.downloadUrl, {
            headers: {
              'Authorization': `Bearer ${inboundApiKey}`,
            },
          });

          if (!downloadResponse.ok) {
            throw new Error(`Failed to download attachment: ${downloadResponse.statusText}`);
          }

          const fileBuffer = await downloadResponse.arrayBuffer();
          console.log(`[INBOUND] ✅ Downloaded ${attachment.filename}`);

          // Upload to Slack
          console.log(`[INBOUND] ⬆️  Uploading to Slack: ${attachment.filename}`);
          const uploadResponse = await app.client.files.uploadV2({
            channel_id: getInboundEmailChannelId(),
            file: Buffer.from(fileBuffer),
            filename: attachment.filename,
            title: attachment.filename,
            ...(slackThreadTs && { thread_ts: slackThreadTs }),
          });

          if (uploadResponse.file?.id) {
            uploadedFileIds.push(uploadResponse.file.id);
            console.log(`[INBOUND] ✅ Uploaded to Slack: ${attachment.filename} (ID: ${uploadResponse.file.id})`);
          }
        } catch (error) {
          console.error(`[INBOUND] ❌ Failed to process attachment ${attachment.filename}:`, error);
          // Continue with other attachments even if one fails
        }
      }

      console.log(`[INBOUND] 📎 Successfully uploaded ${uploadedFileIds.length}/${attachments.length} attachments`);
    }

    // Generate avatar URL with user initials
    const avatarUrl = getAvatarUrl(fromName);

    // Create full username with name and email
    const fullUsername = `${fromName} <${fromEmail}>`;

    console.log('[INBOUND] 👤 Bot appearance:');
    console.log(`  Username: ${fullUsername}`);
    console.log(`  Avatar: ${avatarUrl}`);

    // Post to Slack channel (or thread if this is a reply)
    const channelId = getInboundEmailChannelId();
    console.log(
      `[INBOUND] 📤 Posting to Slack channel: ${channelId}${slackThreadTs ? ` (thread: ${slackThreadTs})` : ''}`,
    );
    const response = await app.client.chat.postMessage({
      channel: channelId,
      text: `New email from ${fromName}: ${subject}`,
      blocks,
      unfurl_links: false,
      unfurl_media: false,
      username: fullUsername, // Display sender's name and email as the bot username
      icon_url: avatarUrl, // Use useravatar with initials
      ...(slackThreadTs && { thread_ts: slackThreadTs }),
      ...(uploadedFileIds.length > 0 && { files: uploadedFileIds }),
    });

    console.log(`[INBOUND] ✅ Posted to Slack successfully! Message TS: ${response.ts}`);

    // Store thread mapping if this is the first message in a thread
    if (inboundThreadId && response.ts && !slackThreadTs) {
      console.log('[INBOUND] 💾 Storing new thread mapping...');
      await threadStorage.set(inboundThreadId, response.ts, email.id);
      console.log(`[THREAD MAPPING] ✅ Created new: ${inboundThreadId} -> ${response.ts}`);
      console.log(`  Email ID: ${email.id}`);
    } else if (inboundThreadId && slackThreadTs) {
      console.log(`[THREAD MAPPING] ℹ️  Using existing: ${inboundThreadId} -> ${slackThreadTs}`);
      console.log(`  Email ID: ${email.id}`);
    }
    // Note: Email is already marked as processed by the atomic check at the beginning

    console.log('[INBOUND] 🎉 Successfully processed email!');
    console.log('--------------------------------\n');

    return {
      success: true,
      emailId: email.id,
      threadId: inboundThreadId,
      slackThreadTs: response.ts,
    };
  } catch (error) {
    console.error('[INBOUND] ❌ ERROR processing webhook:');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.log('--------------------------------\n');

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});
