const UserMenu = () => {
  return (
    <div className="flex items-center gap-3 rounded-xl border px-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
        S
      </div>

      <div>
        <p className="text-sm font-semibold">Sourabh</p>
        <p className="text-xs text-slate-500">Senior Developer</p>
      </div>
    </div>
  );
};

export default UserMenu;