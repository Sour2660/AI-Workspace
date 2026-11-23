const Logo = () => {
  return (
    <div className="flex items-center gap-3 px-6 py-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-lg">
        F
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800">
          FlowDesk
        </h2>

        <p className="text-xs text-slate-500">
          AI Workspace
        </p>
      </div>
    </div>
  );
};

export default Logo;