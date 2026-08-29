// frontend/src/pages/customer/Shops.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineBuildingStorefront,
  HiOutlineMapPin,
  HiOutlineStar,
} from "react-icons/hi2";
import { getShops } from "../../services/shopService";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getShops();
        setShops(response.shops || []);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 shadow-sm animate-pulse"
              >
                <div className="h-40 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-5 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Browse Shops
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Discover trusted local shops near you
          </p>
        </motion.div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-bold text-slate-800">
                No shops found
              </h3>
              <p className="text-slate-500 mt-2">
                Check back later for new shops in your area.
              </p>
            </div>
          ) : (
            shops.map((shop) => (
              <Link
                key={shop.id}
                to={`/customer/shops/${shop.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:-translate-y-1">
                  <div className="relative h-40 bg-gradient-to-br from-violet-50 to-purple-50">
                    {shop.image ? (
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiOutlineBuildingStorefront
                          className="text-violet-300"
                          size={48}
                        />
                      </div>
                    )}
                    {shop.status === "active" && (
                      <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
                      {shop.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <HiOutlineMapPin size={14} />
                      <span className="truncate">
                        {shop.address || "Address not available"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <HiOutlineStar size={14} className="fill-yellow-400" />
                        <span className="text-xs font-semibold text-slate-700">
                          {shop.rating || "New"}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-violet-600">
                        View Shop →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Shops;
