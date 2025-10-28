import type { App } from '@slack/bolt';
import { emailThreadReply } from './email-thread-reply';

const register = (app: App) => {
  // Listen for all messages to handle email thread replies
  app.message(emailThreadReply);
};

export default { register };
