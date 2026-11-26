import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  color: string;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  color,
}: StatsCardProps) => {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{value}</h2>
          <p className="mt-2 text-xs text-muted-foreground">{change}</p>
        </div>

        <div className={`grid size-11 place-items-center rounded-xl ${color}`}>
          <Icon size={21} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;