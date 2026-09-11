const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function buildRows(year: number, month: number /* 1-12 */): (number | null)[][] {
  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export default function MonthCalendar({
  year,
  month,
  highlightDay,
}: {
  year: number;
  month: number; // 1-12
  highlightDay: number;
}) {
  const rows = buildRows(year, month);

  return (
    <table className="w-full border-collapse text-center">
      <thead>
        <tr>
          {WEEKDAYS.map((w, i) => (
            <th
              key={w}
              className={`pb-3 text-xs font-medium ${
                i === 0 ? "text-rose-300" : "text-neutral-400"
              }`}
            >
              {w}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((day, ci) => {
              const isSunday = ci === 0;
              const isHighlight = day === highlightDay;
              return (
                <td key={ci} className="py-1.5">
                  {day && (
                    <span
                      className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                        isHighlight
                          ? "bg-rose-300 font-semibold text-white"
                          : isSunday
                          ? "text-rose-300"
                          : "text-neutral-700"
                      }`}
                    >
                      {day}
                    </span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
