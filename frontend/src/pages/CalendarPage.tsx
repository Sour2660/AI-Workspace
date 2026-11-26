import { useMemo, useState, type FormEvent } from "react";
import dayjs, { type Dayjs } from "dayjs";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Trash2,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialTasks } from "@/features/task/mock-tasks";

type CalendarView = "month" | "week" | "day" | "agenda";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  color: string;
}

const initialEvents: CalendarEvent[] = [
  {
    id: "event-1",
    title: "Design review",
    date: "2026-11-27",
    time: "10:00",
    color: "bg-violet-500",
  },
  {
    id: "event-2",
    title: "Product sync",
    date: "2026-11-30",
    time: "14:30",
    color: "bg-sky-500",
  },
  {
    id: "event-3",
    title: "Sprint planning",
    date: "2026-12-02",
    time: "09:30",
    color: "bg-emerald-500",
  },
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [view, setView] = useState<CalendarView>("month");
  const [events, setEvents] = useState(initialEvents);
  const [showTasks, setShowTasks] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [eventTime, setEventTime] = useState("09:00");

  const visibleDates = useMemo(() => {
    if (view === "day") {
      return [selectedDate];
    }
    if (view === "week") {
      const start = selectedDate.startOf("week");
      return Array.from({ length: 7 }, (_, index) => start.add(index, "day"));
    }
    const start = selectedDate.startOf("month").startOf("week");
    return Array.from({ length: 42 }, (_, index) => start.add(index, "day"));
  }, [selectedDate, view]);

  const tasksOnDate = (date: Dayjs) =>
    showTasks
      ? initialTasks.filter((task) => dayjs(task.dueDate).isSame(date, "day"))
      : [];
  const eventsOnDate = (date: Dayjs) =>
    showEvents
      ? events.filter((event) => dayjs(event.date).isSame(date, "day"))
      : [];

  const changePeriod = (direction: -1 | 1) => {
    const unit = view === "day" ? "day" : view === "week" ? "week" : "month";
    setSelectedDate((current) => current.add(direction, unit));
  };

  const openNewEvent = (date = selectedDate) => {
    setEditingEvent(null);
    setEventTitle("");
    setEventDate(date.format("YYYY-MM-DD"));
    setEventTime("09:00");
    setEventDialogOpen(true);
  };

  const openEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventDate(event.date);
    setEventTime(event.time);
    setEventDialogOpen(true);
  };

  const saveEvent = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const title = eventTitle.trim();
    if (!title || !eventDate) {
      return;
    }

    if (editingEvent) {
      setEvents((current) =>
        current.map((event) =>
          event.id === editingEvent.id
            ? { ...event, title, date: eventDate, time: eventTime }
            : event
        )
      );
      console.info("[calendar-ui] event updated in local preview");
    } else {
      setEvents((current) => [
        ...current,
        {
          id: `event-${Date.now()}`,
          title,
          date: eventDate,
          time: eventTime,
          color: "bg-rose-500",
        },
      ]);
      console.info("[calendar-ui] event created in local preview");
    }
    setEventDialogOpen(false);
  };

  const removeEvent = () => {
    if (!editingEvent) {
      return;
    }
    setEvents((current) =>
      current.filter((event) => event.id !== editingEvent.id)
    );
    setEventDialogOpen(false);
    console.info("[calendar-ui] event removed from local preview");
  };

  const rangeLabel =
    view === "day"
      ? selectedDate.format("MMMM D, YYYY")
      : view === "week"
        ? `${selectedDate.startOf("week").format("MMM D")} – ${selectedDate
            .endOf("week")
            .format("MMM D, YYYY")}`
        : selectedDate.format("MMMM YYYY");

  const agendaItems = [
    ...(showEvents ? events : []).map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      kind: "event" as const,
      event,
    })),
    ...(showTasks ? initialTasks : []).map((task) => ({
      id: task.id,
      title: task.title,
      date: task.dueDate,
      time: "All day",
      kind: "task" as const,
    })),
  ]
    .filter((item) => dayjs(item.date).isSame(selectedDate, "month"))
    .sort((left, right) => left.date.localeCompare(right.date));

  const renderDateCell = (date: Dayjs, compact = false) => {
    const dayTasks = tasksOnDate(date);
    const dayEvents = eventsOnDate(date);
    const isCurrentMonth = date.month() === selectedDate.month();
    const isToday = date.isSame(dayjs(), "day");

    return (
      <div
        key={date.format("YYYY-MM-DD")}
        onDragOver={(event) => {
          if (draggedEventId) event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (!draggedEventId) return;
          setEvents((current) =>
            current.map((item) =>
              item.id === draggedEventId
                ? { ...item, date: date.format("YYYY-MM-DD") }
                : item
            )
          );
          setDraggedEventId(null);
        }}
        className={`min-h-28 border-b border-r p-1.5 sm:min-h-32 sm:p-2 ${
          !isCurrentMonth && view === "month" ? "bg-muted/20" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setSelectedDate(date);
            setView("day");
          }}
          aria-label={`View ${date.format("MMMM D, YYYY")}`}
          className={`mb-1 grid size-7 place-items-center rounded-full text-xs ${
            isToday
              ? "bg-primary font-semibold text-primary-foreground"
              : isCurrentMonth
                ? "text-foreground hover:bg-muted"
                : "text-muted-foreground"
          }`}
        >
          {date.date()}
        </button>
        <div className="space-y-1">
          {dayEvents.slice(0, compact ? 2 : 3).map((event) => (
            <button
              type="button"
              key={event.id}
              draggable
              onDragStart={() => setDraggedEventId(event.id)}
              onDragEnd={() => setDraggedEventId(null)}
              onClick={() => openEditEvent(event)}
              className="flex w-full cursor-grab items-center gap-1 truncate rounded bg-violet-500/10 px-1.5 py-1 text-left text-[10px] text-violet-800 hover:bg-violet-500/20 active:cursor-grabbing dark:text-violet-200 sm:text-xs"
              title={`${event.title} — drag to move or click to edit`}
            >
              <span className={`size-1.5 shrink-0 rounded-full ${event.color}`} />
              <span className="truncate">{event.title}</span>
            </button>
          ))}
          {dayTasks.slice(0, compact ? 2 : 2).map((task) => (
            <div
              key={task.id}
              className="truncate rounded bg-sky-500/10 px-1.5 py-1 text-[10px] text-sky-800 dark:text-sky-200 sm:text-xs"
              title={`Task due: ${task.title}`}
            >
              {task.title}
            </div>
          ))}
          {dayTasks.length + dayEvents.length > (compact ? 4 : 5) && (
            <p className="px-1 text-[10px] text-muted-foreground">
              +{dayTasks.length + dayEvents.length - (compact ? 4 : 5)} more
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-5 sm:p-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Make time for what matters
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Calendar
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tasks and events in one place · Demo data
          </p>
        </div>
        <Button onClick={() => openNewEvent()}>
          <Plus aria-hidden="true" />
          Create event
        </Button>
      </header>

      <section className="rounded-2xl border bg-card">
        <div className="flex flex-col justify-between gap-4 border-b p-4 sm:flex-row sm:items-center sm:px-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border">
              <button
                type="button"
                className="grid size-9 place-items-center rounded-l-lg hover:bg-muted"
                onClick={() => changePeriod(-1)}
                aria-label="Previous period"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="grid size-9 place-items-center border-l border-r hover:bg-muted"
                onClick={() => setSelectedDate(dayjs())}
              >
                Today
              </button>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-r-lg hover:bg-muted"
                onClick={() => changePeriod(1)}
                aria-label="Next period"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
            <h2 className="ml-1 text-lg font-semibold">{rangeLabel}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowTasks((current) => !current)}
                aria-pressed={showTasks}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  showTasks ? "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300" : "text-muted-foreground"
                }`}
              >
                Tasks
              </button>
              <button
                type="button"
                onClick={() => setShowEvents((current) => !current)}
                aria-pressed={showEvents}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  showEvents ? "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300" : "text-muted-foreground"
                }`}
              >
                Events
              </button>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
            {(["month", "week", "day", "agenda"] as const).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setView(option)}
                aria-pressed={view === option}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                  view === option
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
            </div>
          </div>
        </div>

        {view === "agenda" ? (
          <div className="divide-y">
            {agendaItems.length ? (
              agendaItems.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center gap-4 px-4 py-4 sm:px-6"
                >
                  <div className="w-16 shrink-0 text-center">
                    <p className="text-xs uppercase text-muted-foreground">
                      {dayjs(item.date).format("ddd")}
                    </p>
                    <p className="text-lg font-semibold">
                      {dayjs(item.date).format("D")}
                    </p>
                  </div>
                  <span
                    className={`h-10 w-1 shrink-0 rounded-full ${
                      item.kind === "event"
                        ? "bg-violet-500"
                        : "bg-sky-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">{item.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      {item.time}
                      <span>·</span>
                      {item.kind === "event" ? "Event" : "Task due"}
                    </p>
                  </div>
                  {item.kind === "event" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditEvent(item.event)}
                    >
                      Edit
                    </Button>
                  )}
                </article>
              ))
            ) : (
              <p className="px-6 py-16 text-center text-sm text-muted-foreground">
                No events or tasks this month.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {view === "month" && (
              <div className="grid min-w-[700px] grid-cols-7 border-b bg-muted/20">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>
            )}
            <div
              className="grid min-w-[700px] grid-cols-7"
              style={
                view === "week" || view === "day"
                  ? { gridTemplateColumns: `repeat(${visibleDates.length}, minmax(0, 1fr))` }
                  : undefined
              }
            >
              {visibleDates.map((date) => renderDateCell(date, view === "month"))}
            </div>
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-500" />
          Tasks
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-violet-500" />
          Events
        </span>
      </div>

      <Dialog.Root open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl focus:outline-none">
            <Dialog.Title className="text-lg font-semibold">
              {editingEvent ? "Edit event" : "Create event"}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-muted-foreground">
              This event is saved in this local preview only.
            </Dialog.Description>
            <form className="mt-5 space-y-4" onSubmit={saveEvent}>
              <div className="space-y-2">
                <label htmlFor="event-title" className="text-sm font-medium">
                  Event title
                </label>
                <Input
                  id="event-title"
                  required
                  autoFocus
                  value={eventTitle}
                  onChange={(event) => setEventTitle(event.target.value)}
                  placeholder="e.g. Team planning"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="event-date" className="text-sm font-medium">
                    Date
                  </label>
                  <Input
                    id="event-date"
                    type="date"
                    required
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="event-time" className="text-sm font-medium">
                    Time
                  </label>
                  <Input
                    id="event-time"
                    type="time"
                    value={eventTime}
                    onChange={(event) => setEventTime(event.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse justify-between gap-2 pt-2 sm:flex-row">
                {editingEvent ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start text-destructive hover:text-destructive"
                    onClick={removeEvent}
                  >
                    <Trash2 aria-hidden="true" />
                    Delete event
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEventDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingEvent ? "Save event" : "Create event"}
                  </Button>
                </div>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default CalendarPage;
