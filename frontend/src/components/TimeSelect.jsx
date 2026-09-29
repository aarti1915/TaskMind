const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);

function pad(n) {
    return String(n).padStart(2, "0");
}

// value: { hour: 1-12, minute: 0-59, period: "AM" | "PM" }
function TimeSelect({ value, onChange, idPrefix }) {

    return (
        <div style={{ display: "flex", gap: "6px" }}>
            <select
                id={`${idPrefix}-hour`}
                aria-label="Hour"
                value={value.hour}
                onChange={(e) => onChange({ ...value, hour: Number(e.target.value) })}
                style={{ flex: 1 }}
            >
                {HOURS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                ))}
            </select>

            <select
                id={`${idPrefix}-minute`}
                aria-label="Minute"
                value={value.minute}
                onChange={(e) => onChange({ ...value, minute: Number(e.target.value) })}
                style={{ flex: 1 }}
            >
                {Array.from({ length: 60 }, (_, m) => (
                    <option key={m} value={m}>{pad(m)}</option>
                ))}
            </select>

            <select
                id={`${idPrefix}-period`}
                aria-label="AM or PM"
                value={value.period}
                onChange={(e) => onChange({ ...value, period: e.target.value })}
                style={{ flex: 1 }}
            >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    );
}

export function to24Hour({ hour, minute, period }) {
    let h24 = hour % 12;
    if (period === "PM") h24 += 12;
    return { hour: h24, minute };
}

export default TimeSelect;
