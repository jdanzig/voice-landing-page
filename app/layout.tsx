import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice Launchpad",
  description: "Generate a shareable voice-powered landing page in under a minute."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
