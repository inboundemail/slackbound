"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { addToWaitlist } from "./actions/waitlist";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    const result = await addToWaitlist(email);
    setIsLoading(false);

    if (result.success) {
      toast.success("Successfully joined the waitlist!");
      setEmail("");
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#FBFBFB" }}>
      <main className="flex flex-col items-center gap-8 px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 
            className="flex items-center gap-3 font-outfit text-6xl font-semibold"
            style={{ color: "#414141" }}
          >
            <Image src="/images/slackbound-icon.png" alt="Slackbound icon" className="h-14 w-14" />
            slackbound
          </h1>
          <p 
            className="font-geist text-lg font-medium"
            style={{ 
              color: "#414141",
              letterSpacing: "-0.04em"
            }}
          >
            coming soon
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="flex-1"
            style={{ color: "#414141" }}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      </main>
    </div>
  );
}
