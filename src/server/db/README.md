# Database Setup with Drizzle ORM

This project uses [Drizzle ORM](https://orm.drizzle.team/) with NeonDB (PostgreSQL).

## Configuration

Set the `DATABASE_URL` environment variable in your `.env` file:

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Get your connection string from [Neon Console](https://console.neon.tech/).

## Directory Structure

- `src/server/db/index.ts` - Database client initialization
- `src/server/db/schema/` - Database schema definitions
- `drizzle.config.ts` - Drizzle Kit configuration
- `drizzle/` - Generated migrations (auto-generated, git-ignored)

## Creating Schemas

1. Create a new schema file in `src/server/db/schema/`:

```typescript
// src/server/db/schema/users.ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

2. Export it in `src/server/db/schema/index.ts`:

```typescript
export * from "./users";
```

## Available Commands

### Generate Migrations

Generate SQL migration files from your schema:

```bash
pnpm db:generate
```

### Push Schema to Database

Push schema changes directly to the database (dev only):

```bash
pnpm db:push
```

### Run Migrations

Apply migrations to the database:

```bash
pnpm db:migrate
```

### Drizzle Studio

Open a visual database browser:

```bash
pnpm db:studio
```

## Usage in Code

Import the database client and use it in your API routes:

```typescript
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// Query
const allUsers = await db.select().from(users);

// Insert
const newUser = await db.insert(users).values({
  email: "user@example.com",
  name: "John Doe",
}).returning();

// Update
await db.update(users)
  .set({ name: "Jane Doe" })
  .where(eq(users.id, 1));

// Delete
await db.delete(users).where(eq(users.id, 1));
```

## Best Practices

1. **Always generate migrations**: Use `pnpm db:generate` before deploying
2. **Use transactions**: Wrap multiple operations in transactions for data consistency
3. **Type safety**: Drizzle provides full TypeScript type inference
4. **Indexes**: Add indexes to frequently queried columns
5. **Timestamps**: Include `createdAt` and `updatedAt` fields for auditing

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle with Neon Guide](https://neon.tech/docs/guides/drizzle)
- [NeonDB Documentation](https://neon.tech/docs)

