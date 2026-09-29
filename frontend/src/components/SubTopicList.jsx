import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

import {
    deleteSubTopic
} from "../api/subTopics";

function SubTopicList({
    subTopics,
    refresh
}) {

    const removeSubTopic = async (id, name) => {
        const confirmed = window.confirm(`Delete "${name}"?`);
        if (!confirmed) return;

        try {
            await deleteSubTopic(id);
            toast.success("Sub-topic deleted");
            refresh();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Couldn't delete sub-topic — it may still have tasks attached"
            );
        }
    };

    return (
        <div style={{ marginTop: "10px", marginLeft: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {subTopics.map((sub) => (
                <div
                    key={sub.sub_topic_id}
                    style={{
                        background: "var(--surface)",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "10px"
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <b style={{ fontSize: "13px" }}>{sub.name}</b>
                        {sub.description && <p style={{ fontSize: "12px" }}>{sub.description}</p>}
                    </div>

                    <button
                        className="btn-icon btn-ghost btn-sm"
                        onClick={() => removeSubTopic(sub.sub_topic_id, sub.name)}
                        aria-label="Delete sub-topic"
                        title="Delete sub-topic"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default SubTopicList;
