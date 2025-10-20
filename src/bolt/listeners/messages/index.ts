import type { App } from '@slack/bolt';
import { emailThreadReply } from './email-thread-reply';
import { sampleMessageCallback } from './sample-message';

const register = (app: App) => {
  app.message(/^hello.*/, sampleMessageCallback);

  // Listen for all messages to handle email thread replies
  app.message(emailThreadReply);
};

export default { register };
