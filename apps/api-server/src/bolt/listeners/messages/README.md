# Email Thread Reply Handler

## Overview

The `email-thread-reply.ts` handler processes replies in Slack threads and sends them as email replies via Inbound.

## User Configuration Integration

The handler now integrates with the user configuration system to customize the "from" email address.

### Username Generation

When a user replies in a thread, their real name is transformed into an email username:

1. **Convert to lowercase**: "John Doe" → "john doe"
2. **Replace spaces with dots**: "john doe" → "john.doe"
3. **Keep only alphanumeric and dots**: "john.doe" → "john.doe"
4. **Combine with configured domain**: "john.doe" + "@example.com" → "john.doe@example.com"

**Examples:**
- "Ryan Vogel" → `ryan.vogel@example.com`
- "Jane O'Brien" → `jane.obrien@example.com`
- "Mike Smith III" → `mike.smith.iii@example.com`
- "李明" → `@example.com` (non-Latin characters removed)

### Email Formatting

The "from" field is formatted based on the user's configuration:

#### When `shouldShowFullEmail` is `false` (default):
```
"Ryan Vogel" <ryan.vogel@example.com>
```
Uses the generated email address.

#### When `shouldShowFullEmail` is `true`:
```
"Ryan Vogel" <ryan@actualcompany.com>
```
Uses the user's actual Slack profile email address.

### Fallback Behavior

- **No user config found**: Uses `inbound.new` as the default domain
- **No Slack profile email**: Falls back to generated email even if `shouldShowFullEmail` is true
- **Invalid real name**: Uses "Slack User" as fallback

## Configuration Management

To set up a user's configuration:

```bash
# Set or update user configuration
curl -X PUT http://localhost:3000/api/user-config/U12345678 \
  -H "Content-Type: application/json" \
  -d '{
    "sendingDomain": "mycompany.com",
    "shouldShowFullEmail": false
  }'
```

## Workflow

1. User replies in a Slack thread
2. Handler fetches user's real name from Slack API
3. Handler queries database for user configuration
4. Generates email username from real name
5. Constructs "from" field based on configuration
6. Sends email reply via Inbound with formatted sender
7. Adds ✅ reaction to confirm sent

## Incoming Emails Display

When emails are received (handled by `src/server/api/inbound.post.ts`), the system also respects `shouldShowFullEmail`:

- **When `false`**: Displays as `ryan vogel` (name only)
- **When `true`**: Displays as `ryan vogel <email@example.com>` (with email address)

The system looks up the Slack user by matching the incoming email address with Slack profile emails, then checks their configuration.

## Logging

The handler logs:
- User's real name
- Found configuration (domain and showFullEmail setting)
- Final "from" field value
- Any errors during config fetch or email send

