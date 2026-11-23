import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  Calendar,
  FileText,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Workspace",
    path: "/workspace",
    icon: Bot,
  },
  {
    title: "Kanban",
    path: "/kanban",
    icon: FolderKanban,
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: Calendar,
  },
  {
    title: "Documents",
    path: "/documents",
    icon: FileText,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];