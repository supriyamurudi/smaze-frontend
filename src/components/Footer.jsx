import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-slate-300">
      {/* Newsletter Section */}

      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div
            className="
            bg-gradient-to-r
            from-purple-600
            via-fuchsia-500
            to-pink-500
            rounded-3xl
            p-8
            lg:p-12
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-8
            shadow-2xl
            "
          >
            <div className="max-w-xl">
              <span
                className="
                inline-block
                bg-white/20
                backdrop-blur-md
                text-white
                px-5
                py-2
                rounded-full
                text-sm
                font-semibold
                "
              >
                Stay Updated
              </span>

              <h2
                className="
                text-3xl
                lg:text-5xl
                font-black
                text-white
                mt-5
                leading-tight
                "
              >
                Never Miss Amazing Local Deals
              </h2>

              <p
                className="
                mt-5
                text-white/80
                leading-7
                "
              >
                Subscribe to get the latest offers, discounts and exclusive
                deals from verified local businesses around you.
              </p>
            </div>

            <div className="w-full lg:w-[420px]">
              <div
                className="
                bg-white/20
                backdrop-blur-xl
                border
                border-white/30
                rounded-2xl
                p-2
                flex
                "
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                  flex-1
                  bg-transparent
                  outline-none
                  px-4
                  text-white
                  placeholder:text-white/70
                  "
                />

                <button
                  className="
                  bg-white
                  text-purple-600
                  px-6
                  py-3
                  rounded-xl
                  font-semibold
                  flex
                  items-center
                  gap-2
                  hover:scale-105
                  transition
                  "
                >
                  Subscribe
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div
          className="
          grid
          md:grid-cols-2
          lg:grid-cols-4
          gap-12
          "
        >
          {/* Brand */}

          <div>
            <h2
              className="
              text-4xl
              font-black
              text-white
              "
            >
              <span className="text-purple-500">S</span>
              maze
              <span className="text-pink-500 text-lg">™</span>
            </h2>

            <p
              className="
              mt-5
              leading-7
              text-slate-400
              "
            >
              Discover amazing local offers, discounts and trusted businesses
              around you with Smaze.
            </p>

            <div className="flex gap-4 mt-8">
              <a
                href="#"
                className="
                w-11
                h-11
                rounded-full
                bg-white/10
                hover:bg-purple-600
                flex
                items-center
                justify-center
                transition
                "
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="
                w-11
                h-11
                rounded-full
                bg-white/10
                hover:bg-pink-500
                flex
                items-center
                justify-center
                transition
                "
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="
                w-11
                h-11
                rounded-full
                bg-white/10
                hover:bg-sky-500
                flex
                items-center
                justify-center
                transition
                "
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="
                w-11
                h-11
                rounded-full
                bg-white/10
                hover:bg-blue-600
                flex
                items-center
                justify-center
                transition
                "
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Links */}

          <div>
            <h3
              className="
              text-xl
              font-bold
              text-white
              mb-6
              "
            >
              Quick Links
            </h3>

            <ul className="space-y-4">
              {["Home", "Offers", "Categories", "Shops", "About Us"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="
                      hover:text-pink-400
                      transition
                      "
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Categories */}

          <div>
            <h3
              className="
              text-xl
              font-bold
              text-white
              mb-6
              "
            >
              Categories
            </h3>

            <ul className="space-y-4">
              {[
                "Fashion",
                "Restaurants",
                "Electronics",
                "Medical",
                "Beauty & Salon",
              ].map((item) => (
                <li
                  key={item}
                  className="
                    hover:text-purple-400
                    cursor-pointer
                    transition
                    "
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3
              className="
              text-xl
              font-bold
              text-white
              mb-6
              "
            >
              Contact
            </h3>

            <div className="space-y-5">
              <div className="flex gap-4">
                <FaMapMarkerAlt
                  className="
                  text-pink-500
                  mt-1
                  "
                />

                <p>Belagavi, Karnataka, India</p>
              </div>

              <div className="flex gap-4">
                <FaPhoneAlt
                  className="
                  text-purple-500
                  mt-1
                  "
                />

                <p>+91 XXXXX XXXXX</p>
              </div>

              <div className="flex gap-4">
                <FaEnvelope
                  className="
                  text-pink-500
                  mt-1
                  "
                />

                <p>support@smaze.in</p>
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
          px-6
          py-6
          flex
          flex-col
          md:flex-row
          justify-between
          items-center
          gap-4
          "
        >
          <p className="text-sm text-slate-400">
            © 2026
            <span className="text-white font-semibold"> Smaze</span>. All rights
            reserved.
          </p>

          <div className="flex gap-8 text-sm">
            <a
              href="#"
              className="
              hover:text-pink-400
              transition
              "
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="
              hover:text-purple-400
              transition
              "
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
