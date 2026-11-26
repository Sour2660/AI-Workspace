import { useState } from "react";
import { useWorkspace } from "../../hooks/useWorkspace";

const colors = [
  "#2563EB",
  "#16A34A",
  "#DC2626",
  "#9333EA",
  "#F59E0B",
];

const CreateWorkspaceDialog = () => {
  const { create } = useWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Workspace name is required");
      return;
    }

    try {
      setLoading(true);

      await create({
        name,
        description,
        color,
      });

      setName("");
      setDescription("");
      alert("Workspace created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Create Workspace
      </h2>

      <div className="space-y-4">
        <input
          className="w-full rounded-lg border p-3"
          placeholder="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full rounded-lg border p-3"
          rows={4}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-3">
          {colors.map((item) => (
            <button
              key={item}
              onClick={() => setColor(item)}
              className={`h-8 w-8 rounded-full ${
                color === item ? "ring-2 ring-black" : ""
              }`}
              style={{
                background: item,
              }}
            />
          ))}
        </div>

        <button
          disabled={loading}
          onClick={handleCreate}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </div>
    </div>
  );
};

export default CreateWorkspaceDialog;