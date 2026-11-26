import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  FolderOpen,
  ListTodo,
  Calendar,
  FileText,
  Settings,
  Bell,
  BotMessageSquare,
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
    title: "Projects",
    path: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: ListTodo,
  },
  {
    title: "AI Assistant",
    path: "/assistant",
    icon: BotMessageSquare,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Bell,
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