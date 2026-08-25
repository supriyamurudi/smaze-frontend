// frontend/src/pages/Contact.jsx
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

export default function Contact() {
  return (
    <div className="bg-white">
      {/* Hero */}
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
              Contact Us
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900">
              We'd Love To
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 md:mt-8 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-6 sm:leading-7 md:leading-8 px-2">
              Have questions, suggestions, or business inquiries? Our team is
              here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Contact Cards */}
            <InfoCard
              icon={<FaPhoneAlt />}
              title="Phone"
              text="+91 9876543210"
            />
            <InfoCard
              icon={<FaEnvelope />}
              title="Email"
              text="support@smaze.in"
            />
            <InfoCard
              icon={<FaMapMarkerAlt />}
              title="Address"
              text="Belagavi, Karnataka, India"
            />
            <InfoCard
              icon={<FaClock />}
              title="Business Hours"
              text="Mon - Sat : 9:00 AM - 6:00 PM"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-8 sm:mb-10 md:mb-16">
            <span className="text-violet-600 font-semibold uppercase tracking-widest text-xs sm:text-sm">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-3 sm:mt-4 text-gray-900">
              Got Questions?
            </h2>
            <p className="text-gray-600 mt-2 sm:mt-3 md:mt-5 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Here are some common questions about Smaze.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <Faq
              question="How do I find nearby offers?"
              answer="Simply search by category or location to discover exclusive offers from nearby businesses."
            />
            <Faq
              question="Is Smaze free to use?"
              answer="Yes. Customers can browse shops and offers completely free."
            />
            <Faq
              question="Can I register my business?"
              answer="Yes. Business owners can create an account and publish offers to reach more customers."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl sm:rounded-3xl md:rounded-[40px] bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white text-center p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
              Let's Grow Together 🚀
            </h2>
            <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto">
              Whether you're looking for amazing local deals or want to promote
              your business, Smaze is here to help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-5 mt-6 sm:mt-8 md:mt-10">
              <button className="px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-white text-violet-700 font-bold hover:scale-105 transition text-sm sm:text-base">
                Explore Deals
              </button>
              <button className="px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl border-2 border-white font-bold hover:bg-white hover:text-violet-700 transition text-sm sm:text-base">
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------- Components ----------------
function InfoCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg border border-violet-100 flex items-start gap-4 sm:gap-5"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white flex items-center justify-center text-base sm:text-lg md:text-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
          {title}
        </h3>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function Faq({ question, answer }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-violet-100 p-5 sm:p-6 md:p-7"
    >
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
        {question}
      </h3>
      <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 leading-6 sm:leading-7">
        {answer}
      </p>
    </motion.div>
  );
}
