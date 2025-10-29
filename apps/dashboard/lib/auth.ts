import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/db";
import * as schema from "@/db/schema";

let cachedAuth: ReturnType<typeof betterAuth> | null = null;

export function getAuth() {
  if (cachedAuth) return cachedAuth;
  const db = getDb();
  cachedAuth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: false,
    },
    socialProviders: {
      slack: {
        clientId: process.env.SLACK_CLIENT_ID as string,
        clientSecret: process.env.SLACK_CLIENT_SECRET as string,
        redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/slack`,
      },
    },
  });
  return cachedAuth;
}

export type Session = ReturnType<typeof betterAuth>["$Infer"]["Session"];
