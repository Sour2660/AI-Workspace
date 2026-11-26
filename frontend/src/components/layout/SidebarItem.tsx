import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  title: string;
  path: string;
  icon: LucideIcon;
  onNavigate?: () => void;
}

const SidebarItem = ({
  title,
  path,
  icon: Icon,
  onNavigate,
}: SidebarItemProps) => {
  return (
    <NavLink
      to={path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-muted"
        }`
      }
    >
      <Icon size={20} />
      <span>{title}</span>
    </NavLink>
  );
};

export default SidebarItem;