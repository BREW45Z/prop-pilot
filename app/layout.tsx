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
  icons: {
    icon: "/brand/prop_pilot_approved_dual_mode_asset_pack/favicon-64-dark.png",
    apple:
      "/brand/prop_pilot_approved_dual_mode_asset_pack/apple-touch-icon-light.png",
  },
  openGraph: {
    title: "Prop Pilot",
    description:
      "A simple risk and drawdown toolkit for disciplined prop traders.",
    images: [
      "/brand/prop_pilot_approved_dual_mode_asset_pack/og-image-dark.png",
    ],
  },
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
