import type { AllMiddlewareArgs, SlackShortcutMiddlewareArgs } from '@slack/bolt';

const composeEmailCallback = async ({
  ack,
  client,
  shortcut,
  logger,
}: AllMiddlewareArgs & SlackShortcutMiddlewareArgs) => {
  try {
    await ack();

    await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'compose_email_view',
        title: {
          type: 'plain_text',
          text: 'Compose Email',
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
              placeholder: {
                type: 'plain_text',
                text: 'Email subject',
              },
            },
          },
          {
            type: 'input',
            block_id: 'email_body_block',
            label: {
              type: 'plain_text',
              text: 'Message',
            },
            element: {
              type: 'plain_text_input',
              action_id: 'email_body_input',
              multiline: true,
              placeholder: {
                type: 'plain_text',
                text: 'Write your email message here...',
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    logger.error(error);
  }
};

export default composeEmailCallback;
