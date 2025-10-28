import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Example table schema - you can delete this and create your own schemas
export const exampleTable = pgTable("example", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

