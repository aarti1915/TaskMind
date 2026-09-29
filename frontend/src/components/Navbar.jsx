import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const PAGE_TITLES = {
    "/dashboard": "Dashboard",
    "/subjects": "Subjects",
    "/planner": "Daily Planner",
    "/study-sessions": "Study Sessions",
    "/profile": "Profile",
    "/settings": "Settings"
};

function getInitials(name) {
    if (!name) return "?";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

function Navbar({ onMenuClick }) {

    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const title = PAGE_TITLES[location.pathname] || "TaskMind";

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button
                    className="btn-icon btn-ghost topbar-menu-btn"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <h3 className="topbar-title">{title}</h3>
            </div>

            <div className="topbar-right">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle dark mode"
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </button>

                <button
                    className="btn-icon btn-ghost"
                    onClick={handleLogout}
                    aria-label="Log out"
                    title="Log out"
                >
                    <LogOut size={18} />
                </button>

                <div className="avatar" title={user?.full_name || ""}>
                    {getInitials(user?.full_name)}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
