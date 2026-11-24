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
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p>{title}</p>
          <h2>{value}</h2>
          <p>{change}</p>
        </div>

        <div className={color}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;