// frontend/src/components/WhyChooseUs.jsx
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaMapMarkedAlt,
  FaBell,
  FaHeart,
  FaSearch,
  FaTags,
} from "react-icons/fa";

const features = [
  {
    icon: <FaCheckCircle />,
    title: "Verified Businesses",
    description:
      "Every shop on Smaze is verified, ensuring trusted businesses and genuine offers.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <FaTags />,
    title: "Exclusive Local Offers",
    description:
      "Discover special discounts and promotions available only from nearby local stores.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Nearby Deals",
    description:
      "Find the best offers around your location quickly with smart location-based discovery.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <FaBell />,
    title: "Instant Notifications",
    description:
      "Get real-time alerts whenever your favorite shops launch new offers.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: <FaHeart />,
    title: "Save Favorites",
    description: "Save your favorite shops and deals to access them anytime.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: <FaSearch />,
    title: "Smart Search",
    description:
      "Search shops, categories and offers easily to find exactly what you need.",
    color: "from-sky-500 to-blue-600",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-10 sm:py-14 md:py-20 lg:py-24 bg-gradient-to-b from-white via-purple-50/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-16"
        >
          <span className="inline-flex px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold text-[10px] sm:text-xs md:text-sm">
            Why Choose Smaze
          </span>

          <h2 className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            Smarter Way To
            <span className="block sm:inline bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              {" "}
              Discover Local Deals
            </span>
          </h2>

          <p className="mt-2 sm:mt-3 md:mt-4 lg:mt-5 max-w-3xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg text-slate-500 leading-5 sm:leading-6 md:leading-7 lg:leading-8 px-2">
            Smaze connects customers with trusted local businesses, helping you
            discover genuine offers, discounts and exciting promotions near you.
          </p>
        </motion.div>

        {/* Cards Grid - Responsive */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 md:hover:-translate-y-3 transition-all duration-500 overflow-hidden"
            >
              {/* Decorative Circle */}
              <div className="absolute -top-8 sm:-top-10 md:-top-12 -right-8 sm:-right-10 md:-right-12 w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 rounded-full bg-purple-100 opacity-40 group-hover:scale-150 transition duration-500" />

              {/* Icon */}
              <div
                className={`relative w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-base sm:text-lg md:text-xl lg:text-2xl shadow-lg mb-3 sm:mb-4 md:mb-5 lg:mb-7 group-hover:rotate-6 transition-all duration-300`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
                {feature.title}
              </h3>

              <p className="text-xs sm:text-sm md:text-base text-slate-500 leading-5 sm:leading-6 md:leading-7">
                {feature.description}
              </p>

              {/* Bottom Line */}
              <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-7 h-1 w-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
