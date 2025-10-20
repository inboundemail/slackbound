import type { App } from '@slack/bolt';
import composeEmailCallback from './compose-email';
import forwardToEmailCallback from './forward-to-email';

const register = (app: App) => {
  app.shortcut('compose_email_shortcut', composeEmailCallback);
  app.shortcut('forward_message_to_email', forwardToEmailCallback);
};

export default { register };
