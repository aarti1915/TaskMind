const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatClock(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, "0");

    return h > 0
        ? `${h}:${pad(m)}:${pad(s)}`
        : `${pad(m)}:${pad(s)}`;
}

// Purely a visual redesign of the existing start/end session flow — the
// backend still just tracks start_time/end_time. The ring represents
// progress through the current focus block (length set in Settings) and
// loops; the center clock shows total elapsed time for the whole session.
function PomodoroTimer({ elapsedSeconds, label, focusMinutes = 25 }) {

    const focusSeconds = focusMinutes * 60;
    const cycleSeconds = elapsedSeconds % focusSeconds;
    const cycleNumber = Math.floor(elapsedSeconds / focusSeconds) + 1;
    const progress = cycleSeconds / focusSeconds;
    const offset = CIRCUMFERENCE * (1 - progress);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
            <div style={{ position: "relative", width: "220px", height: "220px" }}>
                <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: "rotate(-90deg)" }}>
                    <circle
                        cx="110"
                        cy="110"
                        r={RADIUS}
                        fill="none"
                        stroke="var(--surface-2)"
                        strokeWidth="12"
                    />
                    <circle
                        cx="110"
                        cy="110"
                        r={RADIUS}
                        fill="none"
                        stroke="var(--accent-500)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 1s linear" }}
                    />
                </svg>

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px"
                    }}
                >
                    <span className="mono" style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                        {formatClock(elapsedSeconds)}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                        Focus block #{cycleNumber}
                    </span>
                </div>
            </div>

            {label && (
                <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text)", fontWeight: 600 }}>
                    {label}
                </p>
            )}
        </div>
    );
}

export default PomodoroTimer;
