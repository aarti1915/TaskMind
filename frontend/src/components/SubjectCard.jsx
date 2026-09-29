import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronRight, Plus, Trash2, Layers } from "lucide-react";

import {
    deleteSubject
} from "../api/subjects";

import {
    getTopicsBySubject
} from "../api/topics";

import TopicList from "./TopicList";
import AddTopic from "./AddTopic";

function SubjectCard({
    subject,
    refreshSubjects
}) {

    const [topics, setTopics] = useState([]);
    const [showTopics, setShowTopics] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchTopics = async () => {
        setLoadingTopics(true);

        try {
            const response = await getTopicsBySubject(subject.subject_id);
            setTopics(response);
            setShowTopics(true);
        } catch (error) {
            toast.error("Couldn't load topics");
        } finally {
            setLoadingTopics(false);
        }
    };

    const toggleTopics = () => {
        if (showTopics) {
            setShowTopics(false);
            return;
        }

        fetchTopics();
    };

    const removeSubject = async () => {
        const confirmed = window.confirm(
            `Delete "${subject.name}"? This also removes its topics, sub-topics, and study sessions.`
        );

        if (!confirmed) return;

        setDeleting(true);

        try {
            await deleteSubject(subject.subject_id);
            toast.success("Subject deleted");
            refreshSubjects();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Couldn't delete subject — it may still have tasks attached"
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                <div style={{ minWidth: 0 }}>
                    <h3 style={{ marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {subject.name}
                    </h3>
                    {subject.description && <p>{subject.description}</p>}
                </div>

                <button
                    className="btn-icon btn-ghost"
                    onClick={removeSubject}
                    disabled={deleting}
                    aria-label="Delete subject"
                    title="Delete subject"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                <button className="btn-secondary btn-sm" onClick={toggleTopics} disabled={loadingTopics}>
                    {showTopics ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span style={{ marginLeft: "6px" }}>
                        {loadingTopics ? "Loading..." : "Topics"}
                    </span>
                </button>

                <button className="btn-secondary btn-sm" onClick={() => setShowAdd(!showAdd)}>
                    <Plus size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} />
                    Add Topic
                </button>
            </div>

            {showAdd && (
                <AddTopic
                    subjectId={subject.subject_id}
                    refreshTopics={fetchTopics}
                />
            )}

            {showTopics && (
                topics.length === 0 ? (
                    <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--text-faint)", fontSize: "13px" }}>
                        <Layers size={14} />
                        <span>No topics yet</span>
                    </div>
                ) : (
                    <TopicList
                        topics={topics}
                        refreshTopics={fetchTopics}
                    />
                )
            )}
        </div>
    );
}

export default SubjectCard;
