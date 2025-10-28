import { defineEventHandler } from "h3";
import { db } from "~/server/db";
// Uncomment when you have actual schemas defined
// import { exampleTable } from "~/server/db/schema/example";

/**
 * Example API endpoint demonstrating Drizzle ORM usage
 * GET /api/dev/db-example
 *
 * This is a dev-only endpoint to demonstrate database operations.
 * Delete this file once you've integrated Drizzle into your actual routes.
 */
export default defineEventHandler(async (event) => {
	try {
		// Example: Query all records
		// const records = await db.select().from(exampleTable);

		// Example: Insert a record
		// const newRecord = await db.insert(exampleTable).values({
		//   name: "Test Record",
		// }).returning();

		// Example: Update a record
		// await db.update(exampleTable)
		//   .set({ name: "Updated Name" })
		//   .where(eq(exampleTable.id, 1));

		// Example: Delete a record
		// await db.delete(exampleTable).where(eq(exampleTable.id, 1));

		return {
			success: true,
			message: "Database connection is working!",
			note: "Uncomment the example queries above to test actual database operations",
		};
	} catch (error) {
		console.error("Database error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
});

