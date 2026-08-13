import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const menuItems = [
  {
    name: "Dashboard",
    path: "/customer/dashboard",
    icon: HiOutlineHome,
  },
  {
    name: "Offers",
    path: "/customer/offers",
    icon: HiOutlineTag,
  },
  {
    name: "Saved Offers",
    path: "/customer/saved-offers",
    icon: HiOutlineHeart,
  },
  {
    name: "Notifications",
    path: "/customer/notifications",
    icon: HiOutlineBell,
  },
  {
    name: "Profile",
    path: "/customer/profile",
    icon: HiOutlineUser,
  },
  {
    name: "Settings",
    path: "/customer/settings",
    icon: HiOutlineCog6Tooth,
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
        hidden
        lg:flex
        fixed
        left-0
        top-0
        z-40
        h-screen
        w-72
        flex-col
        bg-white
        border-r
        border-slate-200
      "
    >
      {/* Logo */}
      <div
        className="
        border-b
        border-slate-200
        px-6
        py-7
      "
      >
        <h1
          className="
          text-3xl
          font-bold
          tracking-tight
        "
        >
          <span className="text-violet-600">S</span>
          <span className="text-slate-900">maze</span>
        </h1>

        <p
          className="
          mt-1
          text-sm
          text-slate-500
        "
        >
          Customer Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav
        className="
        flex-1
        overflow-y-auto
        space-y-2
        px-4
        py-6
      "
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                group
                flex
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-200

                ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                }
                `
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
      <div
        className="
        border-t
        border-slate-200
        p-5
      "
      >
        <div
          className="
          rounded-2xl
          bg-violet-50
          p-4
        "
        >
          <h3
            className="
            text-sm
            font-semibold
            text-violet-700
          "
          >
            Smaze Customer
          </h3>

          <p
            className="
            mt-1
            text-xs
            text-slate-500
          "
          >
            Discover best local offers
          </p>
        </div>

        {/* Logout */}
        <button
          className="
            mt-4
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            text-sm
            font-medium
            text-red-500
            hover:bg-red-50
            transition
          "
        >
          <HiOutlineArrowRightOnRectangle size={22} />
          Logout
        </button>
      </div>
    </aside>
  );
}
