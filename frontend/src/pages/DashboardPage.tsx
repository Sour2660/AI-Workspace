import StatsGrid from "@/components/dashboard/StatsGrid";

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Welcome back, Sourabh 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Here's what's happening in your workspace today.
        </p>
      </div>

      <StatsGrid />
    </div>
  );
};

export default DashboardPage;