import { useState } from "react";
import toast from "react-hot-toast";
import { Moon, Sun, Timer, ShieldCheck } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getPomodoroMinutes, setPomodoroMinutes } from "../utils/preferences";

const FOCUS_OPTIONS = [15, 20, 25, 30, 45, 60];

function Toggle({ checked, onChange, label, description }) {
    return (
        <div className="settings-toggle-row">
            <div>
                <p className="settings-toggle-label">{label}</p>
                {description && (
                    <p className="settings-toggle-desc">{description}</p>
                )}
            </div>

            <button
                type="button"
                className={`switch${checked ? " switch-on" : ""}`}
                onClick={() => onChange(!checked)}
                aria-pressed={checked}
                aria-label={label}
            >
                <span className="switch-thumb" />
            </button>
        </div>
    );
}

function Settings() {

    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [focusMinutes, setFocusMinutes] = useState(getPomodoroMinutes);

    const updateFocusLength = (minutes) => {
        setFocusMinutes(minutes);
        setPomodoroMinutes(minutes);
        toast.success(`Focus blocks set to ${minutes} minutes`);
    };

    return (
        <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">
                Manage how TaskMind looks and behaves.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "640px" }}>

                <div className="card">
                    <div className="settings-section-header">
                        {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                        <h3>Appearance</h3>
                    </div>

                    <Toggle
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                        label="Dark mode"
                        description="Switch between light and dark themes"
                    />
                </div>

                <div className="card">
                    <div className="settings-section-header">
                        <Timer size={18} />
                        <h3>Study Preferences</h3>
                    </div>

                    <label htmlFor="focus-length" style={{ marginTop: 0 }}>
                        Pomodoro focus block length
                    </label>
                    <p style={{ marginBottom: "8px" }}>
                        Controls how the focus ring on the Study Sessions timer fills and resets.
                    </p>
                    <select
                        id="focus-length"
                        value={focusMinutes}
                        onChange={(e) => updateFocusLength(Number(e.target.value))}
                    >
                        {FOCUS_OPTIONS.map((minutes) => (
                            <option key={minutes} value={minutes}>{minutes} minutes</option>
                        ))}
                    </select>
                </div>

                <div className="card">
                    <div className="settings-section-header">
                        <ShieldCheck size={18} />
                        <h3>Account</h3>
                    </div>

                    <p style={{ marginBottom: "4px" }}>Email</p>
                    <p style={{ color: "var(--text)", fontWeight: 600, marginBottom: "16px" }}>
                        {user?.email || "—"}
                    </p>

                    <button className="btn-danger" onClick={logout}>
                        Log out of this device
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Settings;
