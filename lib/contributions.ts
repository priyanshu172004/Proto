import { socials } from "@/data/socials";

export type Day = { date: string; count: number };

export type Calendar = {
  days: Day[];
  total: number;
  /** How the data was obtained — the UI labels itself honestly from this. */
  source: "graphql" | "public-api" | "events" | "leetcode";
  since?: string;
};

const REVALIDATE = 3600;

function emptyGrid(weeks: number): Day[] {
  const days: Day[] = [];
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (weeks * 7 - 1));
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  return days;
}

/**
 * GitHub contributions, in descending order of fidelity:
 *
 *  1. GraphQL with a token — the authoritative 12-month calendar.
 *  2. A public contributions mirror — the same 12 months, no auth required.
 *  3. Public events — roughly 14 weeks, and the UI says so rather than
 *     passing a partial window off as a full year.
 *
 * Every tier can fail; the caller then renders an empty state, never a
 * fabricated grid.
 */
export async function getGithubCalendar(): Promise<Calendar | null> {
  const token = process.env.GITHUB_TOKEN;
  const user = socials.githubUser;

  if (token) {
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `query($login:String!){
            user(login:$login){
              contributionsCollection{
                contributionCalendar{
                  totalContributions
                  weeks{ contributionDays{ date contributionCount } }
                }
              }
            }
          }`,
          variables: { login: user },
        }),
        next: { revalidate: REVALIDATE },
      });
      if (!res.ok) throw new Error(`github ${res.status}`);
      const json = await res.json();
      const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
      if (!calendar) throw new Error("no calendar");

      const days: Day[] = calendar.weeks.flatMap(
        (w: { contributionDays: { date: string; contributionCount: number }[] }) =>
          w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
      );
      return { days, total: calendar.totalContributions, source: "graphql" };
    } catch {
      // fall through to the unauthenticated path
    }
  }

  // Tier 2: public mirror of the same contribution calendar, no auth needed.
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${user}?y=last`,
      { next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) throw new Error(`mirror ${res.status}`);
    const json: { contributions?: { date: string; count: number }[] } = await res.json();
    const raw = json.contributions;
    if (!Array.isArray(raw) || raw.length < 300) throw new Error("mirror shape");

    // Trim to the trailing 53 weeks so the grid always starts on a week boundary.
    const days: Day[] = raw
      .slice(-371)
      .map((d) => ({ date: d.date, count: d.count ?? 0 }));
    const total = days.reduce((sum, d) => sum + d.count, 0);
    return { days, total, source: "public-api" };
  } catch {
    // fall through to the events window
  }

  try {
    const res = await fetch(`https://api.github.com/users/${user}/events/public?per_page=100`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error(`events ${res.status}`);
    const events: { created_at: string }[] = await res.json();

    const grid = emptyGrid(14);
    const index = new Map(grid.map((d, i) => [d.date, i]));
    let total = 0;
    for (const event of events) {
      const key = event.created_at.slice(0, 10);
      const at = index.get(key);
      if (at !== undefined) {
        grid[at].count += 1;
        total += 1;
      }
    }
    return { days: grid, total, source: "events", since: grid[0]?.date };
  } catch {
    return null;
  }
}

/**
 * LeetCode submission calendar via their public GraphQL endpoint —
 * unauthenticated, cached, and allowed to fail into an empty state.
 */
export async function getLeetcodeCalendar(): Promise<Calendar | null> {
  const user = socials.leetcodeUser;
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (portfolio-site)",
      },
      body: JSON.stringify({
        query: `query userProfileCalendar($username: String!) {
          matchedUser(username: $username) {
            userCalendar { submissionCalendar totalActiveDays streak }
          }
        }`,
        variables: { username: user },
      }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error(`leetcode ${res.status}`);
    const json = await res.json();
    const raw = json?.data?.matchedUser?.userCalendar?.submissionCalendar;
    if (!raw) throw new Error("no calendar");

    const parsed: Record<string, number> = JSON.parse(raw);
    const counts = new Map<string, number>();
    for (const [seconds, count] of Object.entries(parsed)) {
      const date = new Date(Number(seconds) * 1000).toISOString().slice(0, 10);
      counts.set(date, (counts.get(date) ?? 0) + count);
    }

    const grid = emptyGrid(53).map((d) => ({ ...d, count: counts.get(d.date) ?? 0 }));
    const total = grid.reduce((sum, d) => sum + d.count, 0);
    return { days: grid, total, source: "leetcode" };
  } catch {
    return null;
  }
}

/** Five steps, quantile-ish against the period's own maximum. */
export function level(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (max <= 1) return 4;
  const ratio = count / max;
  if (ratio > 0.66) return 4;
  if (ratio > 0.4) return 3;
  if (ratio > 0.18) return 2;
  return 1;
}

export type MonthPoint = {
  month: string;
  github: number;
  leetcode: number;
};

/**
 * Rolls both calendars up into the trailing `months` calendar months.
 *
 * Real counts only — a month with no activity reports 0 rather than being
 * dropped, so the radar's shape is honest about quiet periods.
 */
export function monthlySeries(
  github: Calendar | null,
  leetcode: Calendar | null,
  months = 6,
): MonthPoint[] {
  const now = new Date();
  const buckets: MonthPoint[] = [];
  const index = new Map<string, number>();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    index.set(key, buckets.length);
    buckets.push({
      month: d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" }),
      github: 0,
      leetcode: 0,
    });
  }

  const add = (calendar: Calendar | null, field: "github" | "leetcode") => {
    if (!calendar) return;
    for (const day of calendar.days) {
      const at = index.get(day.date.slice(0, 7));
      if (at !== undefined) buckets[at][field] += day.count;
    }
  };

  add(github, "github");
  add(leetcode, "leetcode");
  return buckets;
}
