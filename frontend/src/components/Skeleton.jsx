// Generic pulsing placeholders shown while data is loading, instead of
// a blank screen or a "Loading..." text message.

export function SkeletonBlock({ width = "100%", height = "16px", style = {} }) {
    return (
        <div
            className="skeleton"
            style={{ width, height, ...style }}
        />
    );
}

export function SkeletonStatCard() {
    return (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <SkeletonBlock width="60%" height="13px" />
            <SkeletonBlock width="40%" height="28px" />
        </div>
    );
}

export function SkeletonStatGrid({ count = 8 }) {
    return (
        <div className="grid grid-stats">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonStatCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonChartCard({ height = 300 }) {
    return (
        <div className="card">
            <SkeletonBlock width="35%" height="16px" style={{ marginBottom: "18px" }} />
            <SkeletonBlock width="100%" height={`${height}px`} style={{ borderRadius: "12px" }} />
        </div>
    );
}

export function SkeletonListCard({ rows = 3 }) {
    return (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <SkeletonBlock width="30%" height="16px" />
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonBlock key={i} width="100%" height="42px" style={{ borderRadius: "10px" }} />
            ))}
        </div>
    );
}
