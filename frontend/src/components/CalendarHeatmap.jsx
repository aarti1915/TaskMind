const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function toDateKey(date) {
    return date.toISOString().slice(0, 10);
}

function intensityLevel(minutes) {
    if (!minutes || minutes <= 0) return 0;
    if (minutes <= 30) return 1;
    if (minutes <= 60) return 2;
    if (minutes <= 120) return 3;
    return 4;
}

// data: [{ date: "2026-07-30", total_minutes: 45 }, ...]
function CalendarHeatmap({ data = [], weeks = 20 }) {

    const minutesByDay = {};
    data.forEach((entry) => {
        const key = String(entry.date).slice(0, 10);
        minutesByDay[key] = entry.total_minutes || 0;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Align the grid to start on a Sunday so weeks stack as clean columns.
    const totalDays = weeks * 7;
    const start = new Date(today);
    start.setDate(start.getDate() - (totalDays - 1) - today.getDay());

    const columns = [];
    let cursor = new Date(start);

    for (let w = 0; w < weeks; w++) {
        const column = [];
        for (let d = 0; d < 7; d++) {
            column.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }
        columns.push(column);
    }

    // Figure out which columns deserve a month label (first time we see
    // a new month within that column's days).
    const monthLabels = columns.map((column, i) => {
        const firstOfMonth = column.find((d) => d.getDate() <= 7);
        if (!firstOfMonth) return null;

        const prevColumn = columns[i - 1];
        const alreadyLabeled =
            prevColumn && prevColumn.some((d) => d.getMonth() === firstOfMonth.getMonth());

        return alreadyLabeled ? null : MONTH_LABELS[firstOfMonth.getMonth()];
    });

    const totalMinutes = data.reduce((sum, d) => sum + (d.total_minutes || 0), 0);
    const activeDays = data.filter((d) => (d.total_minutes || 0) > 0).length;

    return (
        <div className="card">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                <h3>Study Activity</h3>
                <p style={{ fontSize: "13px" }}>
                    {activeDays} active day{activeDays === 1 ? "" : "s"} · {Math.round(totalMinutes / 60)}h total
                </p>
            </div>

            <div style={{ overflowX: "auto", paddingBottom: "6px" }}>
                <div style={{ display: "inline-flex", gap: "10px" }}>

                    <div style={{ display: "flex", flexDirection: "column", gap: "3px", paddingTop: "18px" }}>
                        {DAY_LABELS.map((label, i) => (
                            <span key={i} style={{ height: "13px", fontSize: "10px", color: "var(--text-faint)", lineHeight: "13px" }}>
                                {label}
                            </span>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: "3px" }}>
                        {columns.map((column, colIndex) => (
                            <div key={colIndex} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                <span style={{ height: "14px", fontSize: "10px", color: "var(--text-faint)", display: "block" }}>
                                    {monthLabels[colIndex] || ""}
                                </span>

                                {column.map((date, rowIndex) => {
                                    const isFuture = date > today;
                                    const key = toDateKey(date);
                                    const minutes = minutesByDay[key] || 0;
                                    const level = intensityLevel(minutes);

                                    return (
                                        <div
                                            key={rowIndex}
                                            title={
                                                isFuture
                                                    ? ""
                                                    : `${date.toDateString()} — ${minutes} min studied`
                                            }
                                            style={{
                                                width: "13px",
                                                height: "13px",
                                                borderRadius: "3px",
                                                background: isFuture
                                                    ? "transparent"
                                                    : `var(--heat-${level})`,
                                                visibility: isFuture ? "hidden" : "visible"
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "14px", fontSize: "11px", color: "var(--text-faint)" }}>
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        style={{ width: "12px", height: "12px", borderRadius: "3px", background: `var(--heat-${level})` }}
                    />
                ))}
                <span>More</span>
            </div>
        </div>
    );
}

export default CalendarHeatmap;
