import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import { navigation } from "../../constants/navigation";

interface SidebarProps {
  open?: boolean;
  onNavigate?: () => void;
}

const Sidebar = ({ open = false, onNavigate }: SidebarProps) => {
  return (
    <aside
      className={`z-50 w-72 shrink-0 border-r border-border bg-background text-foreground ${
        open
          ? "fixed inset-y-0 left-0 shadow-2xl lg:static lg:shadow-none"
          : "hidden lg:block"
      }`}
    >
      <Logo />

      <div className="p-5">
        {navigation.map((item) => (
          <SidebarItem
            key={item.path}
            title={item.title}
            path={item.path}
            icon={item.icon}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;