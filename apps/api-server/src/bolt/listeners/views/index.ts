import type { App } from '@slack/bolt';
import composeEmailViewCallback from './compose-email-view';
import forwardEmailViewCallback from './forward-email-view';

const register = (app: App) => {
  app.view('compose_email_view', composeEmailViewCallback);
  app.view('forward_email_view', forwardEmailViewCallback);
};

export default { register };
