import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineTag,
  HiOutlineSquares2X2,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: HiOutlineHome,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: HiOutlineUsers,
  },
  {
    name: "Shops",
    path: "/admin/shops",
    icon: HiOutlineBuildingStorefront,
  },
  {
    name: "Offers",
    path: "/admin/offers",
    icon: HiOutlineTag,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: HiOutlineSquares2X2,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: HiOutlineChartBar,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: HiOutlineCog6Tooth,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-7">
        <h1 className="text-3xl font-bold tracking-tight text-violet-700">
          Smaze
        </h1>

        <p className="mt-1 text-sm text-slate-500">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    className={
                      isActive
                        ? "text-white"
                        : "text-slate-500 group-hover:text-violet-700"
                    }
                  />

                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-5">
        <div className="rounded-2xl bg-violet-50 p-4">
          <h3 className="text-sm font-semibold text-violet-700">Smaze Admin</h3>

          <p className="mt-1 text-xs text-slate-500">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
