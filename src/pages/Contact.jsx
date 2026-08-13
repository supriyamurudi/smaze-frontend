import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

export default function Contact() {
  return (
    <div className="bg-white">
      {/* Hero */}

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
              Contact Us
            </span>

            <h1 className="text-5xl lg:text-7xl font-black text-gray-900">
              We'd Love To
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>

            <p className="mt-8 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
              Have questions, suggestions, or business inquiries? Our team is
              here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Cards */}

            <div className="lg:col-span-2 space-y-6">
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

            {/* Contact Form */}

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-white rounded-[35px] shadow-2xl border border-violet-100 p-10"
            >
              <h2 className="text-3xl font-black">Send Us A Message</h2>

              <p className="text-gray-500 mt-3">
                Fill out the form below and we'll get back to you.
              </p>

              <form className="mt-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="border rounded-2xl px-5 h-14 outline-none focus:ring-2 focus:ring-violet-500"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="border rounded-2xl px-5 h-14 outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full border rounded-2xl px-5 h-14 outline-none focus:ring-2 focus:ring-violet-500"
                />

                <textarea
                  rows="6"
                  placeholder="Your Message..."
                  className="w-full border rounded-2xl px-5 py-4 resize-none outline-none focus:ring-2 focus:ring-violet-500"
                ></textarea>

                <button className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition">
                  <FaPaperPlane />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      {/* FAQ */}

      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-violet-600 font-semibold uppercase tracking-widest">
              Frequently Asked Questions
            </span>

            <h2 className="text-4xl lg:text-5xl font-black mt-4 text-gray-900">
              Got Questions?
            </h2>

            <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
              Here are some common questions about Smaze.
            </p>
          </div>

          <div className="space-y-5">
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

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-[40px] bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white text-center p-12 shadow-2xl">
            <h2 className="text-4xl lg:text-5xl font-black">
              Let's Grow Together 🚀
            </h2>

            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
              Whether you're looking for amazing local deals or want to promote
              your business, Smaze is here to help.
            </p>

            <div className="flex flex-wrap justify-center gap-5 mt-10">
              <button className="px-8 py-4 rounded-2xl bg-white text-violet-700 font-bold hover:scale-105 transition">
                Explore Deals
              </button>

              <button className="px-8 py-4 rounded-2xl border-2 border-white font-bold hover:bg-white hover:text-violet-700 transition">
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Components ---------------- */

function InfoCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl p-6 shadow-lg border border-violet-100 flex items-start gap-5"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white flex items-center justify-center text-xl">
        {icon}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>

        <p className="mt-2 text-gray-600">{text}</p>
      </div>
    </motion.div>
  );
}

function Faq({ question, answer }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl shadow-lg border border-violet-100 p-7"
    >
      <h3 className="text-xl font-bold text-gray-900">{question}</h3>

      <p className="mt-3 text-gray-600 leading-7">{answer}</p>
    </motion.div>
  );
}
