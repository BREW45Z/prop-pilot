import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prop Pilot",
    short_name: "Prop Pilot",
    description:
      "A simple risk and drawdown toolkit for disciplined prop traders.",
    start_url: "/",
    display: "standalone",
    background_color: "#050914",
    theme_color: "#050914",
    icons: [
      {
        src: "/brand/prop_pilot_approved_dual_mode_asset_pack/icon-192-dark.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/prop_pilot_approved_dual_mode_asset_pack/icon-512-dark.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
