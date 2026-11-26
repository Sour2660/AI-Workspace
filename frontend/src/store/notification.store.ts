import { create } from "zustand";

export type NotificationCategory = "Tasks" | "Projects" | "Workspace";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  time: string;
  read: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n-1",
    title: "A task was assigned to you",
    body: "Alex assigned “Finalize dashboard layout” to you.",
    category: "Tasks",
    time: "12 minutes ago",
    read: false,
  },
  {
    id: "n-2",
    title: "You were mentioned in a project",
    body: "Jamie mentioned you in Product launch.",
    category: "Projects",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n-3",
    title: "Workspace invite accepted",
    body: "Sam joined the Platform improvements workspace.",
    category: "Workspace",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n-4",
    title: "Project milestone completed",
    body: "Orbit redesign reached its accessibility milestone.",
    category: "Projects",
    time: "Yesterday",
    read: true,
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialNotifications,
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({
        ...item,
        read: true,
      })),
    })),
  clearAll: () => set({ notifications: [] }),
}));
