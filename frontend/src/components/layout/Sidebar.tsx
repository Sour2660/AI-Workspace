import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import { navigation } from "../../constants/navigation";

const Sidebar = () => {
  return (
    <aside className="w-72 border-r border-slate-200 bg-white">
      <Logo />

      <div className="p-5">
        {navigation.map((item) => (
          <SidebarItem
            key={item.path}
            title={item.title}
            path={item.path}
            icon={item.icon}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;