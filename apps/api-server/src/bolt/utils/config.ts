/**
 * Configuration utilities for the Slack app
 */

/**
 * Get the Slack channel ID for inbound emails
 * TODO: Make this configurable via slash command or environment variable
 */
export const getInboundEmailChannelId = (): string => {
  // Default to #slackbound-testing channel
  // You can override this with INBOUND_SLACK_CHANNEL_ID environment variable
  return process.env.INBOUND_SLACK_CHANNEL_ID || 'C09N7CY3FMW';
};

/**
 * Get the inbound.new API key
 */
export const getInboundApiKey = (): string => {
  const apiKey = process.env.INBOUND_API_KEY;
  if (!apiKey) {
    throw new Error('INBOUND_API_KEY environment variable is not set');
  }
  return apiKey;
};
