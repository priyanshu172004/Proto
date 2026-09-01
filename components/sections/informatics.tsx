import dynamic from "next/dynamic";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/primitives/section";
import { Reveal } from "@/components/primitives/reveal";
import { GithubIcon, LeetCodeIcon } from "@/components/primitives/brand-icons";
import {
  getGithubCalendar,
  getLeetcodeCalendar,
  level,
  monthlySeries,
  type Calendar,
} from "@/lib/contributions";
import { socials } from "@/data/socials";
import { cn } from "@/lib/utils";

const ActivityRadar = dynamic(() =>
  import("./activity-radar").then((m) => m.ActivityRadar),
);

/**
 * Server component — both calendars are fetched at build and revalidated
 * hourly. Every path can fail, and when it does the card says so and links out
 * rather than rendering an invented grid.
 */
export async function Informatics() {
  const [github, leetcode] = await Promise.all([getGithubCalendar(), getLeetcodeCalendar()]);
  // Twelve axes, not six: with a 335-to-0 spread across recent months a
  // six-point radar collapses into a single spike. A full year distributes the
  // same real numbers into a shape you can actually read, and it matches the
  // 12-month window of the two calendars above.
  const months = monthlySeries(github, leetcode, 12);
  const hasSeries = months.some((m) => m.github > 0 || m.leetcode > 0);
  const window = months.length
    ? `${months[0].month} – ${months[months.length - 1].month}`
    : "";
  const busiest = months.reduce(
    (best, m) => (m.github + m.leetcode > best.github + best.leetcode ? m : best),
    months[0] ?? { month: "", github: 0, leetcode: 0 },
  );

  return (
    <Section id="informatics">
      <Container>
        <SectionHeader
          index="07"
          eyebrow="Engineering Activity"
          title="The commit log."
          lede="Pulled live from GitHub and LeetCode. Nothing here is illustrative."
          className="mb-14"
        />

        <div className="grid gap-3 lg:grid-cols-2">
          <Reveal className="min-w-0">
            <ActivityCard
              title="GitHub"
              handle={`@${socials.githubUser}`}
              href={socials.github}
              icon={<GithubIcon className="size-4" />}
              calendar={github}
              caption={
                github?.source === "events"
                  ? "Recent public events · last 14 weeks"
                  : github
                    ? "Contributions · last 12 months"
                    : undefined
              }
              unit={github?.source === "events" ? "events" : "contributions"}
            />
          </Reveal>

          <Reveal delay={0.08} className="min-w-0">
            <ActivityCard
              title="LeetCode"
              handle={`@${socials.leetcodeUser}`}
              href={socials.leetcode}
              icon={<LeetCodeIcon className="size-4" />}
              calendar={leetcode}
              caption={leetcode ? "Submissions · last 12 months" : undefined}
              unit="submissions"
            />
          </Reveal>

          {hasSeries && (
            <Reveal delay={0.14} className="min-w-0 lg:col-span-2">
              <article className="card-surface grid min-w-0 gap-6 rounded-md p-5 sm:p-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-center">
                <ActivityRadar data={months} />

                <div className="min-w-0">
                  <p className="doto text-[10px] text-fg-faint">Overall activity</p>
                  <h3 className="mt-2 text-h3 leading-tight font-medium text-fg">
                    Twelve months, both surfaces.
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-caption text-fg-muted">
                    Monthly totals from the two calendars above, plotted together so the shape of
                    a working month is visible at a glance.
                  </p>

                  <ul className="mt-6 flex flex-col gap-2.5">
                    <li className="flex items-center gap-3">
                      <span aria-hidden className="h-2.5 w-5 rounded-[2px] bg-accent/60 ring-1 ring-accent" />
                      <span className="font-mono text-[11px] text-fg-muted">
                        GitHub contributions
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="h-0 w-5 border-t border-dashed border-fg-muted"
                      />
                      <span className="font-mono text-[11px] text-fg-muted">
                        LeetCode submissions
                      </span>
                    </li>
                  </ul>

                  <p className="mt-6 flex items-center gap-2 border-t border-line pt-4 font-mono text-[11px] text-fg-muted">
                    <TrendingUp className="size-3.5 text-accent" />
                    Busiest month · <span className="text-fg">{busiest.month}</span>
                    <span className="text-fg-faint">({window})</span>
                  </p>
                </div>
              </article>
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  );
}

function ActivityCard({
  title,
  handle,
  href,
  icon,
  calendar,
  caption,
  unit,
}: {
  title: string;
  handle: string;
  href: string;
  icon: React.ReactNode;
  calendar: Calendar | null;
  caption?: string;
  unit?: string;
}) {
  return (
    <article className="card-surface flex h-full min-w-0 flex-col rounded-md p-5 sm:p-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-line bg-surface-2 text-fg-muted">
            {icon}
          </span>
          <div>
            <p className="doto text-[11px] text-fg">{title}</p>
            <p className="font-mono text-[11px] text-fg-muted">{handle}</p>
          </div>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="doto inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[10px] text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
        >
          Profile
          <ArrowUpRight className="size-3" />
        </a>
      </header>

      {calendar ? (
        <>
          <Heatmap calendar={calendar} />
          <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="font-mono text-[11px] text-fg-muted">{caption}</p>
            <p className="doto text-[11px] text-fg">
              <span className="text-accent">{calendar.total.toLocaleString()}</span>{" "}
              {unit ?? "submissions"}
            </p>
          </footer>
        </>
      ) : (
        <EmptyState title={title} href={href} />
      )}
    </article>
  );
}

/**
 * 7×N grid, oldest column first. Cell size scales with the number of weeks so a
 * 14-week events window and a 53-week calendar both fill their card instead of
 * one of them stranding in a half-empty panel. Native titles give per-cell
 * detail for free.
 */
function Heatmap({ calendar }: { calendar: Calendar }) {
  const max = Math.max(...calendar.days.map((d) => d.count), 1);
  const leading = new Date(`${calendar.days[0]?.date}T00:00:00Z`).getUTCDay();
  const cells = [...Array.from({ length: leading }, () => null), ...calendar.days];
  const weeks = Math.ceil(cells.length / 7);
  // A short window gets slightly larger cells, capped so the two cards stay
  // roughly the same height; the narrower grid is centred rather than stranded.
  const size = weeks > 40 ? 10 : 14;
  const gap = 3;

  const tones = [
    "bg-surface-2",
    "bg-accent/25",
    "bg-accent/45",
    "bg-accent/70",
    "bg-accent",
  ] as const;

  return (
    <div className={cn("min-w-0 overflow-x-auto pb-1", weeks <= 40 && "flex justify-center")}>
      <div
        className="grid w-max grid-flow-col grid-rows-7"
        style={{ gap }}
        role="img"
        aria-label={`${calendar.total} recorded across ${calendar.days.length} days`}
      >
        {cells.map((day, i) =>
          day === null ? (
            <span key={`pad-${i}`} style={{ width: size, height: size }} />
          ) : (
            <span
              key={day.date}
              title={`${day.date} · ${day.count}`}
              style={{ width: size, height: size }}
              className={cn("rounded-[2px]", tones[level(day.count, max)])}
            />
          ),
        )}
      </div>
    </div>
  );
}

function EmptyState({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-3 rounded-sm border border-dashed border-line-strong px-5 py-10">
      <p className="doto text-[10px] text-fg-faint">Live data unavailable</p>
      <p className="max-w-[38ch] text-caption text-fg-muted">
        The {title} activity feed could not be reached at build time. Rather than show an
        approximation, the graph is omitted.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="doto inline-flex items-center gap-1 text-[10px] text-accent hover:underline"
      >
        Open the profile
        <ArrowUpRight className="size-3" />
      </a>
    </div>
  );
}
