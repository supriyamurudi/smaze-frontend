import { NavLink } from "react-router-dom";
import { Home, Search, Heart, User, Bell } from "lucide-react";

const CustomerBottomNav = () => {
  const tabs = [
    {
      name: "Home",
      path: "/customer/dashboard",
      icon: <Home className="h-6 w-6" />,
    },
    {
      name: "Categories",
      path: "/customer/categories",
      icon: <Search className="h-6 w-6" />,
    },
    {
      name: "Saved",
      path: "/customer/saved-offers",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      name: "Notifications",
      path: "/customer/notifications",
      icon: <Bell className="h-6 w-6" />,
    },
    {
      name: "Profile",
      path: "/customer/profile",
      icon: <User className="h-6 w-6" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 pb-safe">
      <div className="mx-auto grid max-w-lg grid-cols-5">
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

export default CustomerBottomNav;
