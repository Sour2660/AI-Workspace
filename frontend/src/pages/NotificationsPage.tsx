import { useMemo, useState } from "react";
import { Bell, Check, CheckCheck, Filter, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notification.store";

type NotificationFilter = "all" | "unread";

const NotificationsPage = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const clearAll = useNotificationStore((state) => state.clearAll);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const unreadCount = notifications.filter((item) => !item.read).length;
  const visibleNotifications = useMemo(
    () =>
      notifications.filter((item) => filter === "all" || !item.read),
    [filter, notifications]
  );

  return (
    <div className="mx-auto max-w-4xl space-y-7 p-5 sm:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Stay in the loop
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {unreadCount ? `${unreadCount} unread updates` : "You’re all caught up."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllRead}
            disabled={!unreadCount}
          >
            <CheckCheck aria-hidden="true" />
            Mark all read
          </Button>
          <Button
            variant="ghost"
            onClick={clearAll}
            disabled={!notifications.length}
            aria-label="Clear all notifications"
          >
            <Trash2 aria-hidden="true" />
            Clear all
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-between border-b">
        <div className="flex gap-5">
          {(["all", "unread"] as const).map((filterOption) => (
            <button
              type="button"
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`border-b-2 px-1 pb-3 text-sm font-medium capitalize ${
                filter === filterOption
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={filter === filterOption}
            >
              {filterOption === "all" ? "All activity" : "Unread"}
            </button>
          ))}
        </div>
        <span className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="size-3.5" aria-hidden="true" />
          Local preview
        </span>
      </div>

      {visibleNotifications.length ? (
        <div className="divide-y rounded-2xl border bg-card">
          {visibleNotifications.map((item) => (
            <article
              key={item.id}
              className={`flex gap-4 p-4 sm:p-5 ${
                item.read ? "" : "bg-primary/[0.025]"
              }`}
            >
              <span
                className={`mt-1 grid size-9 shrink-0 place-items-center rounded-xl ${
                  item.read
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Bell className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  {!item.read && (
                    <span className="size-1.5 rounded-full bg-primary" />
                  )}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {item.category}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.body}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{item.time}</p>
              </div>
              {!item.read && (
                <button
                  type="button"
                  onClick={() => markRead(item.id)}
                  aria-label={`Mark ${item.title} as read`}
                  className="self-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Check className="size-4" aria-hidden="true" />
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Bell className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-semibold">Nothing to see here</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {filter === "unread"
              ? "You’ve read all your notifications."
              : "New updates will show up here."}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
