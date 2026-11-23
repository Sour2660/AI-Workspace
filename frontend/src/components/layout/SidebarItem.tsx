import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  title: string;
  path: string;
  icon: LucideIcon;
}

const SidebarItem = ({
  title,
  path,
  icon: Icon,
}: SidebarItemProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
          isActive
            ? "bg-indigo-600 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      <Icon size={20} />
      <span>{title}</span>
    </NavLink>
  );
};

export default SidebarItem;