import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Play, Square, Trash2, Clock, CalendarPlus } from "lucide-react";

import { getSubjects } from "../api/subjects";
import { getTopicsBySubject } from "../api/topics";
import { getSubTopicsByTopic } from "../api/subTopics";

import {
    startSession as apiStartSession,
    endSession as apiEndSession,
    getActiveSession,
    getStudySessions,
    deleteStudySession
} from "../api/studySessions";

import PomodoroTimer from "../components/PomodoroTimer";
import AddSessionForm from "../components/AddSessionForm";
import { SkeletonListCard } from "../components/Skeleton";
import { getPomodoroMinutes } from "../utils/preferences";

function StudySessions() {

    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);

    const [subjectId, setSubjectId] = useState("");
    const [topicId, setTopicId] = useState("");
    const [subTopicId, setSubTopicId] = useState("");

    const [activeSession, setActiveSession] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);

    const [timer, setTimer] = useState(0);
    const [starting, setStarting] = useState(false);
    const [ending, setEnding] = useState(false);
    const [showManualForm, setShowManualForm] = useState(false);

    useEffect(() => {
        loadSubjects();
        loadSessions();
        loadActiveSession();
    }, []);

    const loadSubjects = async () => {
        try {
            const res = await getSubjects();
            setSubjects(res || []);
        } catch (error) {
            toast.error("Couldn't load subjects");
            setSubjects([]);
        }
    };

    const loadTopics = async (id) => {
        setSubjectId(id);
        setTopicId("");
        setSubTopicId("");
        setSubTopics([]);

        if (!id) {
            setTopics([]);
            return;
        }

        try {
            const res = await getTopicsBySubject(id);
            setTopics(res || []);
        } catch (error) {
            toast.error("Couldn't load topics");
            setTopics([]);
        }
    };

    const loadSubTopics = async (id) => {
        setTopicId(id);
        setSubTopicId("");

        if (!id) {
            setSubTopics([]);
            return;
        }

        try {
            const res = await getSubTopicsByTopic(id);
            setSubTopics(res || []);
        } catch (error) {
            toast.error("Couldn't load sub-topics");
            setSubTopics([]);
        }
    };

    const loadSessions = async () => {
        setLoadingSessions(true);

        try {
            const res = await getStudySessions();
            const sorted = (res.data || []).sort(
                (a, b) => new Date(b.start_time) - new Date(a.start_time)
            );
            setSessions(sorted);
        } catch (error) {
            toast.error("Couldn't load session history");
            setSessions([]);
        } finally {
            setLoadingSessions(false);
        }
    };

    const loadActiveSession = async () => {
        try {
            const res = await getActiveSession();
            setActiveSession(res.data || null);
        } catch (error) {
            setActiveSession(null);
        }
    };

    useEffect(() => {
        if (!activeSession) {
            setTimer(0);
            return;
        }

        const start = new Date(activeSession.start_time).getTime();

        const update = () => {
            const diff = Math.floor((Date.now() - start) / 1000);
            setTimer(diff > 0 ? diff : 0);
        };

        update();
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);

    const startSession = async () => {

        if (!subjectId || !topicId || !subTopicId) {
            toast.error("Pick a subject, topic, and sub-topic first");
            return;
        }

        setStarting(true);

        try {
            await apiStartSession({
                subject_id: Number(subjectId),
                topic_id: Number(topicId),
                sub_topic_id: Number(subTopicId)
            });

            toast.success("Session started — stay focused!");
            await loadActiveSession();
            await loadSessions();

        } catch (error) {
            toast.error(error.response?.data?.message || "Couldn't start session");
        } finally {
            setStarting(false);
        }
    };

    const endSession = async () => {
        setEnding(true);

        try {
            await apiEndSession(activeSession.session_id);
            toast.success("Session ended — nice work");
            setActiveSession(null);
            setTimer(0);
            setSubjectId("");
            setTopicId("");
            setSubTopicId("");
            await loadSessions();
        } catch (error) {
            toast.error(error.response?.data?.message || "Couldn't end session");
        } finally {
            setEnding(false);
        }
    };

    const removeSession = async (id) => {
        const confirmed = window.confirm("Delete this session from your history?");
        if (!confirmed) return;

        try {
            await deleteStudySession(id);
            toast.success("Session deleted");
            await loadSessions();
        } catch (error) {
            toast.error("Couldn't delete session");
        }
    };

    const [activeLabel, setActiveLabel] = useState(null);

    useEffect(() => {

        if (!activeSession) {
            setActiveLabel(null);
            return;
        }

        // The /study-sessions/active endpoint returns the raw session row
        // without joined names (only the history list endpoint joins them),
        // so resolve the label client-side from what's already loaded.
        const resolveLabel = async () => {
            try {
                const subjectName =
                    subjects.find((s) => s.subject_id === activeSession.subject_id)?.name || "";

                const subjectTopics = await getTopicsBySubject(activeSession.subject_id);
                const topicName =
                    subjectTopics.find((t) => t.topic_id === activeSession.topic_id)?.name || "";

                const topicSubTopics = await getSubTopicsByTopic(activeSession.topic_id);
                const subTopicName =
                    topicSubTopics.find((s) => s.sub_topic_id === activeSession.sub_topic_id)?.name || "";

                setActiveLabel(
                    [subjectName, topicName, subTopicName].filter(Boolean).join(" → ") || null
                );
            } catch (error) {
                setActiveLabel(null);
            }
        };

        resolveLabel();

    }, [activeSession, subjects]);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div>
                    <h1 className="page-title">Study Sessions</h1>
                    <p className="page-subtitle">Start a focus session and track where your time goes.</p>
                </div>

                <button className="btn-secondary" onClick={() => setShowManualForm(!showManualForm)}>
                    <CalendarPlus size={16} style={{ verticalAlign: "-3px", marginRight: "6px" }} />
                    Log Past Session
                </button>
            </div>

            {showManualForm && (
                <AddSessionForm
                    subjects={subjects}
                    onDone={() => {
                        setShowManualForm(false);
                        loadSessions();
                    }}
                    onCancel={() => setShowManualForm(false)}
                />
            )}

            <div className="card" style={{ marginBottom: "24px" }}>
                {activeSession ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0" }}>
                        <PomodoroTimer elapsedSeconds={timer} label={activeLabel} focusMinutes={getPomodoroMinutes()} />

                        <button
                            className="btn-danger"
                            onClick={endSession}
                            disabled={ending}
                            style={{ marginTop: "24px" }}
                        >
                            <Square size={15} style={{ verticalAlign: "-2px", marginRight: "6px" }} />
                            {ending ? "Ending..." : "End Session"}
                        </button>
                    </div>
                ) : (
                    <div>
                        <h3 style={{ marginBottom: "14px" }}>Start a session</h3>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                            <select value={subjectId} onChange={(e) => loadTopics(e.target.value)}>
                                <option value="">Select Subject</option>
                                {subjects.map((subject) => (
                                    <option key={subject.subject_id} value={subject.subject_id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>

                            <select value={topicId} onChange={(e) => loadSubTopics(e.target.value)} disabled={!subjectId}>
                                <option value="">Select Topic</option>
                                {topics.map((topic) => (
                                    <option key={topic.topic_id} value={topic.topic_id}>
                                        {topic.name}
                                    </option>
                                ))}
                            </select>

                            <select value={subTopicId} onChange={(e) => setSubTopicId(e.target.value)} disabled={!topicId}>
                                <option value="">Select Sub Topic</option>
                                {subTopics.map((subTopic) => (
                                    <option key={subTopic.sub_topic_id} value={subTopic.sub_topic_id}>
                                        {subTopic.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button onClick={startSession} disabled={starting} style={{ marginTop: "16px" }}>
                            <Play size={15} style={{ verticalAlign: "-2px", marginRight: "6px" }} />
                            {starting ? "Starting..." : "Start Session"}
                        </button>
                    </div>
                )}
            </div>

            <h2 style={{ fontSize: "18px", marginBottom: "14px" }}>Session History</h2>

            {loadingSessions ? (
                <SkeletonListCard rows={3} />
            ) : sessions.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
                    <Clock size={28} style={{ color: "var(--text-faint)", marginBottom: "10px" }} />
                    <p>No study sessions yet — start your first one above.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {sessions.map((session) => (
                        <div key={session.session_id} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                            <div style={{ minWidth: 0 }}>
                                <h4 style={{ marginBottom: "4px" }}>{session.subject_name || "—"}</h4>
                                <p style={{ fontSize: "13px" }}>
                                    {[session.topic_name, session.sub_topic_name].filter(Boolean).join(" → ")}
                                </p>
                                <p style={{ fontSize: "12px", marginTop: "6px" }}>
                                    {new Date(session.start_time).toLocaleString()}
                                    {session.end_time && ` — ${new Date(session.end_time).toLocaleTimeString()}`}
                                </p>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
                                <span className="mono" style={{ fontWeight: 700, fontSize: "15px" }}>
                                    {session.duration_minutes ?? 0} min
                                </span>

                                <button
                                    className="btn-icon btn-ghost"
                                    onClick={() => removeSession(session.session_id)}
                                    aria-label="Delete session"
                                    title="Delete session"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudySessions;
