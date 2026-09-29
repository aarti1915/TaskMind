import { useState } from "react";
import toast from "react-hot-toast";

import {
    createTopic
} from "../api/topics";

function AddTopic({
    subjectId,
    refreshTopics
}) {

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Topic name is required");
            return;
        }

        setSaving(true);

        try {
            await createTopic({
                subject_id: subjectId,
                name: name,
                description: ""
            });

            setName("");
            toast.success("Topic added");
            refreshTopics();
        } catch (error) {
            toast.error(error.response?.data?.message || "Couldn't add topic");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={submit} style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
            <input
                placeholder="Topic name"
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

export default AddTopic;
