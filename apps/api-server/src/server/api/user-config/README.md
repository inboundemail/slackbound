# User Configuration API

API endpoints for managing user-specific configuration settings.

## Endpoints

### GET `/api/user-config/:userId`

Get the configuration for a specific user.

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "U12345678",
    "sendingDomain": "example.com",
    "shouldShowFullEmail": false,
    "createdAt": "2025-10-27T12:00:00.000Z",
    "updatedAt": "2025-10-27T12:00:00.000Z"
  }
}
```

### PUT `/api/user-config/:userId`

Create or update the configuration for a specific user.

**Request Body:**
```json
{
  "sendingDomain": "example.com",
  "shouldShowFullEmail": true
}
```

**Notes:**
- For new users, `sendingDomain` is required
- For existing users, you can update either field independently
- `updatedAt` is automatically set on each update

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "U12345678",
    "sendingDomain": "example.com",
    "shouldShowFullEmail": true,
    "createdAt": "2025-10-27T12:00:00.000Z",
    "updatedAt": "2025-10-27T12:30:00.000Z"
  }
}
```

## Configuration Fields

- **userId** (string): Slack user ID - used as primary key
- **sendingDomain** (string): The domain to use when sending emails from this user
- **shouldShowFullEmail** (boolean): Whether to display email addresses in angle brackets (default: false)
  - **For incoming emails**: Controls whether `ryan vogel <email@example.com>` or just `ryan vogel` is shown
  - **For outgoing emails**: Always shows as `"ryan vogel" <email@example.com>` (full format required for email clients)

## Example Usage

```typescript
// Get user config
const response = await fetch('/api/user-config/U12345678');
const { data } = await response.json();

// Create/update user config
const response = await fetch('/api/user-config/U12345678', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sendingDomain: 'mydomain.com',
    shouldShowFullEmail: true
  })
});
const { data } = await response.json();
```

## Database Migration

After creating these schemas, run the database migration:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

