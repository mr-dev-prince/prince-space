import { IContributionDay } from "../interfaces/components";
import { Links } from "../constants/links";

const USERNAME = "mr-dev-prince";
const API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
const WEEKS_DESKTOP = 40;
const WEEKS_MOBILE = 20;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const LEVEL_STYLES: Record<IContributionDay["level"], string> = {
  0: "bg-[#161b22]",
  1: "bg-[#0e4429]",
  2: "bg-[#006d32]",
  3: "bg-[#26a641]",
  4: "bg-[#39d353]",
};

type Cell = IContributionDay | null;

const dayOfWeek = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();
const monthOf = (date: string) => Number(date.slice(5, 7)) - 1;

async function getContributions(): Promise<{
  days: IContributionDay[];
  total: number;
}> {
  try {
    const res = await fetch(API, { next: { revalidate: 60 * 60 * 12 } });
    if (!res.ok) throw new Error(`GitHub contributions API: ${res.status}`);
    const json = await res.json();
    return {
      days: json.contributions ?? [],
      total: json.total?.lastYear ?? 0,
    };
  } catch {
    return { days: [], total: 0 };
  }
}

const buildGrid = (days: IContributionDay[], maxWeeks: number) => {
  const leading = dayOfWeek(days[0].date);
  const trailing = (7 - ((leading + days.length) % 7)) % 7;
  const cells = [
    ...Array<null>(leading).fill(null),
    ...days,
    ...Array<null>(trailing).fill(null),
  ].slice(-maxWeeks * 7) as Cell[];
  const weeks = cells.length / 7;
  const shownTotal = cells.reduce((sum, day) => sum + (day?.count ?? 0), 0);

  const labels: { col: number; text: string }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const first = cells.slice(w * 7, w * 7 + 7).find(Boolean);
    if (!first) continue;
    const month = monthOf(first.date);
    if (month !== lastMonth) {
      labels.push({ col: w, text: MONTHS[month] });
      lastMonth = month;
    }
  }
  if (labels.length > 1 && labels[1].col - labels[0].col < 3) labels.shift();

  return { cells, weeks, labels, shownTotal };
};

const Graph = ({
  days,
  maxWeeks,
  total,
}: {
  days: IContributionDay[];
  maxWeeks: number;
  total: number;
}) => {
  const { cells, weeks, labels, shownTotal } = buildGrid(days, maxWeeks);
  const columns = `repeat(${weeks}, minmax(0, 1fr))`;
  const monthsShown = Math.round((weeks * 7) / 30.44);

  return (
    <>
      <div
        className="mb-2 grid gap-[3px] md:gap-1"
        style={{ gridTemplateColumns: columns }}
      >
        {labels.map((label) => (
          <span
            key={`${label.text}-${label.col}`}
            style={{ gridColumnStart: label.col + 1 }}
            className="whitespace-nowrap text-xs font-light text-white/50 md:text-sm"
          >
            {label.text}
          </span>
        ))}
      </div>
      <div
        className="grid grid-flow-col gap-[3px] md:gap-1"
        style={{
          gridTemplateColumns: columns,
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
        }}
      >
        {cells.map((day, index) =>
          day ? (
            <div
              key={day.date}
              title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
              className={`aspect-square rounded-[3px] lg:rounded-md ${LEVEL_STYLES[day.level]}`}
            />
          ) : (
            <div key={`pad-${index}`} />
          ),
        )}
      </div>
      <p className="mt-3 text-right text-[11px] font-light text-white/40 sm:text-xs">
        {shownTotal} contributions in the last {monthsShown} months · {total}{" "}
        in the last year
      </p>
    </>
  );
};

const GithubActivity = async () => {
  const { days, total } = await getContributions();

  if (!days.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 text-sm font-light text-white/50">
        Couldn&apos;t load contributions right now. See them on{" "}
        <a
          href={Links.github}
          target="_blank"
          rel="noreferrer"
          className="text-white/80 underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 md:p-4">
      <div className="md:hidden">
        <Graph days={days} maxWeeks={WEEKS_MOBILE} total={total} />
      </div>
      <div className="hidden md:block">
        <Graph days={days} maxWeeks={WEEKS_DESKTOP} total={total} />
      </div>
    </div>
  );
};

export default GithubActivity;
