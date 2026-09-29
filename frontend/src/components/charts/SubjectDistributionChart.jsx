import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import DashboardCard from "../DashboardCard";

// Cycled by index across slices — extend this if you expect a user
// to regularly have more than 8 subjects at once.
const COLORS = [
    "#ff5a36",
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#06b6d4",
    "#a855f7",
    "#ec4899",
    "#84cc16"
];

function SubjectDistributionChart({ data, height = 260 }) {

    return (
        <DashboardCard>
            <h2>Subject Study Distribution</h2>

            <ResponsiveContainer width="100%" height={height}>
                <PieChart>

                    <Pie
                        data={data}
                        dataKey="total_minutes"
                        nameKey="subject_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        contentStyle={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            color: "var(--text)"
                        }}
                        labelStyle={{ color: "var(--text)" }}
                    />

                    <Legend
                        wrapperStyle={{ color: "var(--text-muted)", fontSize: "13px" }}
                    />

                </PieChart>
            </ResponsiveContainer>
        </DashboardCard>
    );
}

export default SubjectDistributionChart;
