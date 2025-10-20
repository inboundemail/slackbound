import * as emoji from 'node-emoji';
import type { WebClient } from '@slack/bolt';

/**
 * Slack Emoji Converter
 *
 * Converts Slack emoji syntax (:emoji_name:) to Unicode emojis or HTML images.
 * Handles both standard emojis and custom workspace emojis.
 */

// Cache for custom emojis from the workspace
let customEmojiCache: Record<string, string> | null = null;

/**
 * Fetch and cache custom emojis from the Slack workspace
 */
async function fetchCustomEmojis(client: WebClient): Promise<Record<string, string>> {
  if (customEmojiCache) {
    return customEmojiCache;
  }

  try {
    const response = await client.emoji.list();
    if (response.ok && response.emoji) {
      customEmojiCache = response.emoji as Record<string, string>;
      return customEmojiCache;
    }
  } catch (error) {
    console.warn('Could not fetch custom emojis:', error);
  }

  return {};
}

/**
 * Convert Slack emoji syntax to Unicode emojis or HTML images
 *
 * Examples:
 * - ":smile:" → "😄"
 * - ":link:" → "🔗"
 * - ":custom_emoji:" → <img src="..." alt="custom_emoji" />
 *
 * @param text - Text containing Slack emoji syntax
 * @param client - Optional Slack client to fetch custom emojis
 * @param format - Output format: 'unicode' for plain emojis, 'html' for HTML with custom emoji images
 * @returns Text with emojis converted
 */
export async function convertSlackEmojisToEmojis(
  text: string,
  client?: WebClient,
  format: 'unicode' | 'html' = 'unicode',
): Promise<string> {
  // Fetch custom emojis if client is provided
  let customEmojis: Record<string, string> = {};
  if (client && format === 'html') {
    customEmojis = await fetchCustomEmojis(client);
  }

  // Regex to match :emoji_name:
  const emojiRegex = /:([a-zA-Z0-9_+-]+):/g;

  return text.replace(emojiRegex, (match, emojiName) => {
    // Try to convert to Unicode emoji first using node-emoji
    const unicodeEmoji = emoji.get(emojiName);
    if (unicodeEmoji && unicodeEmoji !== `:${emojiName}:`) {
      return unicodeEmoji;
    }

    // Handle Slack emoji aliases that node-emoji might not recognize
    const slackToNodeEmojiMap: Record<string, string> = {
      // Common Slack aliases that differ from standard emoji names
      white_check_mark: 'white_check_mark',
      heavy_check_mark: 'heavy_check_mark',
      x: 'x',
      link: 'link',
      // Add more as needed
    };

    const mappedName = slackToNodeEmojiMap[emojiName];
    if (mappedName) {
      const mappedEmoji = emoji.get(mappedName);
      if (mappedEmoji && mappedEmoji !== `:${mappedName}:`) {
        return mappedEmoji;
      }
    }

    // If HTML format and custom emoji exists, return img tag
    if (format === 'html' && customEmojis[emojiName]) {
      const imageUrl = customEmojis[emojiName];
      // Handle alias (starts with "alias:")
      if (imageUrl.startsWith('alias:')) {
        const aliasName = imageUrl.substring(6);
        if (customEmojis[aliasName]) {
          return `<img src="${customEmojis[aliasName]}" alt="${emojiName}" style="height: 1.2em; width: 1.2em; display: inline; vertical-align: middle;" />`;
        }
      }
      return `<img src="${imageUrl}" alt="${emojiName}" style="height: 1.2em; width: 1.2em; display: inline; vertical-align: middle;" />`;
    }

    // If no conversion found, keep original syntax
    return match;
  });
}

/**
 * Convert Slack emoji syntax to Unicode emojis only (no HTML)
 * This is useful for plain text emails
 */
export function convertSlackEmojisToUnicode(text: string): string {
  const emojiRegex = /:([a-zA-Z0-9_+-]+):/g;

  return text.replace(emojiRegex, (match, emojiName) => {
    const unicodeEmoji = emoji.get(emojiName);
    if (unicodeEmoji && unicodeEmoji !== `:${emojiName}:`) {
      return unicodeEmoji;
    }
    // Keep original if no conversion found
    return match;
  });
}

