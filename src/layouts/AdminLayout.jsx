// frontend/src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/navbar/AdminNavbar";
// ✅ ADD THIS IMPORT
import AdminBottomNav from "../components/navbar/AdminBottomNav";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-72
          transition-transform
          duration-300
          ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <AdminSidebar
          closeSidebar={() => setSidebarOpen(false)}
          currentPath={location.pathname}
        />
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        <AdminNavbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden"
        >
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </motion.main>
      </div>

      {/* ✅ ADD THE BOTTOM NAV HERE (Only shows on mobile) */}
      <AdminBottomNav />
    </div>
  );
};

export default AdminLayout;
