"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { PlusIcon, MailIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Loader from "@/components/icons/loader";
import CircleCheck from "@/components/icons/circle-check";
import Hashtag from "@/components/icons/hashtag";
import AtSign from "@/components/icons/at-sign";
import {
  createSlackChannel,
  createEmailAddress,
  linkChannelAndEmail,
} from "@/app/actions/user-config";

type Step = "root" | "email-address" | "channel-name" | "creating";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domains: Array<{ id: string; domain: string; status: string }>;
  onChannelCreate: (channelName: string, emailAddress: string) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  domains,
  onChannelCreate,
}: CommandPaletteProps) {
  const [step, setStep] = React.useState<Step>("root");
  const [emailPrefix, setEmailPrefix] = React.useState("");
  const [selectedDomain, setSelectedDomain] = React.useState<string>("");
  const [search, setSearch] = React.useState("");
  const [shouldResetOnClose, setShouldResetOnClose] = React.useState(false);
  const [creatingSteps, setCreatingSteps] = React.useState({
    slackChannel: false,
    emailAddress: false,
    linking: false,
  });
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateChannelSelect = React.useCallback(() => {
    setStep("email-address");
    setSearch("");
  }, []);

  const handleEmailComplete = React.useCallback((prefix?: string, domain?: string) => {
    const finalPrefix = prefix || emailPrefix;
    const finalDomain = domain || selectedDomain;
    
    if (finalPrefix.trim() && finalDomain) {
      // Sanitize for channel name:
      // 1. Replace all dots with hyphens
      // 2. Remove leading/trailing dots and hyphens
      const channelName = finalPrefix
        .trim()
        .replace(/\./g, "-")
        .replace(/^[-\.]+|[-\.]+$/g, "");
      
      setStep("channel-name");
      // Pre-fill channel name with sanitized email prefix
      setSearch(channelName);
      // Focus the channel name input after a brief delay
      setTimeout(() => {
        const channelInput = document.querySelector('[data-slot="command-input"]') as HTMLInputElement;
        if (channelInput) {
          channelInput.focus();
        }
      }, 100);
    }
  }, [emailPrefix, selectedDomain]);

  const handleChannelNameSubmit = React.useCallback(async (name: string) => {
    if (!name.trim() || !emailPrefix || !selectedDomain) return;

    const emailAddress = `${emailPrefix}@${selectedDomain}`;
    const channelName = name.trim();

    // Move to creating step
    setStep("creating");
    setCreatingSteps({
      slackChannel: false,
      emailAddress: false,
      linking: false,
    });

    try {
      // Step 1: Create Slack channel
      const channelResult = await createSlackChannel(channelName);
      if (channelResult.success) {
        setCreatingSteps((prev) => ({ ...prev, slackChannel: true }));
      }

      // Step 2: Create email address
      const emailResult = await createEmailAddress(emailAddress);
      if (emailResult.success) {
        setCreatingSteps((prev) => ({ ...prev, emailAddress: true }));
      }

      // Step 3: Link channel and email
      if (channelResult.success && emailResult.success) {
        const linkResult = await linkChannelAndEmail(
          channelResult.channelId,
          emailResult.emailId
        );
        if (linkResult.success) {
          setCreatingSteps((prev) => ({ ...prev, linking: true }));
        }
      }

      // Complete - close dialog and call callback
      setTimeout(() => {
        onChannelCreate(channelName, emailAddress);
        // Reset all state
        setStep("root");
        setEmailPrefix("");
        setSelectedDomain("");
        setSearch("");
        setCreatingSteps({
          slackChannel: false,
          emailAddress: false,
          linking: false,
        });
        onOpenChange(false);
      }, 500);
    } catch (error) {
      console.error("Error creating channel:", error);
      // Reset to channel name step on error
      setStep("channel-name");
      setCreatingSteps({
        slackChannel: false,
        emailAddress: false,
        linking: false,
      });
    }
  }, [emailPrefix, selectedDomain, onChannelCreate, onOpenChange]);

  const handleEmailInputKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const atIndex = search.indexOf("@");
      const prefix = atIndex > -1 ? search.substring(0, atIndex) : search;
      if (prefix.trim() && selectedDomain) {
        e.preventDefault();
        e.stopPropagation();
        handleEmailComplete();
      }
    }
  }, [search, selectedDomain, handleEmailComplete]);

  const handleChannelNameInputKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      handleChannelNameSubmit(search);
    }
  }, [search, handleChannelNameSubmit]);

  // Reset state only when explicitly closing via Escape
  React.useEffect(() => {
    if (!open && shouldResetOnClose) {
      setStep("root");
      setEmailPrefix("");
      setSelectedDomain("");
      setSearch("");
      setShouldResetOnClose(false);
      setCreatingSteps({
        slackChannel: false,
        emailAddress: false,
        linking: false,
      });
    }
  }, [open, shouldResetOnClose]);

  // Focus input when step changes
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        const input = document.querySelector('[data-slot="command-input"]') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }, [open, step]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setShouldResetOnClose(true);
        if (step === "root") {
          onOpenChange(false);
        } else {
          setStep("root");
          setSearch("");
          onOpenChange(false);
        }
      }
      // Handle Backspace/Delete to go back when input is empty
      if ((e.key === "Backspace" || e.key === "Delete") && open && !search.trim()) {
        if (step === "channel-name") {
          e.preventDefault();
          setStep("email-address");
          setSearch(emailPrefix || "");
        } else if (step === "email-address") {
          e.preventDefault();
          setStep("root");
          setSearch("");
          setEmailPrefix("");
          setSelectedDomain("");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, step, onOpenChange, search, emailPrefix, selectedDomain]);

  // Filter domains for email autocomplete
  const availableDomains = domains.filter((d) => d.status === "verified");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[640px] p-0",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-[0.95] data-[state=open]:zoom-in-[0.98]",
          "duration-150"
        )}
        showCloseButton={false}
        onInteractOutside={(e) => {
          // Allow closing by clicking outside, but don't reset state
          // State will only reset when Escape is pressed (handled in keyboard handler)
        }}
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <Command 
          className="rounded-lg border-none" 
          shouldFilter={false}
        >
          {step === "root" && (
            <>
              <CommandInput
                placeholder="Type a command or search..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Actions">
                  <CommandItem
                    onSelect={handleCreateChannelSelect}
                    keywords={["create", "channel", "new"]}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Create new channel</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </>
          )}

          {step === "email-address" && (
            <>
              <CommandInput
                icon={AtSign}
                placeholder="Type email (e.g., support@domain)..."
                value={search}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const atIndex = search.indexOf("@");
                    const prefix = atIndex > -1 ? search.substring(0, atIndex) : emailPrefix;
                    
                    // Only prevent default and proceed if we have a valid email
                    if (prefix.trim() && selectedDomain) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEmailComplete();
                      return false;
                    }
                    // Otherwise, let cmdk handle the Enter to select items
                  }
                }}
                onValueChange={(value) => {
                  // Sanitize email prefix: only letters, numbers, and dots before @
                  // Convert spaces to dots, then filter invalid characters
                  // After @, allow letters, numbers, dots, and hyphens for domain
                  const atIndex = value.indexOf("@");
                  let sanitized = value;
                  if (atIndex > -1) {
                    // Replace spaces with dots in prefix, then filter invalid chars
                    const prefix = value.substring(0, atIndex)
                      .replace(/\s+/g, ".")
                      .replace(/[^a-zA-Z0-9.]/g, "");
                    const domainPart = value.substring(atIndex + 1).replace(/[^a-zA-Z0-9.-]/g, "");
                    sanitized = `${prefix}@${domainPart}`;
                  } else {
                    // Before @, replace spaces with dots, then filter invalid chars
                    sanitized = value.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "");
                  }
                  setSearch(sanitized);
                  // Parse email input - split at @ if present
                  if (atIndex > -1) {
                    const prefix = sanitized.substring(0, atIndex);
                    const domainPart = sanitized.substring(atIndex + 1);
                    setEmailPrefix(prefix);
                    // If domain part matches a domain exactly, auto-select it
                    const matchingDomain = availableDomains.find(
                      (d) => d.domain.toLowerCase() === domainPart.toLowerCase()
                    );
                    if (matchingDomain) {
                      setSelectedDomain(matchingDomain.domain);
                    }
                  } else {
                    setEmailPrefix(sanitized);
                  }
                }}
              />
              <CommandList>
                {availableDomains.length === 0 ? (
                  <CommandEmpty>
                    No domains available. Configure inbound API key first.
                  </CommandEmpty>
                ) : (() => {
                  // Parse search to see if user typed @
                  const searchValue = search || "";
                  const atIndex = searchValue.indexOf("@");
                  const hasAtSymbol = atIndex > -1;
                  
                  // Filter domains based on what's typed after @
                  let filteredDomains = availableDomains;
                  if (hasAtSymbol) {
                    const domainFilter = searchValue.substring(atIndex + 1).toLowerCase();
                    if (domainFilter) {
                      filteredDomains = availableDomains.filter((d) =>
                        d.domain.toLowerCase().includes(domainFilter)
                      );
                    }
                  }

                  // Validate email format - must have valid prefix and selected domain
                  const prefix = hasAtSymbol ? searchValue.substring(0, atIndex) : emailPrefix;
                  const isValidEmail = prefix.trim() && 
                    /^[^\s@]+$/.test(prefix.trim()) && 
                    selectedDomain &&
                    (hasAtSymbol ? filteredDomains.some(d => d.domain === selectedDomain) : true);

                  return (
                    <>
                      {filteredDomains.length === 0 && hasAtSymbol ? (
                        <CommandEmpty>No matching domains.</CommandEmpty>
                      ) : (
                        <CommandGroup heading="Select domain">
                          {filteredDomains.map((domain) => {
                            const displayPrefix = prefix.trim() || emailPrefix.trim();
                            const fullEmail = displayPrefix
                              ? `${displayPrefix}@${domain.domain}`
                              : `@${domain.domain}`;
                            return (
                              <CommandItem
                                key={domain.id}
                                onSelect={() => {
                                  setSelectedDomain(domain.domain);
                                  const rawPrefix = displayPrefix || emailPrefix.trim();
                                  // Sanitize email prefix: remove leading/trailing dots
                                  const sanitizedPrefix = rawPrefix.replace(/^\.+|\.+$/g, "");
                                  
                                  if (sanitizedPrefix) {
                                    // Set the sanitized prefix
                                    setEmailPrefix(sanitizedPrefix);
                                    // Pass values directly to avoid stale state
                                    handleEmailComplete(sanitizedPrefix, domain.domain);
                                  } else {
                                    setSearch(`@${domain.domain}`);
                                  }
                                }}
                                className="flex items-center"
                              >
                                <span className="font-mono text-sm">{fullEmail}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      )}
                      {isValidEmail && (
                        <div className="border-t p-4">
                          <button
                            onClick={() => handleEmailComplete()}
                            className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                          >
                            Continue → {prefix.trim() || emailPrefix}@{selectedDomain}
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CommandList>
            </>
          )}

          {step === "channel-name" && (
            <>
              <div className="border-b px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MailIcon className="h-4 w-4" />
                  <span>Channel name for {emailPrefix}@{selectedDomain}</span>
                </div>
              </div>
              <CommandInput
                icon={Hashtag}
                placeholder="e.g., support, sales-team"
                value={search}
                onKeyDown={handleChannelNameInputKeyDown}
                onValueChange={(value) => {
                  // Sanitize channel name: only letters, numbers, and hyphens
                  // Replace spaces with hyphens
                  const sanitized = value
                    .replace(/\s+/g, "-")
                    .replace(/[^a-zA-Z0-9-]/g, "");
                  setSearch(sanitized);
                }}
              />
              <CommandList>
                <div className="px-4 py-2">
                  <p className="text-xs text-muted-foreground">
                    Press Enter to create
                  </p>
                </div>
              </CommandList>
            </>
          )}

          {step === "creating" && (
            <>
              <div className="border-b px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MailIcon className="h-4 w-4" />
                  <span>Creating channel...</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Step 1: Creating Slack channel */}
                <div className="flex items-center gap-3">
                  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    {creatingSteps.slackChannel ? (
                      <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400 animate-in fade-in duration-300" />
                    ) : (
                      <Loader className="h-5 w-5 animate-spin text-muted-foreground" style={{ animationDuration: "1s" }} />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm transition-colors duration-300",
                    creatingSteps.slackChannel ? "text-foreground" : "text-foreground"
                  )}>
                    Creating Slack channel
                  </span>
                </div>

                {/* Step 2: Creating email address */}
                <div className="flex items-center gap-3">
                  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    {creatingSteps.emailAddress ? (
                      <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400 animate-in fade-in duration-300" />
                    ) : creatingSteps.slackChannel ? (
                      <Loader className="h-5 w-5 animate-spin text-muted-foreground" style={{ animationDuration: "1s" }} />
                    ) : (
                      <div className="h-5 w-5" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm transition-opacity duration-300",
                    creatingSteps.slackChannel ? "text-foreground" : "text-muted-foreground opacity-50"
                  )}>
                    Creating email address
                  </span>
                </div>

                {/* Step 3: Linking channel and email */}
                <div className="flex items-center gap-3">
                  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    {creatingSteps.linking ? (
                      <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400 animate-in fade-in duration-300" />
                    ) : creatingSteps.emailAddress ? (
                      <Loader className="h-5 w-5 animate-spin text-muted-foreground" style={{ animationDuration: "1s" }} />
                    ) : (
                      <div className="h-5 w-5" />
                    )}
                  </div>
                  <span className={cn(
                    "text-sm transition-opacity duration-300",
                    creatingSteps.emailAddress ? "text-foreground" : "text-muted-foreground opacity-50"
                  )}>
                    Linking channel and email
                  </span>
                </div>
              </div>
            </>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

