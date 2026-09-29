import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

import {
    getSubTopicsByTopic
} from "../api/subTopics";

import {
    deleteTopic
} from "../api/topics";

import AddSubTopic from "./AddSubTopic";
import SubTopicList from "./SubTopicList";

function TopicList({
    topics,
    refreshTopics
}) {

    const [openTopic, setOpenTopic] = useState(null);
    const [subTopics, setSubTopics] = useState([]);
    const [showAdd, setShowAdd] = useState(null);
    const [loadingId, setLoadingId] = useState(null);

    const fetchSubTopics = async (topicId) => {
        setLoadingId(topicId);

        try {
            const response = await getSubTopicsByTopic(topicId);
            setSubTopics(response);
            setOpenTopic(topicId);
        } catch (error) {
            toast.error("Couldn't load sub-topics");
        } finally {
            setLoadingId(null);
        }
    };

    const toggleSubTopics = (topicId) => {
        if (openTopic === topicId) {
            setOpenTopic(null);
            return;
        }

        fetchSubTopics(topicId);
    };

    const removeTopic = async (topicId, name) => {
        const confirmed = window.confirm(
            `Delete "${name}"? This also removes its sub-topics and study sessions.`
        );

        if (!confirmed) return;

        try {
            await deleteTopic(topicId);
            toast.success("Topic deleted");
            refreshTopics();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Couldn't delete topic — it may still have tasks attached"
            );
        }
    };

    return (
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {topics.map((topic) => (
                <div
                    key={topic.topic_id}
                    style={{
                        background: "var(--surface-2)",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "1px solid var(--border)"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                        <div style={{ minWidth: 0 }}>
                            <h4 style={{ marginBottom: "2px" }}>{topic.name}</h4>
                            {topic.description && <p style={{ fontSize: "13px" }}>{topic.description}</p>}
                        </div>

                        <button
                            className="btn-icon btn-ghost btn-sm"
                            onClick={() => removeTopic(topic.topic_id, topic.name)}
                            aria-label="Delete topic"
                            title="Delete topic"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                        <button
                            className="btn-secondary btn-sm"
                            onClick={() => toggleSubTopics(topic.topic_id)}
                            disabled={loadingId === topic.topic_id}
                        >
                            {openTopic === topic.topic_id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            <span style={{ marginLeft: "5px" }}>
                                {loadingId === topic.topic_id ? "Loading..." : "Sub Topics"}
                            </span>
                        </button>

                        <button
                            className="btn-secondary btn-sm"
                            onClick={() =>
                                setShowAdd(showAdd === topic.topic_id ? null : topic.topic_id)
                            }
                        >
                            <Plus size={13} style={{ verticalAlign: "-2px", marginRight: "4px" }} />
                            Add Sub Topic
                        </button>
                    </div>

                    {showAdd === topic.topic_id && (
                        <AddSubTopic
                            topicId={topic.topic_id}
                            refreshSubTopics={() => fetchSubTopics(topic.topic_id)}
                        />
                    )}

                    {openTopic === topic.topic_id && (
                        subTopics.length === 0 ? (
                            <p style={{ marginTop: "10px", fontSize: "13px", color: "var(--text-faint)" }}>
                                No sub-topics yet
                            </p>
                        ) : (
                            <SubTopicList
                                subTopics={subTopics}
                                refresh={() => fetchSubTopics(topic.topic_id)}
                            />
                        )
                    )}
                </div>
            ))}
        </div>
    );
}

export default TopicList;
