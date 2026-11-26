import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
  ArrowUpRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileText,
  FolderKanban,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import {
  initialTasks,
  mockAssignees,
  mockProjects,
} from "@/features/task/mock-tasks";
import { useAuthStore } from "@/features/auth/auth.store";

const weeklyProgress = [
  { day: "Mon", completed: 8, created: 5 },
  { day: "Tue", completed: 12, created: 7 },
  { day: "Wed", completed: 9, created: 11 },
  { day: "Thu", completed: 15, created: 8 },
  { day: "Fri", completed: 18, created: 10 },
  { day: "Sat", completed: 13, created: 6 },
  { day: "Sun", completed: 20, created: 9 },
];

const statusSummary = [
  { name: "To do", value: initialTasks.filter((task) => task.status === "TODO").length, color: "#94a3b8" },
  { name: "In progress", value: initialTasks.filter((task) => task.status === "IN_PROGRESS").length, color: "#3b82f6" },
  { name: "In review", value: initialTasks.filter((task) => task.status === "REVIEW").length, color: "#8b5cf6" },
  { name: "Done", value: initialTasks.filter((task) => task.status === "DONE").length, color: "#10b981" },
];

const activities = [
  ["Alex Lee", "completed", "Document API error states", "20 min ago"],
  ["Jamie Morgan", "commented on", "Product launch", "1 hour ago"],
  ["Sam Kim", "updated", "Audit keyboard navigation", "3 hours ago"],
  ["Taylor Reed", "created", "Sprint planning notes", "Yesterday"],
];

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name.split(" ")[0] || "there";
  const openTasks = initialTasks.filter((task) => task.status !== "DONE").length;
  const completedTasks = initialTasks.filter((task) => task.status === "DONE").length;
  const dueSoon = initialTasks
    .filter((task) => task.status !== "DONE")
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate))
    .slice(0, 3);
  const dueLabel = (date: string) => {
    const days = dayjs(date).startOf("day").diff(dayjs().startOf("day"), "day");
    if (days <= 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  };

  const stats = [
    { title: "Active projects", value: String(mockProjects.length), change: "In the demo workspace", icon: FolderKanban, color: "bg-indigo-500/10 text-indigo-600" },
    { title: "Open tasks", value: String(openTasks), change: `${completedTasks} completed`, icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600" },
    { title: "Team members", value: String(mockAssignees.length), change: "In the demo workspace", icon: Users, color: "bg-sky-500/10 text-sky-600" },
    { title: "Focus score", value: "82%", change: "+6% this week", icon: Target, color: "bg-violet-500/10 text-violet-600" },
  ];

  return (
    <div className="mx-auto max-w-[1440px] space-y-7">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-6 text-white shadow-sm sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-32 size-80 rounded-full bg-violet-500/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[-8rem] right-1/3 size-64 rounded-full bg-blue-500/20 blur-3xl"
        />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm text-indigo-200">
              <Sparkles className="size-4" aria-hidden="true" />
              {dayjs().format("dddd, MMMM D")}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Good to see you, {firstName}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Your team is making steady progress. Here’s what’s happening across
              your workspace today.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            View projects
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="relative mt-7 flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
            3 projects on track
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
            {dueSoon.length} upcoming task deadlines
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
            Demo dashboard data
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.article
              key={stat.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <span className={`grid size-10 place-items-center rounded-xl ${stat.color}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{stat.change}</p>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        <article className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">Team productivity</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Tasks created and completed this week
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              +18% vs last week
            </span>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgress} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="created" stroke="#14b8a6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-indigo-500" /> Completed
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-teal-500" /> Created
            </span>
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="font-semibold">Task distribution</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Current status across your tasks
          </p>
          <div className="relative mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusSummary}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={4}
                  stroke="none"
                >
                  {statusSummary.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold">{initialTasks.length}</span>
              <span className="text-[11px] text-muted-foreground">tasks</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {statusSummary.map((item) => (
              <span key={item.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
                <span className="ml-auto font-medium text-foreground">{item.value}</span>
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <article className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Recent projects</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                A snapshot of active team work
              </p>
            </div>
            <Link to="/projects" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y">
            {mockProjects.map((project, index) => (
              <Link
                to="/projects"
                key={project.id}
                className="flex items-center gap-3 py-4 first:pt-1 last:pb-1"
              >
                <span className={`grid size-10 place-items-center rounded-xl ${
                  index === 0
                    ? "bg-violet-500/10 text-violet-600"
                    : index === 1
                      ? "bg-sky-500/10 text-sky-600"
                      : "bg-emerald-500/10 text-emerald-600"
                }`}>
                  <FolderKanban className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{project.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {index === 0 ? "Updated today" : index === 1 ? "Updated yesterday" : "Updated Nov 21"}
                  </span>
                </span>
                <span className="hidden w-24 sm:block">
                  <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${78 - index * 17}%` }}
                    />
                  </span>
                  <span className="mt-1 block text-right text-[10px] text-muted-foreground">
                    {78 - index * 17}%
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Upcoming deadlines</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Tasks to keep on your radar
              </p>
            </div>
            <Link to="/calendar" className="text-xs font-medium text-primary hover:underline">
              Calendar
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {dueSoon.map((task) => (
              <Link
                to="/tasks"
                key={task.id}
                className="flex items-center gap-3 rounded-xl border p-3 transition hover:bg-muted/30"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <CalendarDays className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{task.title}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {task.project.name}
                  </span>
                </span>
                <span className="shrink-0 text-right text-xs">
                  <span className="block font-medium">
                    {dayjs(task.dueDate).format("MMM D")}
                  </span>
                  <span className="mt-1 block text-muted-foreground">
                    {dueLabel(task.dueDate)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
        <article className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Activity feed</h2>
              <p className="mt-1 text-xs text-muted-foreground">Recent team updates</p>
            </div>
            <Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="mt-5 space-y-4">
            {activities.map(([person, action, subject, time], index) => (
              <div key={subject} className="flex gap-3">
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white ${
                  index % 2 ? "bg-sky-500" : "bg-violet-500"
                }`}>
                  {person.split(" ").map((part) => part[0]).join("")}
                </span>
                <p className="min-w-0 flex-1 text-sm leading-5">
                  <span className="font-medium">{person}</span>{" "}
                  <span className="text-muted-foreground">{action} </span>
                  <span className="font-medium">{subject}</span>
                </p>
                <span className="shrink-0 text-[11px] text-muted-foreground">{time}</span>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <article className="rounded-2xl border bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-5">
            <span className="grid size-9 place-items-center rounded-xl bg-violet-500/15 text-violet-600">
              <Bot className="size-4" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-semibold">AI workspace brief</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your team completed 18 tasks this week. Accessibility review is
              the next milestone; two high-priority items are coming due soon.
            </p>
            <Link to="/assistant" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              Ask the assistant <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <p className="mt-3 text-[10px] text-muted-foreground">
              Sample insight · Not generated from live workspace data
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <CircleHelp className="size-4 text-primary" aria-hidden="true" />
              <h2 className="font-semibold">Quick actions</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ["/projects", "New project", FolderKanban],
                ["/tasks", "Create task", CheckCircle2],
                ["/documents", "Add document", FileText],
                ["/assistant", "Ask AI", Bot],
              ].map(([path, label, Icon]) => {
                const ActionIcon = Icon;
                return (
                  <Link
                    key={label as string}
                    to={path as string}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium hover:bg-muted"
                  >
                    <ActionIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                    {label as string}
                  </Link>
                );
              })}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
