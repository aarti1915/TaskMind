import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, BookOpen } from "lucide-react";

import {
    getSubjects,
    createSubject
} from "../api/subjects";

import SubjectCard from "../components/SubjectCard";
import { SkeletonListCard } from "../components/Skeleton";

function Subjects() {

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const response = await getSubjects();
            setSubjects(response || []);
        } catch (error) {
            console.log(error.response?.data);
            toast.error("Couldn't load subjects");
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    const addSubject = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error("Subject name is required");
            return;
        }

        setSaving(true);

        try {
            await createSubject(form);
            setForm({ name: "", description: "" });
            setShowAdd(false);
            toast.success("Subject added");
            loadSubjects();
        } catch (error) {
            toast.error(error.response?.data?.message || "Couldn't add subject");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div>
                    <h1 className="page-title">Subjects</h1>
                    <p className="page-subtitle">Manage Subject → Topic → Sub Topic</p>
                </div>

                <button onClick={() => setShowAdd(!showAdd)}>
                    <Plus size={16} style={{ verticalAlign: "-3px", marginRight: "6px" }} />
                    Add Subject
                </button>
            </div>

            {showAdd && (
                <form onSubmit={addSubject} className="card" style={{ marginBottom: "20px" }}>
                    <label htmlFor="subject-name">Subject name</label>
                    <input
                        id="subject-name"
                        placeholder="e.g. Organic Chemistry"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        autoFocus
                    />

                    <label htmlFor="subject-desc">Description</label>
                    <input
                        id="subject-desc"
                        placeholder="Optional"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Subject"}
                        </button>
                        <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                    <SkeletonListCard rows={2} />
                    <SkeletonListCard rows={2} />
                </div>
            ) : subjects.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "48px 20px" }}>
                    <BookOpen size={32} style={{ color: "var(--text-faint)", marginBottom: "10px" }} />
                    <h3 style={{ marginBottom: "6px" }}>No subjects yet</h3>
                    <p>Add your first subject to start organizing topics and tasks.</p>
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.subject_id}
                            subject={subject}
                            refreshSubjects={loadSubjects}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Subjects;
