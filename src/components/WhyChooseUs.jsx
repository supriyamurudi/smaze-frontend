// frontend/src/components/WhyChooseUs.jsx
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
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-purple-50/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <span className="inline-flex px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold text-xs sm:text-sm">
            Why Choose Smaze
          </span>

          <h2 className="mt-4 sm:mt-5 md:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            Smarter Way To
            <span className="block sm:inline bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              {" "}
              Discover Local Deals
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 md:mt-5 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-slate-500 leading-6 sm:leading-7 md:leading-8">
            Smaze connects customers with trusted local businesses, helping you
            discover genuine offers, discounts and exciting promotions near you.
          </p>
        </div>

        {/* Cards Grid - Responsive */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 sm:hover:-translate-y-3 transition-all duration-500 overflow-hidden"
            >
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full bg-purple-100 opacity-40 group-hover:scale-150 transition duration-500" />

              {/* Icon */}
              <div
                className={`relative w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg mb-4 sm:mb-5 md:mb-7 group-hover:rotate-6 transition-all duration-300`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 md:mb-4">
                {feature.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-500 leading-6 sm:leading-7">
                {feature.description}
              </p>

              {/* Bottom Line */}
              <div className="mt-4 sm:mt-5 md:mt-7 h-1 w-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
