import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Store, Tag } from "lucide-react";

const AdminBottomNav = () => {
  const tabs = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-6 w-6" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users className="h-6 w-6" />,
    },
    {
      name: "Shops",
      path: "/admin/shops",
      icon: <Store className="h-6 w-6" />,
    },
    {
      name: "Offers",
      path: "/admin/offers",
      icon: <Tag className="h-6 w-6" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 pb-safe lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2.5 text-xs font-medium transition-colors ${
                isActive
                  ? "text-violet-600"
                  : "text-slate-500 hover:text-slate-900"
              }`
            }
          >
            <div className="mb-1">{tab.icon}</div>
            <span className="truncate">{tab.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminBottomNav;
