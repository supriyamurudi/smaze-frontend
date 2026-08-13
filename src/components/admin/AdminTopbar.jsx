import {
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
} from "react-icons/hi2";

const AdminTopbar = () => {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Left */}

      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back! Manage your Smaze platform.
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-4">
        {/* Search */}

        <div className="relative hidden lg:block">
          <HiOutlineMagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-violet-500 focus:bg-white"
          />
        </div>

        {/* Notification */}

        <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 transition hover:bg-violet-50">
          <HiOutlineBell size={22} className="text-slate-600" />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-white">
            <HiOutlineUserCircle size={24} />
          </div>

          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-slate-800">Admin</h3>

            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
