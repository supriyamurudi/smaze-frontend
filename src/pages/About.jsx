import { motion } from "framer-motion";
import { FaStore, FaBullseye, FaEye, FaHeart } from "react-icons/fa";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}

      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 py-24">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-300/20 blur-3xl"></div>

        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-pink-300/20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-violet-100 text-violet-700 font-semibold mb-6">
              About Smaze
            </span>

            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
              Connecting
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Local Businesses
              </span>
              With Every Customer
            </h1>

            <p className="mt-8 text-lg text-gray-600 max-w-3xl mx-auto leading-8">
              Smaze is a smart local discovery platform that helps people find
              the best nearby offers while enabling businesses to reach more
              customers and grow digitally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
                alt="Team"
                className="rounded-[30px] shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <span className="text-violet-600 font-semibold uppercase tracking-widest">
                Our Story
              </span>

              <h2 className="text-4xl font-black mt-4 text-gray-900">
                Why We Built Smaze?
              </h2>

              <p className="mt-6 text-gray-600 leading-8">
                Every city has amazing local shops, restaurants and businesses
                that often struggle to reach nearby customers. At the same time,
                customers miss out on great discounts, exclusive offers and
                hidden gems around them.
              </p>

              <p className="mt-6 text-gray-600 leading-8">
                Smaze bridges this gap by providing one platform where
                businesses can showcase offers and customers can discover the
                best deals effortlessly.
              </p>

              <div className="mt-10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white flex items-center justify-center text-2xl">
                  <FaStore />
                </div>

                <div>
                  <h3 className="font-bold text-xl">Supporting Local Growth</h3>

                  <p className="text-gray-500">
                    Empowering businesses with digital visibility.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black">Our Mission & Vision</h2>

            <p className="text-gray-600 mt-4">
              Building a smarter ecosystem for local businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-violet-600 font-semibold uppercase tracking-widest">
              Why Choose Us
            </span>

            <h2 className="text-4xl lg:text-5xl font-black mt-4 text-gray-900">
              Everything You Need In One Platform
            </h2>

            <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
              Smaze helps customers discover the best local offers while
              empowering businesses to reach more people.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Statistics */}

      <section className="py-24 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <Stat number="500+" text="Businesses" />

            <Stat number="10K+" text="Customers" />

            <Stat number="2500+" text="Offers" />

            <Stat number="4.9★" text="User Rating" />
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-[40px] bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl lg:text-5xl font-black">
              Ready to Explore Local Deals?
            </h2>

            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of customers discovering amazing nearby offers and
              help local businesses grow with Smaze.
            </p>

            <div className="flex flex-wrap justify-center gap-5 mt-10">
              <button className="bg-white text-violet-700 font-bold px-8 py-4 rounded-2xl hover:scale-105 transition">
                Explore Deals
              </button>

              <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white hover:text-violet-700 transition">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Components ---------- */

function Card({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl p-8 shadow-xl border border-violet-100"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white flex items-center justify-center text-2xl mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>

      <p className="mt-4 text-gray-600 leading-7">{text}</p>
    </motion.div>
  );
}

function FeatureCard({ emoji, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      className="bg-white rounded-3xl shadow-xl p-8 border border-violet-100"
    >
      <div className="text-5xl mb-6">{emoji}</div>

      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>

      <p className="mt-4 text-gray-600 leading-7">{text}</p>
    </motion.div>
  );
}

function Stat({ number, text }) {
  return (
    <div className="text-center text-white">
      <h2 className="text-5xl font-black">{number}</h2>

      <p className="mt-3 text-lg text-white/90">{text}</p>
    </div>
  );
}
