import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mail, GraduationCap, Calendar as CalendarIcon } from "lucide-react";

import { updateProfile } from "../api/users";
import { useAuth } from "../context/AuthContext";
import { SkeletonListCard } from "../components/Skeleton";

const STUDY_LEVELS = ["School", "College", "Competitive Exam", "Personal Learning"];

function getInitials(name) {
    if (!name) return "?";
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

function Profile() {

    const { user, userLoading, refreshUser } = useAuth();

    const [form, setForm] = useState({
        full_name: "",
        date_of_birth: "",
        study_level: ""
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                full_name: user.full_name || "",
                date_of_birth: user.date_of_birth || "",
                study_level: user.study_level || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateProfile(form);
            await refreshUser();
            toast.success("Profile updated");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Couldn't update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (userLoading && !user) {
        return (
            <div>
                <h1 className="page-title">Profile</h1>
                <p className="page-subtitle">Loading your details...</p>
                <SkeletonListCard rows={4} />
            </div>
        );
    }

    return (
        <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">
                Update your personal details.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 280px) 1fr", gap: "20px", alignItems: "start" }}>

                <div className="card" style={{ textAlign: "center" }}>
                    <div
                        className="avatar"
                        style={{ width: "72px", height: "72px", fontSize: "24px", margin: "0 auto 14px" }}
                    >
                        {getInitials(user?.full_name)}
                    </div>

                    <h3 style={{ marginBottom: "4px" }}>{user?.full_name}</h3>
                    <p style={{ fontSize: "13px" }}>{user?.study_level || "Study level not set"}</p>

                    <div style={{ textAlign: "left", marginTop: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
                            <Mail size={14} />
                            <span>{user?.email}</span>
                        </div>
                    </div>
                </div>

                <form className="card" onSubmit={handleSubmit}>
                    <label htmlFor="full_name">Full name</label>
                    <input
                        id="full_name"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                    />

                    <label htmlFor="study_level">
                        <GraduationCap size={13} style={{ verticalAlign: "-2px", marginRight: "4px" }} />
                        Study level
                    </label>
                    <select
                        id="study_level"
                        name="study_level"
                        value={form.study_level}
                        onChange={handleChange}
                    >
                        <option value="">Select study level</option>
                        {STUDY_LEVELS.map((level) => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>

                    <label htmlFor="date_of_birth">
                        <CalendarIcon size={13} style={{ verticalAlign: "-2px", marginRight: "4px" }} />
                        Date of birth
                    </label>
                    <input
                        id="date_of_birth"
                        type="date"
                        name="date_of_birth"
                        value={form.date_of_birth || ""}
                        onChange={handleChange}
                    />

                    <button type="submit" disabled={saving} style={{ marginTop: "16px" }}>
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Profile;
