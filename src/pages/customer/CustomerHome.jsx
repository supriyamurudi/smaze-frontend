import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineFire,
  HiOutlineMapPin,
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineShoppingBag,
  HiOutlineStar,
  HiOutlineHeart,
  HiOutlineChevronRight,
} from "react-icons/hi2";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getOffers } from "../../services/offerService";
import { getCategories } from "../../services/categoryService";
import { getShops } from "../../services/shopService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-[300px] bg-gradient-to-r from-violet-400 to-purple-400 rounded-2xl"></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-slate-200 rounded-2xl h-32"></div>
      ))}
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-slate-200 rounded-2xl h-80"></div>
      ))}
    </div>
  </div>
);

// ========== CATEGORY CARD ==========
const CategoryCard = ({ category, index }) => {
  const colors = [
    "from-violet-500 to-purple-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-blue-500 to-indigo-500",
    "from-cyan-500 to-blue-500",
  ];

  const emojis = ["🍔", "👕", "💄", "🛒", "💻", "🏋️"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Link to={`/customer/offers?category=${category.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${colors[index % colors.length]} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
          ></div>
          <div className="relative">
            <div className="mx-auto text-4xl">
              {emojis[index % emojis.length]}
            </div>
            <h3 className="mt-3 font-semibold text-slate-800">
              {category.name}
            </h3>
            <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 group-hover:w-12"></div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ========== OFFER CARD ==========
const OfferCard = ({ offer }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={offer.image || "https://via.placeholder.com/400x300"}
          alt={offer.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300";
          }}
        />
        <div className="absolute left-3 top-3 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          {offer.discount}% OFF
        </div>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-500 transition hover:scale-110 hover:bg-white backdrop-blur-sm"
        >
          <HiOutlineHeart
            size={18}
            className={isSaved ? "fill-rose-500" : ""}
          />
        </button>
        <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          ⏰ Limited Time
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 line-clamp-1">
            {offer.title}
          </h3>
          <span className="flex-shrink-0 text-xs font-semibold text-slate-500">
            {offer.category?.name || "General"}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {offer.shop?.name || "Local Shop"}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-500">
            <HiOutlineStar size={16} />
            <span className="text-sm font-medium text-slate-700">4.5</span>
          </div>
          <Link
            to={`/customer/offers/${offer.id}`}
            className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-lg"
          >
            View Deal
            <HiOutlineArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ========== SHOP CARD ==========
const ShopCard = ({ shop }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.02 }}
    className="overflow-hidden rounded-2xl bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl"
  >
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-violet-100 to-purple-100">
      <img
        src={shop.image || "https://via.placeholder.com/100"}
        alt={shop.name}
        className="h-16 w-16 rounded-full object-cover"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/100";
        }}
      />
    </div>
    <h3 className="mt-4 font-bold text-slate-800">{shop.name}</h3>
    <p className="text-sm text-slate-500 line-clamp-1">{shop.address}</p>
    <div className="mt-3 flex items-center justify-center gap-1 text-sm text-slate-500">
      <HiOutlineMapPin size={16} />
      <span>Local Shop</span>
    </div>
    <Link
      to={`/customer/shops/${shop.id}`}
      className="mt-4 inline-block rounded-xl border-2 border-violet-600 px-6 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-600 hover:text-white"
    >
      Visit Shop
    </Link>
  </motion.div>
);

// ========== MAIN COMPONENT ==========
const CustomerHome = () => {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [offersData, categoriesData, shopsData] = await Promise.all([
          getOffers(),
          getCategories(),
          getShops(),
        ]);

        setOffers(offersData.offers || []);
        setCategories(categoriesData.categories || []);
        setShops(shopsData.shops || []);
      } catch (error) {
        console.log("Customer Home Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/customer/offers?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <Navbar />

      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 py-16 md:py-24">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white mb-6">
              🎉 Discover Amazing Deals
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              Find Best Deals
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                Around You
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-purple-100 md:text-xl">
              Discover exclusive offers from your favourite local shops and save
              money every day with Smaze.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="mt-8 max-w-xl mx-auto md:mx-0"
            >
              <div className="relative flex items-center rounded-2xl bg-white shadow-lg">
                <HiOutlineMagnifyingGlass
                  className="absolute left-4 text-slate-400"
                  size={22}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search offers, shops, categories..."
                  className="flex-1 rounded-2xl border-0 py-4 pl-12 pr-4 text-slate-800 outline-none"
                />
                <button
                  type="submit"
                  className="m-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 font-semibold text-white transition hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-8 text-white">
              <div>
                <div className="text-3xl font-black">{offers.length}</div>
                <div className="text-sm text-purple-200">Active Offers</div>
              </div>
              <div>
                <div className="text-3xl font-black">{categories.length}</div>
                <div className="text-sm text-purple-200">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-black">{shops.length}</div>
                <div className="text-sm text-purple-200">Local Shops</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
            <p className="text-sm text-slate-500">Browse by category</p>
          </div>
          <Link
            to="/customer/categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
          >
            View All
            <HiOutlineChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.slice(0, 6).map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>

      {/* ========== TRENDING OFFERS ========== */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <HiOutlineFire className="text-rose-500 text-2xl" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Trending Offers
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                Most popular deals right now
              </p>
            </div>
            <Link
              to="/customer/offers"
              className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              See All
              <HiOutlineChevronRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.slice(0, 3).map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* ========== FEATURED SHOPS ========== */}
      {shops.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <HiOutlineShoppingBag className="text-emerald-500 text-2xl" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Featured Shops
                </h2>
              </div>
              <p className="text-sm text-slate-500">Popular shops near you</p>
            </div>
            <Link
              to="/customer/shops"
              className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              View All
              <HiOutlineChevronRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shops.slice(0, 3).map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </section>
      )}

      {/* ========== ENDING SOON ========== */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <HiOutlineClock className="text-amber-500 text-2xl" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Ending Soon
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                Grab them before they're gone
              </p>
            </div>
            <Link
              to="/customer/offers"
              className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              View All
              <HiOutlineChevronRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.slice(0, 3).map((offer) => (
              <motion.div
                key={`ending-${offer.id}`}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg"
              >
                <img
                  src={offer.image || "https://via.placeholder.com/80"}
                  alt={offer.title}
                  className="h-16 w-16 rounded-xl object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80";
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">
                    {offer.title}
                  </h4>
                  <p className="text-sm text-rose-500">⏰ Expires soon</p>
                </div>
                <Link
                  to={`/customer/offers/${offer.id}`}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105"
                >
                  Grab
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ========== SHOP OWNER CTA ========== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-10 text-center text-white shadow-xl"
        >
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="relative">
            <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium mb-4">
              🏪 Shop Owners
            </div>
            <h2 className="text-3xl font-black">Own a Shop?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-purple-100">
              Join Smaze and grow your business. Reach thousands of customers in
              your area.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/shop/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-violet-700 transition hover:scale-105 hover:shadow-lg"
              >
                Register Shop
                <HiOutlineArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="rounded-xl border border-white/30 px-8 py-3 font-semibold transition hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomerHome;
