import { useState, useMemo } from "react";
import toast from "react-hot-toast";

import { getTopicsBySubject } from "../api/topics";
import { getSubTopicsByTopic } from "../api/subTopics";
import { createManualSession } from "../api/studySessions";
import TimeSelect, { to24Hour } from "./TimeSelect";

function pad(n) {
    return String(n).padStart(2, "0");
}

// Local calendar date (YYYY-MM-DD) for the <input type="date"> — deliberately
// NOT toISOString(), which converts to UTC first and can roll to the wrong
// day near midnight in timezones ahead of UTC.
function todayDateInputValue() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function buildDateTime(dateStr, timeValue) {
    const { hour, minute } = to24Hour(timeValue);
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, hour, minute, 0, 0);
}

// A naive "local wall-clock time" string (no timezone suffix), matching how
// the rest of the backend stores start_time/end_time via datetime.now().
// Using toISOString() here would send UTC and crash on the backend when
// compared against a naive datetime.now().
function toNaiveLocalString(date) {
    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
}

function formatDuration(ms) {
    const totalMinutes = Math.round(ms / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
}

function AddSessionForm({ subjects, onDone, onCancel }) {

    const [topics, setTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);

    const [subjectId, setSubjectId] = useState("");
    const [topicId, setTopicId] = useState("");
    const [subTopicId, setSubTopicId] = useState("");
    const [date, setDate] = useState(todayDateInputValue());

    const [startTime, setStartTime] = useState({ hour: 6, minute: 0, period: "PM" });
    const [endTime, setEndTime] = useState({ hour: 7, minute: 0, period: "PM" });

    const [saving, setSaving] = useState(false);

    const handleSubjectChange = async (id) => {
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
        } catch {
            toast.error("Couldn't load topics");
        }
    };

    const handleTopicChange = async (id) => {
        setTopicId(id);
        setSubTopicId("");

        if (!id) {
            setSubTopics([]);
            return;
        }

        try {
            const res = await getSubTopicsByTopic(id);
            setSubTopics(res || []);
        } catch {
            toast.error("Couldn't load sub-topics");
        }
    };

    // If the end time is earlier than the start time, assume the session
    // crossed midnight and rolled into the next day.
    const { start, end, crossedMidnight } = useMemo(() => {
        const startDate = buildDateTime(date, startTime);
        let endDate = buildDateTime(date, endTime);
        let crossed = false;

        if (endDate <= startDate) {
            endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
            crossed = true;
        }

        return { start: startDate, end: endDate, crossedMidnight: crossed };
    }, [date, startTime, endTime]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subjectId || !topicId || !subTopicId) {
            toast.error("Pick a subject, topic, and sub-topic");
            return;
        }

        if (start > new Date()) {
            toast.error("Start time can't be in the future");
            return;
        }

        setSaving(true);

        try {
            await createManualSession({
                subject_id: Number(subjectId),
                topic_id: Number(topicId),
                sub_topic_id: Number(subTopicId),
                start_time: toNaiveLocalString(start),
                end_time: toNaiveLocalString(end)
            });

            toast.success("Session logged");
            onDone();

        } catch (error) {
            toast.error(error.response?.data?.message || "Couldn't log session");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "14px" }}>Log a past session</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                <select value={subjectId} onChange={(e) => handleSubjectChange(e.target.value)}>
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                        <option key={s.subject_id} value={s.subject_id}>{s.name}</option>
                    ))}
                </select>

                <select value={topicId} onChange={(e) => handleTopicChange(e.target.value)} disabled={!subjectId}>
                    <option value="">Select Topic</option>
                    {topics.map((t) => (
                        <option key={t.topic_id} value={t.topic_id}>{t.name}</option>
                    ))}
                </select>

                <select value={subTopicId} onChange={(e) => setSubTopicId(e.target.value)} disabled={!topicId}>
                    <option value="">Select Sub Topic</option>
                    {subTopics.map((s) => (
                        <option key={s.sub_topic_id} value={s.sub_topic_id}>{s.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginTop: "14px" }}>
                <label htmlFor="session-date">Date</label>
                <input
                    id="session-date"
                    type="date"
                    max={todayDateInputValue()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ maxWidth: "220px" }}
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "10px" }}>
                <div>
                    <label>Start time</label>
                    <TimeSelect idPrefix="start" value={startTime} onChange={setStartTime} />
                </div>

                <div>
                    <label>End time</label>
                    <TimeSelect idPrefix="end" value={endTime} onChange={setEndTime} />
                </div>
            </div>

            <p style={{ marginTop: "12px", fontSize: "13px" }}>
                Duration: <strong style={{ color: "var(--text)" }}>{formatDuration(end - start)}</strong>
                {crossedMidnight && " · rolls into the next day"}
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Log Session"}
                </button>
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default AddSessionForm;
