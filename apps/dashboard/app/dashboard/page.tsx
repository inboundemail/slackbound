"use client";

import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lato } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const userName = user?.name ?? "";
  const userEmail = user?.email ?? "";
  const userImage = user?.image ?? "";
  const [identityMode, setIdentityMode] = useState<"name-email" | "name-only">(
    "name-email"
  );
  const fallbackInitials = (userName || userEmail || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/">
            <h1 className="font-outfit text-2xl font-semibold text-foreground flex items-center gap-2">
              <Image
                src="/images/slackbound-icon.png"
                alt="Logo"
                width={25}
                height={25}
              />
              Dashboard
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden min-w-0 sm:block text-right">
                  <p className="truncate text-sm font-medium text-foreground">
                    {userName || "—"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {userEmail || "—"}
                  </p>
                </div>
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName ? `${userName}'s avatar` : "User avatar"}
                    className="h-8 w-8 rounded-full ring-1 ring-border object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground ring-1 ring-border">
                    {fallbackInitials}
                  </div>
                )}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/40"
            >
              Sign out
            </button>
          </div>
        </div>

        {isPending ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-6">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm text-muted-foreground">
              Loading session…
            </span>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Configuration Card */}
            <div className="rounded-lg border border-border bg-background p-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Configuration
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                These settings control how your identity appears in Slack and
                which channel is linked to an email address.
              </p>
              <hr className="my-6 border-border" />
              <div className="space-y-5 w-full">
                {/* Message identity selector */}
                <div className="grid-cols-2 gap-2 grid items-start">
                  <span className="text-sm font-medium text-foreground col-span-1">
                    Message identity
                  </span>
                  <div className="col-span-1">
                    <RadioGroup
                      value={identityMode}
                      onValueChange={(v) =>
                        setIdentityMode(
                          (v as "name-email" | "name-only") ?? "name-email"
                        )
                      }
                      className="gap-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <label
                          htmlFor="identity-name-email"
                          className="text-sm text-foreground"
                        >
                          Show name and email
                        </label>
                        <RadioGroupItem
                          value="name-email"
                          id="identity-name-email"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <label
                          htmlFor="identity-name-only"
                          className="text-sm text-foreground"
                        >
                          Show name only
                        </label>
                        <RadioGroupItem
                          value="name-only"
                          id="identity-name-only"
                        />
                      </div>
                    </RadioGroup>
                    <p className="mt-1 text-xs text-muted-foreground">
                      UI only — no changes are saved yet.
                    </p>
                  </div>
                </div>

                {/* Live Slack-style preview */}
                <div
                  className={`rounded-lg border border-zinc-200 bg-white p-4 ${lato.className}`}
                >
                  <div className="flex items-start gap-3">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={userName ? `${userName}'s avatar` : "User avatar"}
                        className="h-9 w-9 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-200 text-[10px] font-semibold text-zinc-700">
                        {fallbackInitials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="truncate text-[15px] font-semibold text-zinc-900 gap-x-1 flex items-center">
                          <span>{userName || "Your Name"}</span>
                          {identityMode === "name-email" && (
                            <>
                              <span>
                                &lt;{userEmail || "you@example.com"}&gt;
                              </span>
                            </>
                          )}
                        </span>
                        <span className="text-[12px] text-zinc-400">now</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-[15px] leading-6 text-zinc-800">
                        This is a preview of how your messages will appear in
                        Slack.
                        {"\n"}
                        Reply inline, attach files, and keep email threads in
                        sync.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-6 border-border" />
              <div className="space-y-5 w-full"></div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-background p-6">
            <p className="text-sm text-muted-foreground">No active session.</p>
            <a
              href="/"
              className="mt-3 inline-flex items-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/40"
            >
              Go to Home
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
