import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="lg:ml-64 lg:pl-5">
        {/* Header */}
        <header
          className="
          h-20
          bg-white
          rounded-b-xl
          px-6 md:px-8
          flex
          items-center
          justify-between
          shadow-sm
        "
        >
          <div>
            <h2
              className="
              text-2xl
              font-bold
              text-gray-900
            "
            >
              Smaze Dashboard
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              mt-1
            "
            >
              Welcome back 👋
            </p>
          </div>

          <div
            className="
            flex
            items-center
            gap-5
          "
          >
            {/* Notification */}
            <button
              className="
                w-10
                h-10
                rounded-full
                bg-violet-50
                text-violet-600
                flex
                items-center
                justify-center
                hover:bg-violet-100
                transition
              "
            >
              🔔
            </button>

            {/* Profile */}
            <img
              src="https://ui-avatars.com/api/?name=Customer&background=7c3aed&color=fff"
              alt="profile"
              className="
                w-11
                h-11
                rounded-full
                shadow-sm
              "
            />
          </div>
        </header>

        {/* Content */}
        <main
          className="
          p-5
          md:p-8
        "
        >
          <div
            className="
            bg-white
            rounded-2xl
            p-5
            md:p-6
            shadow-sm
            min-h-[calc(100vh-130px)]
          "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
