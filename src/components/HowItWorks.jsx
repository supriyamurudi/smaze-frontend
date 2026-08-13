// frontend/src/components/HowItWorks.jsx
import { FaUserPlus, FaSearch, FaTags, FaStore } from "react-icons/fa";

const steps = [
  {
    id: "01",
    icon: <FaUserPlus />,
    title: "Create Account",
    description:
      "Sign up quickly and personalize your profile to start exploring amazing local deals.",
    color: "from-purple-600 to-fuchsia-500",
  },
  {
    id: "02",
    icon: <FaSearch />,
    title: "Explore Offers",
    description:
      "Discover discounts and promotions from verified businesses near your location.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "03",
    icon: <FaTags />,
    title: "Save Favorites",
    description:
      "Bookmark your favorite shops and offers to access them anytime.",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "04",
    icon: <FaStore />,
    title: "Visit & Save",
    description:
      "Visit stores, redeem offers and enjoy exciting savings on your purchases.",
    color: "from-green-500 to-emerald-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <span className="inline-flex px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold text-xs sm:text-sm">
            How It Works
          </span>

          <h2 className="mt-4 sm:mt-5 md:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">
            Find Amazing Deals
            <span className="block sm:inline bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              {" "}
              In 4 Simple Steps
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 md:mt-5 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-500">
            Smaze makes discovering local offers simple, fast and rewarding.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 relative">
          {/* Desktop Horizontal Connector */}
          <div className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-purple-200 via-pink-300 to-purple-200 -translate-y-1/2" />

          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 text-center border border-purple-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 sm:hover:-translate-y-3 transition-all duration-500"
            >
              {/* Number */}
              <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-lg z-10">
                {step.id}
              </div>

              {/* Mobile/Tablet Vertical Connector */}
              {index < steps.length - 1 && (
                <div className="lg:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-purple-300 to-pink-300" />
              )}

              {/* Icon */}
              <div
                className={`mt-6 sm:mt-7 md:mt-8 mx-auto w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-all duration-300`}
              >
                {step.icon}
              </div>

              <h3 className="mt-4 sm:mt-5 md:mt-7 text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base text-slate-500 leading-6 sm:leading-7">
                {step.description}
              </p>

              {/* Step Number Indicator - Desktop only */}
              <div className="hidden lg:block mt-4 text-xs font-semibold text-purple-400">
                Step {step.id}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Optional */}
        <div className="text-center mt-10 sm:mt-12 md:mt-16">
          <p className="text-sm sm:text-base text-slate-500">
            Ready to start saving?{" "}
            <a
              href="/signup"
              className="text-purple-600 font-semibold hover:text-purple-700 transition"
            >
              Sign up for free →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
