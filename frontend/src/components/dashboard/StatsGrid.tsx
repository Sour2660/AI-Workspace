import {
  FolderKanban,
  FileText,
  Bot,
  CheckSquare,
} from "lucide-react";

import StatsCard from "./StatsCard";

const StatsGrid = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Projects"
        value="18"
        change="+3 this week"
        icon={FolderKanban}
        color="bg-indigo-600"
      />

      <StatsCard
        title="Documents"
        value="246"
        change="+18 today"
        icon={FileText}
        color="bg-emerald-600"
      />

      <StatsCard
        title="AI Chats"
        value="97"
        change="+8 today"
        icon={Bot}
        color="bg-violet-600"
      />

      <StatsCard
        title="Tasks"
        value="54"
        change="12 pending"
        icon={CheckSquare}
        color="bg-orange-500"
      />
    </div>
  );
};

export default StatsGrid;