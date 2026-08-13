// frontend/src/components/Categories.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FaTshirt,
  FaUtensils,
  FaLaptop,
  FaShoppingBasket,
  FaGem,
  FaCut,
  FaClinicMedical,
  FaCouch,
  FaCar,
  FaGraduationCap,
  FaFootballBall,
  FaFilm,
  FaArrowRight,
  FaLayerGroup,
  FaStore,
} from "react-icons/fa";

import { getCategories } from "../services/categoryService";

// Category icon mapping
const categoryIcons = {
  fashion: <FaTshirt />,
  restaurant: <FaUtensils />,
  electronics: <FaLaptop />,
  grocery: <FaShoppingBasket />,
  jewellery: <FaGem />,
  beauty: <FaCut />,
  medical: <FaClinicMedical />,
  furniture: <FaCouch />,
  car: <FaCar />,
  education: <FaGraduationCap />,
  sports: <FaFootballBall />,
  entertainment: <FaFilm />,
  food: <FaUtensils />,
  tech: <FaLaptop />,
  fitness: <FaFootballBall />,
  salon: <FaCut />,
  cafe: <FaUtensils />,
};

// Category color mapping
const categoryColors = [
  "from-pink-500 to-rose-500",
  "from-orange-500 to-red-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-yellow-400 to-amber-500",
  "from-fuchsia-500 to-pink-500",
  "from-sky-500 to-blue-600",
  "from-amber-600 to-orange-500",
  "from-slate-600 to-slate-800",
  "from-indigo-500 to-violet-600",
  "from-lime-500 to-green-600",
  "from-purple-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-amber-500 to-yellow-600",
];

// ========== SKELETON LOADER ==========
const CategoriesSkeleton = () => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg"
      >
        <div className="h-16 w-16 rounded-2xl bg-slate-200"></div>
        <div className="mt-4 h-5 w-28 bg-slate-200 rounded"></div>
        <div className="mt-1 h-4 w-20 bg-slate-200 rounded"></div>
        <div className="mt-4 h-px bg-slate-100"></div>
        <div className="mt-4 h-4 w-20 bg-slate-200 rounded"></div>
      </div>
    ))}
  </div>
);

// ========== MAIN COMPONENT ==========
const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        setCategories(response.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const lowerName = categoryName?.toLowerCase() || "";
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        return icon;
      }
    }
    return <FaStore />;
  };

  const getCategoryColor = (index) => {
    return categoryColors[index % categoryColors.length];
  };

  const getShopCount = (category) => {
    return category._count?.shops || 0;
  };

  const handleCategoryClick = (category) => {
    navigate(`/offers?category=${encodeURIComponent(category.name)}`);
  };

  const displayedCategories = showAll ? categories : categories.slice(0, 4);

  if (loading) {
    return (
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl"></div>
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 font-semibold text-violet-700 animate-pulse text-sm">
              <FaLayerGroup />
              Loading Categories...
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-black text-gray-900">
              Explore Every
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Local Business
              </span>
            </h2>
          </div>
          <CategoriesSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl mb-4">😅</div>
          <h3 className="text-2xl font-bold text-slate-800">
            Oops! Something went wrong
          </h3>
          <p className="text-slate-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-gradient-to-r from-violet-700 to-pink-500 px-6 py-3 font-semibold text-white hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-2xl font-bold text-slate-800">
            No Categories Found
          </h3>
          <p className="text-slate-500 mt-2">
            Categories will appear here once they are added by the admin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-violet-50 via-white to-pink-50">
      {/* Decorative Background */}
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl"></div>
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 font-semibold text-violet-700 text-sm">
            <FaLayerGroup />
            Browse Categories
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-black text-gray-900">
            Explore Every
            <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
              Local Business
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
            Find amazing businesses, restaurants and exclusive offers around
            your city.
          </p>
        </motion.div>

        {/* Categories Grid - Medium Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedCategories.map((category, index) => {
            const color = getCategoryColor(index);
            const icon = getCategoryIcon(category.name);
            const shopCount = getShopCount(category);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                onClick={() => handleCategoryClick(category)}
                className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Decorative Circle */}
                <div
                  className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${color} opacity-10 group-hover:scale-150 transition duration-500`}
                />

                <div className="relative z-10 p-5">
                  {/* Icon */}
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${color} text-white text-3xl shadow-md transition-all duration-300 group-hover:rotate-6 group-hover:scale-110`}
                  >
                    {icon}
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    {category.name}
                  </h3>

                  {/* Shop Count */}
                  <p className="text-sm text-gray-500">
                    {shopCount > 0 ? `${shopCount}+ Shops` : "Coming Soon"}
                  </p>

                  {/* Divider */}
                  <div className="mt-4 h-px bg-gray-100"></div>

                  {/* Explore Button */}
                  <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-violet-700 transition-all duration-300 group-hover:gap-4">
                    Explore
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1 text-sm" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        {categories.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-full bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm"
            >
              {showAll ? (
                "Show Less"
              ) : (
                <span className="flex items-center gap-2">
                  View All Categories <FaArrowRight />
                </span>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Categories;
