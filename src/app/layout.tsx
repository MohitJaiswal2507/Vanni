import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VANNI AI",
    template: "%s | VANNI AI",
  },
  description: "VANNI AI is an AI-powered meeting workspace that lets you create AI agents, conduct intelligent meetings, generate transcripts, summaries, and actionable insights.",
  applicationName: "VANNI AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${inter.className} antialiased`}
          >
            <Toaster />
            {children}
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
