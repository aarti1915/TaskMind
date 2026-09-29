function StatCard({ title, value, icon: Icon, accent = false }) {

    return (
        <div className="card stat-card">
            <div className={`stat-card-icon${accent ? " stat-card-icon-accent" : ""}`}>
                {Icon && <Icon size={16} strokeWidth={2.2} />}
            </div>

            <div style={{ minWidth: 0 }}>
                <p className="stat-card-label">{title}</p>
                <p className="stat-card-value mono">{value}</p>
            </div>
        </div>
    );
}

export default StatCard;
