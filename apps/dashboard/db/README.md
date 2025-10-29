# Database Documentation

This directory contains the database configuration and schema definitions for the SlackBound dashboard.

## Structure

```
db/
├── schema/
│   ├── user.ts       # User, session, account, and verification tables for Better-Auth
│   ├── waitlist.ts   # Waitlist email collection table
│   └── index.ts      # Schema exports
├── index.ts          # Database connection and Drizzle instance
└── README.md         # This file
```

## Database Setup

### 1. Configure Environment Variables

Copy the `.env.template` file to `.env.local` and fill in your Neon PostgreSQL connection string:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
```

### 2. Generate and Push Schema

```bash
# Generate migration files from schema
bun run db:generate

# Push schema directly to database (recommended for development)
bun run db:push
```

### 3. Inspect Database (Optional)

Open Drizzle Studio to view and manage your database:

```bash
bun run db:studio
```

## Schema Overview

### Authentication Tables (Better-Auth)

#### `user`
- Stores user account information
- Fields: id, name, email, emailVerified, image, createdAt, updatedAt

#### `session`
- Manages user sessions
- Fields: id, expiresAt, token, userId, ipAddress, userAgent, createdAt, updatedAt

#### `account`
- Stores OAuth provider connections and credentials
- Fields: id, accountId, providerId, userId, accessToken, refreshToken, idToken, expiresAt, scope, password, createdAt, updatedAt

#### `verification`
- Handles email verification and password reset tokens
- Fields: id, identifier, value, expiresAt, createdAt, updatedAt

### Application Tables

#### `waitlist`
- Stores waitlist signups
- Fields: id (serial), email (unique), createdAt

## Using the Database

### Importing the Database Instance

```typescript
import { db } from "@/db";
```

### Example Queries

```typescript
import { db } from "@/db";
import { waitlist } from "@/db/schema";
import { eq } from "drizzle-orm";

// Insert a new waitlist entry
await db.insert(waitlist).values({
  email: "user@example.com",
});

// Query all waitlist entries
const entries = await db.select().from(waitlist);

// Find by email
const entry = await db
  .select()
  .from(waitlist)
  .where(eq(waitlist.email, "user@example.com"));
```

## Migration Workflow

### Development (Schema Push)

For rapid development, use `db:push` to sync schema changes directly:

```bash
bun run db:push
```

This is ideal for:
- Local development
- Iterating on schema design
- Testing changes quickly

### Production (Migrations)

For production deployments, use proper migrations:

```bash
# 1. Generate migration files from schema changes
bun run db:generate

# 2. Review generated SQL in drizzle/ directory

# 3. Apply migrations to database
bun run db:migrate
```

This approach:
- Creates versioned migration files
- Allows review before applying changes
- Maintains migration history
- Enables rollbacks if needed

## Best Practices

1. **Never commit `.env.local`** - It contains sensitive credentials
2. **Review generated migrations** before applying to production
3. **Use transactions** for related database operations
4. **Add indexes** for frequently queried columns
5. **Use typed queries** with Drizzle's query builder for type safety

## Troubleshooting

### Connection Issues

If you're having trouble connecting to Neon:
- Verify your `DATABASE_URL` is correct
- Check that SSL mode is enabled (`?sslmode=require`)
- Ensure your IP is allowed in Neon's network settings

### Schema Sync Issues

If your schema is out of sync:
```bash
# For development, force push schema
bun run db:push

# For production, generate and apply migrations
bun run db:generate
bun run db:migrate
```

### TypeScript Errors

If you're getting type errors:
- Restart your TypeScript server
- Check that schema exports are correct in `schema/index.ts`
- Verify Drizzle is using the latest schema

## Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Neon PostgreSQL Documentation](https://neon.tech/docs/introduction)
- [Better-Auth Database Schema](https://www.better-auth.com/docs/concepts/database)

