import type { AllMiddlewareArgs, SlackShortcutMiddlewareArgs } from '@slack/bolt';

const forwardToEmailCallback = async ({
  ack,
  client,
  shortcut,
  logger,
}: AllMiddlewareArgs & SlackShortcutMiddlewareArgs) => {
  try {
    await ack();

    // Type guard for message shortcuts
    if (shortcut.type !== 'message_action') {
      logger.warn('Expected message_action shortcut type');
      return;
    }

    const message = shortcut.message;
    const messageText = message.text || '';
    const messageUser = message.user;
    const messageTs = message.ts;
    const channelId = shortcut.channel.id;

    // Get user info for better context
    let userName = 'Unknown User';
    try {
      const userInfo = await client.users.info({ user: messageUser || '' });
      userName = userInfo.user?.real_name || userInfo.user?.name || userName;
    } catch (e) {
      logger.warn('Could not fetch user info', e);
    }

    // Check if message is part of a thread and get thread context if needed
    let threadContext = '';
    if (message.thread_ts) {
      try {
        const replies = await client.conversations.replies({
          channel: channelId,
          ts: message.thread_ts,
          limit: 10,
        });
        const messageCount = replies.messages?.length || 0;
        threadContext = `\n\n_This message is part of a thread with ${messageCount} messages._`;
      } catch (e) {
        logger.warn('Could not fetch thread context', e);
      }
    }

    // Store message context in private_metadata for view submission
    const metadata = JSON.stringify({
      channel_id: channelId,
      message_ts: messageTs,
      user: messageUser,
    });

    await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'forward_email_view',
        private_metadata: metadata,
        title: {
          type: 'plain_text',
          text: 'Forward to Email',
        },
        submit: {
          type: 'plain_text',
          text: 'Send',
        },
        blocks: [
          {
            type: 'input',
            block_id: 'email_to_block',
            label: {
              type: 'plain_text',
              text: 'To',
            },
            element: {
              type: 'plain_text_input',
              action_id: 'email_to_input',
              placeholder: {
                type: 'plain_text',
                text: 'recipient@example.com',
              },
            },
          },
          {
            type: 'input',
            block_id: 'email_subject_block',
            label: {
              type: 'plain_text',
              text: 'Subject',
            },
            element: {
              type: 'plain_text_input',
              action_id: 'email_subject_input',
              initial_value: `Forwarded from Slack: Message from ${userName}`,
            },
          },
          {
            type: 'input',
            block_id: 'email_body_block',
            label: {
              type: 'plain_text',
              text: 'Message',
            },
            hint: {
              type: 'plain_text',
              text: 'Original message is included below. Add any additional context above.',
            },
            element: {
              type: 'plain_text_input',
              action_id: 'email_body_input',
              multiline: true,
              initial_value: `--- Forwarded Message ---\nFrom: ${userName}\n\n${messageText}${threadContext}`,
            },
          },
        ],
      },
    });
  } catch (error) {
    logger.error(error);
  }
};

export default forwardToEmailCallback;
