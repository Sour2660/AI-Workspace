import { Bell, Check, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/store/notification.store";

const NotificationBell = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const clearAll = useNotificationStore((state) => state.clearAll);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative grid size-9 place-items-center rounded-lg border text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={
            unreadCount
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Bell className="size-4" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="p-0 text-sm">
            Notifications
          </DropdownMenuLabel>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50"
            onClick={markAllRead}
            disabled={!unreadCount}
          >
            <CheckCheck className="size-3.5" aria-hidden="true" />
            Mark all read
          </button>
        </div>
        <DropdownMenuSeparator className="my-0" />
        {notifications.length ? (
          notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 border-b px-4 py-3 last:border-0 ${
                notification.read ? "" : "bg-primary/[0.04]"
              }`}
            >
              <span
                className={`mt-1.5 size-2 shrink-0 rounded-full ${
                  notification.read ? "bg-transparent" : "bg-primary"
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  {notification.body}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {notification.time}
                </p>
              </div>
              {!notification.read && (
                <button
                  type="button"
                  className="self-center rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={`Mark ${notification.title} as read`}
                  onClick={() => markRead(notification.id)}
                >
                  <Check className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            You’re all caught up.
          </p>
        )}
        {notifications.length > 0 && (
          <DropdownMenuItem
            className="justify-center py-2.5 text-xs text-muted-foreground"
            onSelect={clearAll}
          >
            Clear notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
