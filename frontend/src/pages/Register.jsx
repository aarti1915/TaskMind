import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

import api from "../api/axios";

const STUDY_LEVELS = ["School", "College", "Competitive Exam", "Personal Learning"];

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        study_level: ""
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post("/register", formData);

            toast.success("Account created — log in to continue");
            navigate("/login");

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration failed"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-brand-mark">
                        <GraduationCap size={20} strokeWidth={2.4} />
                    </div>
                    <span>TaskMind</span>
                </div>

                <h2>Create your account</h2>
                <p className="auth-subtitle">Start planning smarter study sessions.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="full_name">Full name</label>
                    <input
                        id="full_name"
                        type="text"
                        name="full_name"
                        placeholder="Jane Doe"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="At least 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={8}
                        required
                    />

                    <label htmlFor="study_level">Study level</label>
                    <select
                        id="study_level"
                        name="study_level"
                        value={formData.study_level}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select study level</option>
                        {STUDY_LEVELS.map((level) => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>

                    <button type="submit" className="auth-submit" disabled={submitting}>
                        {submitting ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
