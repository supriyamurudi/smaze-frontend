import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white p-4">
      <Search className="text-slate-400" size={20} />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users by name, email or role..."
        className="w-full outline-none text-slate-700"
      />
    </div>
  );
}
