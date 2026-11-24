import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex w-96 items-center rounded-xl border bg-slate-50 px-4 py-2">
      <Search size={18} className="text-slate-400" />

      <input
        type="text"
        placeholder="Search projects, notes, AI..."
        className="ml-3 w-full bg-transparent outline-none"
      />
    </div>
  );
};

export default SearchBar;