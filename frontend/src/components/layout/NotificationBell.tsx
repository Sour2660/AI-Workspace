import { Bell } from "lucide-react";

const NotificationBell = () => {
  return (
    <button className="rounded-xl border p-2 hover:bg-slate-100">
      <Bell size={20} />
    </button>
  );
};

export default NotificationBell;