import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

const forwardEmailViewCallback = async ({
  ack,
  view,
  client,
  body,
  logger,
}: AllMiddlewareArgs & SlackViewMiddlewareArgs) => {
  try {
    await ack();

    // Extract form values
    const emailTo = view.state.values.email_to_block.email_to_input.value;
    const emailSubject = view.state.values.email_subject_block.email_subject_input.value;
    const emailBody = view.state.values.email_body_block.email_body_input.value;

    // Get original message metadata
    const metadata = view.private_metadata ? JSON.parse(view.private_metadata) : null;

    // TODO: Implement actual email sending logic here
    // For now, just log the email details
    logger.info('Email forward details:', {
      to: emailTo,
      subject: emailSubject,
      body: emailBody,
      original_message: metadata,
      user: body.user.id,
    });

    // Send confirmation message to user
    await client.chat.postMessage({
      channel: body.user.id,
      text: `✅ Message forwarded successfully!\n\n*To:* ${emailTo}\n*Subject:* ${emailSubject}\n\n_Email sending functionality to be implemented._`,
    });
  } catch (error) {
    logger.error(error);
  }
};

export default forwardEmailViewCallback;
