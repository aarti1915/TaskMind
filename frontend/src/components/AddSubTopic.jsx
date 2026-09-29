import { useState } from "react";
import toast from "react-hot-toast";

import {
    createSubTopic
} from "../api/subTopics";

function AddSubTopic({
    topicId,
    refreshSubTopics
}) {

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Sub-topic name is required");
            return;
        }

        setSaving(true);

        try {
            await createSubTopic({
                topic_id: topicId,
                name: name,
                description: ""
            });

            setName("");
            toast.success("Sub-topic added");
            refreshSubTopics();
        } catch (error) {
            toast.error(error.response?.data?.message || "Couldn't add sub-topic");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={submit} style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
            <input
                placeholder="Sub topic name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                style={{ margin: 0 }}
            />

            <button className="btn-sm" disabled={saving} style={{ flexShrink: 0 }}>
                {saving ? "Adding..." : "Add"}
            </button>
        </form>
    );
}

export default AddSubTopic;
