import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    BookOpen,
    Clock,
    CalendarCheck2,
    User,
    Settings,
    GraduationCap,
    X
} from "lucide-react";

const NAV_ITEMS = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/subjects", label: "Subjects", icon: BookOpen },
    { to: "/planner", label: "Daily Planner", icon: CalendarCheck2 },
    { to: "/study-sessions", label: "Study Sessions", icon: Clock }
];

const FOOTER_ITEMS = [
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings }
];

function NavItem({ to, label, icon: Icon, onNavigate }) {
    return (
        <NavLink
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
                `sidebar-link${isActive ? " sidebar-link-active" : ""}`
            }
        >
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
        </NavLink>
    );
}

function Sidebar({ open, onClose }) {
    return (
        <>
            {/* Backdrop, mobile only, closes the drawer on tap-outside */}
            <div
                className={`sidebar-backdrop${open ? " sidebar-backdrop-visible" : ""}`}
                onClick={onClose}
            />

            <aside className={`sidebar${open ? " sidebar-open" : ""}`}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-mark">
                        <GraduationCap size={20} strokeWidth={2.4} />
                    </div>
                    <span>TaskMind</span>

                    <button
                        className="btn-icon btn-ghost sidebar-close"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item) => (
                        <NavItem key={item.to} {...item} onNavigate={onClose} />
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {FOOTER_ITEMS.map((item) => (
                        <NavItem key={item.to} {...item} onNavigate={onClose} />
                    ))}
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
