import type { Metadata } from "next";
import { Geist, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: "500",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "SlackBound - Coming Soon",
  description: "SlackBound waitlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${outfit.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
