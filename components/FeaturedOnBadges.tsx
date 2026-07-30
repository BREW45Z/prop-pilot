"use client";

import type { ThemeMode } from "@/lib/wizardConstants";

/**
 * "Featured on" launch-directory badges, shown as one muted row in the landing
 * hero, below the headline and the main CTA.
 *
 * These badges are the condition several directories attach to their dofollow
 * backlink: the link only counts if their badge is embedded on the site. So the
 * anchors below must stay dofollow — do NOT add rel="nofollow". The
 * "noopener noreferrer" below is a security/privacy attribute and does not
 * affect link equity.
 *
 * Badges are plain <img> rather than next/image because each is hosted on a
 * third-party domain that would otherwise need allowlisting in next.config.js,
 * and optimisation buys nothing on a small SVG/PNG badge.
 *
 * To fill a slot: paste the official embed from that directory's dashboard into
 * the matching <li> below, keeping the wrapper classes so it stays muted and
 * sized with the rest of the row.
 */

/** Muted until hover, so badges never compete with the value proposition. */
const badgeLink =
  "inline-flex opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0";

/** Small on mobile, slightly larger from sm up. Width auto-scales with height. */
const badgeImg = "h-7 w-auto sm:h-8";

export default function FeaturedOnBadges({ theme }: { theme: ThemeMode }) {
  const isDark = theme === "dark";

  return (
    <section
      aria-label="Featured on"
      className="grid w-full justify-items-center gap-2"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
        Featured on
      </p>

      <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        {/* --- Fazier -------------------------------------------------- */}
        <li>
          <a
            href="https://fazier.com/launches/apropilot.com"
            target="_blank"
            rel="noopener noreferrer"
            className={badgeLink}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://fazier.com/api/v1/public/badges/launch_badges.svg?badge_type=launched&theme=${
                isDark ? "dark" : "light"
              }`}
              alt="Prop Pilot — featured on Fazier"
              className={badgeImg}
              width={120}
              height={32}
              loading="lazy"
            />
          </a>
        </li>

        {/* --- Startup Fame --------------------------------------------
            TODO: paste the official verification badge from startupfa.me.
            Shape:
              <a href="https://startupfa.me/s/<slug>" target="_blank"
                 rel="noopener noreferrer" className={badgeLink}>
                <img src="https://startupfa.me/badges/featured/<variant>.webp"
                     alt="Prop Pilot — featured on Startup Fame"
                     className={badgeImg} width={120} height={32} loading="lazy" />
              </a>
            Startup Fame ships separate light/dark badge files rather than a
            theme query param, so choose the file with `isDark`.
            This badge must stay embedded for the listing to verify.
            ------------------------------------------------------------- */}

        {/* --- TinyLaunch ----------------------------------------------
            TODO: paste the official badge from tinylaunch.com.
            Shape:
              <a href="https://tinylaunch.com/launch/<id>" target="_blank"
                 rel="noopener noreferrer" className={badgeLink}>
                <img src="https://tinylaunch.com/tinylaunch_badge_<variant>.svg"
                     alt="Prop Pilot — featured on TinyLaunch"
                     className={badgeImg} width={120} height={32} loading="lazy" />
              </a>
            Keep the link dofollow.
            ------------------------------------------------------------- */}

        {/* --- Product Hunt --------------------------------------------
            TODO: add after the PH launch. Dashboard: "Embed" tab on the
            launch page. Shape:
              <a href="https://www.producthunt.com/posts/<slug>?embed=true"
                 target="_blank" rel="noopener noreferrer" className={badgeLink}>
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=<id>&theme=dark"
                     alt="Prop Pilot — featured on Product Hunt"
                     className={badgeImg} width={120} height={32} loading="lazy" />
              </a>
            The widget takes &theme=dark|light — wire it to `isDark` like
            Fazier above so it tracks the site theme. Keep the link dofollow.
            ------------------------------------------------------------- */}
      </ul>
    </section>
  );
}
