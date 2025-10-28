# Slack API: Custom username/icon with file uploads - Any workarounds?

I'm building a Slack bot that needs to post messages with a **custom username and icon** while also including **file attachments**. The issue is that Slack's API doesn't support custom appearance when uploading files.

## What I've Tried

### Approach 1: `files.uploadV2` with custom appearance
```typescript
await client.files.uploadV2({
  channel_id: channelId,
  file: fileBuffer,
  filename: 'document.pdf',
  initial_comment: 'Attachment',
});

await client.chat.postMessage({
  channel: channelId,
  text: 'Message',
  username: 'Custom User',
  icon_url: 'https://example.com/avatar.png',
});
```
**Result:** File appears with bot's default identity, not the custom username/icon.

### Approach 2: `slack_file` blocks
```typescript
// Upload file
const upload = await client.files.uploadV2({
  channel_id: channelId,
  file: fileBuffer,
  filename: 'image.png',
});

// Reference in message
await client.chat.postMessage({
  channel: channelId,
  blocks: [{
    type: 'image',
    slack_file: { id: upload.file.id },
    alt_text: 'image',
  }],
  username: 'Custom User',
  icon_url: 'https://example.com/avatar.png',
});
```
**Result:** `invalid_blocks` error - Slack rejects messages with custom username when `slack_file` blocks are present.

### Approach 3: Upload privately, then share
```typescript
// Upload without channel
const upload = await client.files.uploadV2({
  file: fileBuffer,
  filename: 'file.pdf',
});

// Share via chat.postMessage with permalink
await client.chat.postMessage({
  channel: channelId,
  text: `File: ${upload.file.permalink}`,
  username: 'Custom User',
  icon_url: 'https://example.com/avatar.png',
});
```
**Result:** Permission errors - file isn't accessible when username is overridden ([related issue](https://github.com/slackapi/python-slack-sdk/issues/1351)).

## Question

Is there any way to upload files to Slack **and** have them appear with a custom username/icon in the same message? Or is this a hard limitation of the Slack API?

I've found [this issue](https://github.com/slackapi/node-slack-sdk/issues/1595) discussing the limitation, but wondering if there are any newer workarounds or alternative approaches I'm missing.

**Requirements:**
- Files must appear in channel (not just as external links)
- Message must show custom sender name and avatar
- Ideally everything in a single message (not separate file upload + text message)

Any suggestions appreciated!
