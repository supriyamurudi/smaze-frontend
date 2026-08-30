// frontend/src/pages/About.jsx
import { motion } from "framer-motion";
import { FaStore, FaBullseye, FaEye, FaHeart } from "react-icons/fa";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <div className="absolute -top-40 -left-40 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 rounded-full bg-violet-300/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 rounded-full bg-pink-300/20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full bg-violet-100 text-violet-700 font-semibold text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6">
              About Smaze
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
              Connecting
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Local Businesses
              </span>
              With Every Customer
            </h1>

            <p className="mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-6 sm:leading-7 md:leading-8 px-2">
              Smaze is a smart local discovery platform that helps people find
              the best nearby offers while enabling businesses to reach more
              customers and grow digitally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
                alt="Team"
                className="rounded-2xl sm:rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 text-center lg:text-left"
            >
              <span className="text-violet-600 font-semibold uppercase tracking-widest text-xs sm:text-sm">
                Our Story
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mt-3 sm:mt-4 text-gray-900">
                Why We Built Smaze?
              </h2>

              <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base text-gray-600 leading-6 sm:leading-7 md:leading-8">
                Every city has amazing local shops, restaurants and businesses
                that often struggle to reach nearby customers. At the same time,
                customers miss out on great discounts, exclusive offers and
                hidden gems around them.
              </p>

              <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base text-gray-600 leading-6 sm:leading-7 md:leading-8">
                Smaze bridges this gap by providing one platform where
                businesses can showcase offers and customers can discover the
                best deals effortlessly.
              </p>

              <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 justify-center lg:justify-start">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  <FaStore />
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-lg sm:text-xl">
                    Supporting Local Growth
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Empowering businesses with digital visibility.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
              Our Mission & Vision
            </h2>
            <p className="text-gray-600 mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base">
              Building a smarter ecosystem for local businesses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card
              icon={<FaBullseye />}
              title="Mission"
              text="Help people discover the best local offers while enabling businesses to grow digitally."
            />

            <Card
              icon={<FaEye />}
              title="Vision"
              text="Become India's leading local discovery platform connecting every customer with every nearby business."
            />

            <Card
              icon={<FaHeart />}
              title="Values"
              text="Innovation, Trust, Community, Simplicity and Customer Satisfaction."
            />
          </div>
        </div>
      </section>

      {/* Why Choose Smaze */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 md:mb-16">
            <span className="text-violet-600 font-semibold uppercase tracking-widest text-xs sm:text-sm">
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-3 sm:mt-4 text-gray-900">
              Everything You Need In One Platform
            </h2>
            <p className="text-gray-600 mt-3 sm:mt-4 md:mt-5 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Smaze helps customers discover the best local offers while
              empowering businesses to reach more people.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <FeatureCard
              emoji="🎁"
              title="Exclusive Offers"
              text="Discover amazing discounts from nearby businesses every day."
            />
            <FeatureCard
              emoji="📍"
              title="Nearby Shops"
              text="Find trusted restaurants, stores and services around you."
            />
            <FeatureCard
              emoji="⚡"
              title="Fast Discovery"
              text="Search offers instantly with a clean and simple experience."
            />
            <FeatureCard
              emoji="🤝"
              title="Support Local"
              text="Help local businesses grow while saving money."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl sm:rounded-3xl md:rounded-[40px] bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 p-6 sm:p-8 md:p-10 lg:p-12 text-center text-white shadow-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
              Ready to Explore Local Deals?
            </h2>
            <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of customers discovering amazing nearby offers and
              help local businesses grow with Smaze.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-5 mt-6 sm:mt-8 md:mt-10">
              <button className="bg-white text-violet-700 font-bold px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl hover:scale-105 transition text-sm sm:text-base">
                Explore Deals
              </button>
              <button className="border-2 border-white text-white font-bold px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl hover:bg-white hover:text-violet-700 transition text-sm sm:text-base">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------- Components ----------
function Card({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl border border-violet-100 text-center sm:text-left"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl mx-auto sm:mx-0 mb-4 sm:mb-5 md:mb-6">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
        {title}
      </h3>
      <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base text-gray-600 leading-6 sm:leading-7">
        {text}
      </p>
    </motion.div>
  );
}

function FeatureCard({ emoji, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 md:p-8 border border-violet-100 text-center"
    >
      <div className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-5 md:mb-6">
        {emoji}
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
        {title}
      </h3>
      <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base text-gray-600 leading-6 sm:leading-7">
        {text}
      </p>
    </motion.div>
  );
}
