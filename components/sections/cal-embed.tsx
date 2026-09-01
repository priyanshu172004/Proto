"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { useTheme } from "next-themes";

const NAMESPACE = "booking";

/**
 * Cal.com inline scheduler, themed to match the site. Split into its own module
 * so the embed only enters the bundle when the booking dialog is opened.
 *
 * Theme and layout go through the `config` prop so they are applied as the
 * iframe is created. The `ui` call only adds brand colour on top and is
 * deliberately fire-and-forget: it races iframe creation and throws
 * "createIframe must be called before doInIframe" if it wins, which is a
 * console error for a purely cosmetic tweak.
 */
export function CalEmbed({ link }: { link: string }) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cal = await getCalApi({ namespace: NAMESPACE });
        if (cancelled) return;
        cal("ui", {
          cssVarsPerTheme: {
            light: { "cal-brand": "#047857" },
            dark: { "cal-brand": "#10b981" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch {
        // Brand colour is optional; the embed renders correctly without it.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [theme]);

  return (
    <Cal
      namespace={NAMESPACE}
      calLink={link}
      style={{ width: "100%", height: "560px", overflow: "scroll" }}
      config={{ layout: "month_view", theme }}
    />
  );
}
