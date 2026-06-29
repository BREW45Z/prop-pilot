import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Prop Pilot",
  description:
    "A simple risk and drawdown toolkit for disciplined prop traders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={geist.variable} lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
