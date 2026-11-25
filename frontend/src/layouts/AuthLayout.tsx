import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  CircleCheck,
  Layers3,
  Sparkles,
} from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-2">
    <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
      <div
        aria-hidden="true"
        className="absolute -left-40 top-20 size-96 rounded-full bg-violet-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-48 right-0 size-[28rem] rounded-full bg-blue-500/20 blur-3xl"
      />

      <div className="relative flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
          <Layers3 className="size-5 text-violet-300" aria-hidden="true" />
        </div>
        <span className="text-lg font-semibold tracking-tight">
          AI Workspace
        </span>
        <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
          Workspace
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-medium text-violet-200">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Your team, in sync
        </div>
        <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
          Make room for work that matters.
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
          Bring projects, people, and progress together in one thoughtful
          workspace.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-lg bg-violet-400/15">
                <Sparkles className="size-4 text-violet-200" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium">Product launch</p>
                <p className="text-xs text-slate-400">Team workspace</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200">
              <CircleCheck className="size-3.5" aria-hidden="true" />
              On track
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs text-slate-400">Project progress</p>
              <p className="mt-1 text-2xl font-semibold">72%</p>
            </div>
            <div className="flex -space-x-2" aria-label="Four project members">
              {["AL", "JM", "SK", "+"].map((initials, index) => (
                <div
                  key={initials + index}
                  className={`grid size-8 place-items-center rounded-full border-2 border-slate-900 text-[10px] font-semibold ${
                    index === 0
                      ? "bg-violet-300 text-slate-950"
                      : index === 1
                        ? "bg-blue-300 text-slate-950"
                        : index === 2
                          ? "bg-amber-200 text-slate-950"
                          : "bg-white/15 text-white"
                  }`}
                >
                  {initials}
                </div>
              ))}
            </div>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Project progress"
            aria-valuenow={72}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-400 to-blue-300" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ["12", "Tasks done"],
              ["04", "In progress"],
              ["08", "Team members"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-white/[0.05] p-3">
                <p className="text-lg font-semibold">{value}</p>
                <p className="mt-1 text-[11px] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-6 flex items-start gap-3 text-sm text-slate-300">
          <Check
            className="mt-0.5 size-4 shrink-0 text-emerald-300"
            aria-hidden="true"
          />
          <p>One clear view of what your team is building together.</p>
          <ArrowUpRight
            className="ml-auto size-4 shrink-0 text-slate-500"
            aria-hidden="true"
          />
        </div>
      </div>

      <p className="relative text-xs text-slate-500">
        © 2026 AI Workspace · Built for focused teams
      </p>
    </section>

    <section className="flex min-h-screen flex-col px-5 py-7 sm:px-8 lg:px-12">
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Layers3 className="size-5" aria-hidden="true" />
        </div>
        <span className="font-semibold tracking-tight">AI Workspace</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        By continuing, you agree to the AI Workspace terms and privacy policy.
      </p>
    </section>
    </main>
  );
};

export default AuthLayout;
