import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const title = "Prop Pilot";
const description =
  "A simple risk and drawdown toolkit for disciplined prop traders.";
// og-image-light.png is a correctly sized 1200x630 image. Using a single,
// correctly declared image avoids broken/mismatched social previews.
const previewImage =
  "/brand/prop_pilot_approved_dual_mode_asset_pack/og-image-light.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://apropilot.com"),
  title,
  description,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/brand/prop_pilot_approved_dual_mode_asset_pack/favicon-64-dark.png",
    apple:
      "/brand/prop_pilot_approved_dual_mode_asset_pack/apple-touch-icon-light.png",
  },
  openGraph: {
    title,
    description,
    url: "https://apropilot.com",
    siteName: "Prop Pilot",
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "Prop Pilot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [previewImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050914" },
    { media: "(prefers-color-scheme: light)", color: "#bcc4d0" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={geist.variable} lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
