import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import DashboardCard from "../DashboardCard";

function DailyStudyChart({ data, height = 260 }) {

    return (
        <DashboardCard>
            <h2>Daily Study Time</h2>

            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data}>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                    />

                    <XAxis
                        dataKey="date"
                        tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                        axisLine={{ stroke: "var(--border)" }}
                        tickLine={{ stroke: "var(--border)" }}
                    />

                    <YAxis
                        tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                        axisLine={{ stroke: "var(--border)" }}
                        tickLine={{ stroke: "var(--border)" }}
                    />

                    <Tooltip
                        contentStyle={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            color: "var(--text)"
                        }}
                        labelStyle={{ color: "var(--text)" }}
                    />

                    <Line
                        type="monotone"
                        dataKey="total_minutes"
                        stroke="var(--accent-500)"
                        strokeWidth={2.5}
                        dot={{ fill: "var(--accent-500)", r: 3 }}
                    />

                </LineChart>
            </ResponsiveContainer>
        </DashboardCard>
    );
}

export default DailyStudyChart;
