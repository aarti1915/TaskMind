import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import DashboardCard from "./DashboardCard";

function TaskCompletionChart({ completed = 0, pending = 0 }) {

    const total = completed + pending;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const data = [
        { name: "Completed", value: completed },
        { name: "Pending", value: pending || (total === 0 ? 1 : 0) }
    ];

    return (
        <DashboardCard>
            <h3 style={{ marginBottom: "12px" }}>Task Completion</h3>

            <div style={{ position: "relative", width: "100%", height: "200px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={62}
                            outerRadius={82}
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            <Cell fill="var(--accent-500)" />
                            <Cell fill="var(--surface-2)" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <span className="mono" style={{ fontSize: "26px", fontWeight: 700 }}>
                        {percent}%
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>complete</span>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px", fontSize: "13px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-500)", display: "inline-block" }} />
                    Completed ({completed})
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--border)", display: "inline-block" }} />
                    Pending ({pending})
                </span>
            </div>
        </DashboardCard>
    );
}

export default TaskCompletionChart;
