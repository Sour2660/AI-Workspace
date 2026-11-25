import type { Workspace } from "../../types/workspace";

interface Props {
  workspace: Workspace;
}

const WorkspaceCard = ({ workspace }: Props) => {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div
          className="h-4 w-4 rounded-full"
          style={{
            backgroundColor: workspace.color,
          }}
        />

        <h3 className="text-lg font-semibold">
          {workspace.name}
        </h3>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        {workspace.description}
      </p>

      <div className="mt-4 text-xs text-gray-400">
        {workspace.members.length} Members
      </div>
    </div>
  );
};

export default WorkspaceCard;