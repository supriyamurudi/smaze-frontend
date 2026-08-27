// frontend/src/layouts/ShopLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ✅ CORRECT PATH FOR YOUR PROJECT STRUCTURE!
import ShopNavbar from "../components/navbar/ShopNavbar";
// ✅ ADD THIS IMPORT
import ShopBottomNav from "../components/navbar/ShopBottomNav";
import { getMyShop } from "../services/shopService";
import toast from "react-hot-toast";

// ========== CONTENT SKELETON LOADER ==========
const ContentSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] rounded-3xl bg-white p-4 shadow-sm border border-slate-200 sm:p-5 md:p-7">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
            <div className="mt-2 h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="mt-4 md:mt-0 h-10 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-5 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="mt-4 h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-1 h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-slate-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
            <div className="mt-1 h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="divide-y divide-slate-100">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-5"
              >
                <div>
                  <div className="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
                  <div className="mt-1 h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const ShopLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShop = async () => {
      try {
        setLoading(true);
        await getMyShop();
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 400) {
          const currentPath = window.location.pathname;
          if (currentPath !== "/shop/create-shop") {
            navigate("/shop/create-shop", { replace: true });
          }
        } else {
          console.error("Failed to load shop:", error);
          toast.error("Failed to load shop data");
        }
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* ✅ Navbar with the Smaze Logo */}
      <ShopNavbar />

      {/* Main Content Area */}
      {/* ✅ ADDED pb-24 so content doesn't hide behind the footer */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24">
        {loading ? (
          <ContentSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[calc(100vh-140px)]"
          >
            <Outlet />
          </motion.div>
        )}
      </main>

      {/* ✅ ADD THE FOOTER HERE */}
      <ShopBottomNav />
    </div>
  );
};

export default ShopLayout;
