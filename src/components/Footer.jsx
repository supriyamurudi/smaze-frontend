// frontend/src/components/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-slate-300">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="
              bg-gradient-to-r
              from-purple-600
              via-fuchsia-500
              to-pink-500
              rounded-2xl sm:rounded-3xl
              p-6 sm:p-8 md:p-10 lg:p-12
              flex
              flex-col
              lg:flex-row
              items-center
              justify-between
              gap-6 sm:gap-8
              shadow-2xl
            "
          >
            <div className="text-center lg:text-left">
              <span
                className="
                  inline-block
                  bg-white/20
                  backdrop-blur-md
                  text-white
                  px-3 sm:px-4 md:px-5
                  py-1 sm:py-1.5 md:py-2
                  rounded-full
                  text-[10px] sm:text-xs md:text-sm
                  font-semibold
                "
              >
                Stay Updated
              </span>

              <h2
                className="
                  text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                  font-black
                  text-white
                  mt-3 sm:mt-4 md:mt-5
                  leading-tight
                "
              >
                Never Miss Amazing Local Deals
              </h2>

              <p
                className="
                  mt-2 sm:mt-3 md:mt-4 lg:mt-5
                  text-sm sm:text-base
                  text-white/80
                  leading-6 sm:leading-7
                  max-w-xl mx-auto lg:mx-0
                "
              >
                Subscribe to get the latest offers, discounts and exclusive
                deals from verified local businesses around you.
              </p>
            </div>

            <div className="w-full lg:w-[420px]">
              <form
                onSubmit={handleSubscribe}
                className="
                  bg-white/20
                  backdrop-blur-xl
                  border
                  border-white/30
                  rounded-xl sm:rounded-2xl
                  p-1.5 sm:p-2
                  flex
                  flex-col sm:flex-row
                  gap-2 sm:gap-0
                "
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="
                    flex-1
                    bg-transparent
                    outline-none
                    px-3 sm:px-4
                    py-2.5 sm:py-3
                    text-sm sm:text-base
                    text-white
                    placeholder:text-white/70
                    min-w-0
                  "
                  required
                />

                <button
                  type="submit"
                  className="
                    bg-white
                    text-purple-600
                    px-4 sm:px-5 md:px-6
                    py-2 sm:py-2.5 md:py-3
                    rounded-lg sm:rounded-xl
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-1.5 sm:gap-2
                    hover:scale-105
                    transition
                    text-sm sm:text-base
                    whitespace-nowrap
                  "
                >
                  {isSubscribed ? "Subscribed! ✅" : "Subscribe"}
                  <FaArrowRight className="text-xs sm:text-sm" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-16">
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-8 sm:gap-10 md:gap-12
          "
        >
          {/* Brand */}
          <div className="text-center sm:text-left">
            <Link to="/" className="inline-block">
              <h2
                className="
                  text-3xl sm:text-4xl
                  font-black
                  text-white
                  hover:text-purple-400
                  transition
                "
              >
                <span className="text-purple-500">S</span>
                maze
              </h2>
            </Link>

            <p
              className="
                mt-3 sm:mt-4 md:mt-5
                text-sm sm:text-base
                leading-6 sm:leading-7
                text-slate-400
                max-w-xs mx-auto sm:mx-0
              "
            >
              Discover amazing local offers, discounts and trusted businesses
              around you with Smaze.
            </p>

            <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center sm:justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-9 sm:w-10 md:w-11
                  h-9 sm:h-10 md:h-11
                  rounded-full
                  bg-white/10
                  hover:bg-purple-600
                  flex
                  items-center
                  justify-center
                  transition
                  text-sm sm:text-base
                "
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/smaze.in?igsi=M2kyZWt2bTM3em9q"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-9 sm:w-10 md:w-11
                  h-9 sm:h-10 md:h-11
                  rounded-full
                  bg-white/10
                  hover:bg-pink-500
                  flex
                  items-center
                  justify-center
                  transition
                  text-sm sm:text-base
                "
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links - Using Link only */}
          <div className="text-center sm:text-left">
            <h3
              className="
                text-lg sm:text-xl
                font-bold
                text-white
                mb-4 sm:mb-5 md:mb-6
              "
            >
              Quick Links
            </h3>

            <ul className="space-y-2.5 sm:space-y-3 md:space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-sm sm:text-base hover:text-pink-400 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/offers"
                  className="text-sm sm:text-base hover:text-pink-400 transition"
                >
                  Offers
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-sm sm:text-base hover:text-pink-400 transition"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/shops"
                  className="text-sm sm:text-base hover:text-pink-400 transition"
                >
                  Shops
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm sm:text-base hover:text-pink-400 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm sm:text-base hover:text-pink-400 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3
              className="
                text-lg sm:text-xl
                font-bold
                text-white
                mb-4 sm:mb-5 md:mb-6
              "
            >
              Contact
            </h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                <FaMapMarkerAlt
                  className="
                    text-pink-500
                    mt-0.5 sm:mt-1
                    text-sm sm:text-base
                    flex-shrink-0
                  "
                />
                <p className="text-sm sm:text-base">
                  Belagavi, Karnataka, India
                </p>
              </div>

              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                <FaPhoneAlt
                  className="
                    text-purple-500
                    mt-0.5 sm:mt-1
                    text-sm sm:text-base
                    flex-shrink-0
                  "
                />
                <a
                  href="tel:+91XXXXXXXXX"
                  className="text-sm sm:text-base hover:text-purple-400 transition"
                >
                  +91 XXXXX XXXXX
                </a>
              </div>

              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                <FaEnvelope
                  className="
                    text-pink-500
                    mt-0.5 sm:mt-1
                    text-sm sm:text-base
                    flex-shrink-0
                  "
                />
                <a
                  href="mailto:hellosmaze@gmail.com"
                  className="text-sm sm:text-base hover:text-pink-400 transition"
                >
                  hellosmaze@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div
          className="
            max-w-7xl
            mx-auto
            px-4 sm:px-6
            py-4 sm:py-5 md:py-6
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            gap-3 sm:gap-4
          "
        >
          <p className="text-xs sm:text-sm text-slate-400 text-center">
            © {new Date().getFullYear()}
            <span className="text-white font-semibold"> Smaze</span>. All rights
            reserved.
          </p>

          <div className="flex gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm flex-wrap justify-center">
            <Link
              to="/privacy-policy"
              className="hover:text-pink-400 transition"
            >
              Privacy Policy
            </Link>

            <Link to="/terms" className="hover:text-purple-400 transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
