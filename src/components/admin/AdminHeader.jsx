import {
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
  HiOutlineChevronDown,
} from "react-icons/hi2";

const AdminHeader = () => {
  return (
    <header
      className="
      sticky
      top-0
      z-30
      flex
      h-20
      items-center
      justify-between
      border-b
      border-slate-200
      bg-white/90
      px-6
      backdrop-blur-md
      lg:px-8
      "
    >
      {/* Left Section */}

      <div>
        <div className="flex items-center gap-3">
          <h1
            className="
            text-2xl
            font-bold
            text-slate-800
            "
          >
            Admin Dashboard
          </h1>

          <span
            className="
            hidden
            rounded-full
            bg-violet-100
            px-3
            py-1
            text-xs
            font-semibold
            text-violet-700
            md:block
            "
          >
            Smaze
          </span>
        </div>

        <p
          className="
          mt-1
          text-sm
          text-slate-500
          "
        >
          Welcome back! Manage your marketplace efficiently.
        </p>
      </div>

      {/* Right Section */}

      <div className="flex items-center gap-4">
        {/* Search */}

        <div
          className="
          relative
          hidden
          lg:block
          "
        >
          <HiOutlineMagnifyingGlass
            size={20}
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search users, shops, offers..."
            className="
            w-80
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-3
            pl-11
            pr-4
            text-sm
            text-slate-700
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-violet-500
            focus:bg-white
            "
          />
        </div>

        {/* Notification */}

        <button
          className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
          transition
          hover:border-violet-200
          hover:bg-violet-50
          "
        >
          <HiOutlineBell size={22} className="text-slate-600" />

          <span
            className="
            absolute
            right-2
            top-2
            flex
            h-4
            min-w-4
            items-center
            justify-center
            rounded-full
            bg-red-500
            px-1
            text-[10px]
            font-semibold
            text-white
            "
          >
            3
          </span>
        </button>

        {/* Profile */}

        <button
          className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-slate-200
          bg-white
          px-3
          py-2
          transition
          hover:border-violet-200
          hover:bg-violet-50
          "
        >
          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-violet-600
            text-white
            "
          >
            <HiOutlineUserCircle size={25} />
          </div>

          <div className="hidden text-left md:block">
            <h3
              className="
              text-sm
              font-semibold
              text-slate-800
              "
            >
              Admin
            </h3>

            <p
              className="
              text-xs
              text-slate-500
              "
            >
              Super Administrator
            </p>
          </div>

          <HiOutlineChevronDown
            size={18}
            className="
            hidden
            text-slate-400
            md:block
            "
          />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
