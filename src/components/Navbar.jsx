import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import smazeIcon from "../assets/icons/smaze-icon.jpeg";

import { HiBars3, HiXMark } from "react-icons/hi2";
import { FaMapMarkerAlt } from "react-icons/fa";

import { NAV_LINKS } from "../utils/constants";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      {mobileMenu && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Navbar */}
      <header
        className={`
          fixed
          top-0
          left-0
          w-full
          z-50
          transition-all
          duration-500
          ${
            scrolled
              ? `
                bg-white/90
                backdrop-blur-xl
                shadow-lg
                border-b
                border-gray-100
              `
              : "bg-transparent"
          }
        `}
      >
        <div
          className="
            w-full
            max-w-7xl
            mx-auto
            px-3
            sm:px-6
            lg:px-10
          "
        >
          <div
            className="
              h-16
              sm:h-20
              w-full
              flex
              items-center
              justify-between
              gap-2
              min-w-0
            "
          >
            {/* Logo - Left */}
            <Link
              to="/"
              className="
                flex
                items-center
                gap-2
                sm:gap-3
                group
                min-w-0
                flex-1
                overflow-hidden
              "
            >
              {/* Logo Icon */}
              <div
                className="
                  h-10
                  w-10
                  sm:h-12
                  sm:w-12
                  flex-shrink-0
                  rounded-xl
                  sm:rounded-2xl
                  bg-gradient-to-br
                  from-purple-600
                  via-fuchsia-500
                  to-pink-500
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  shadow-purple-200
                  group-hover:rotate-12
                  transition-all
                  duration-500
                  overflow-hidden
                "
              >
                <img
                  src={smazeIcon}
                  alt="Smaze"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Logo Text */}
              <div className="min-w-0">
                <h1
                  className="
                    text-xl
                    sm:text-3xl
                    font-black
                    tracking-tight
                    whitespace-nowrap
                  "
                >
                  <span className="text-purple-600">S</span>
                  <span className="text-gray-900">maze</span>
                  <span className="text-pink-500 text-xs sm:text-sm align-top">
                    ™
                  </span>
                </h1>

                <p
                  className="
                    hidden
                    sm:block
                    text-[11px]
                    text-gray-500
                    -mt-1
                    tracking-widest
                    uppercase
                    whitespace-nowrap
                  "
                >
                  Local Discovery
                </p>
              </div>
            </Link>

            {/* Desktop Links - Center */}
            <nav
              className="
                hidden
                lg:flex
                items-center
                gap-8
                xl:gap-10
              "
            >
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={({ isActive }) => `
                    group
                    relative
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-purple-600"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {item.title}

                      <span
                        className={`
                          absolute
                          left-0
                          -bottom-2
                          h-[3px]
                          rounded-full
                          bg-gradient-to-r
                          from-purple-600
                          to-pink-500
                          transition-all
                          duration-300
                          ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                        `}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Section - Desktop */}
            <div
              className="
                hidden
                lg:flex
                items-center
                gap-3
                xl:gap-4
                flex-shrink-0
              "
            >
              {/* Location */}
              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-2xl
                  bg-white
                  border
                  border-gray-200
                  shadow-sm
                "
              >
                <FaMapMarkerAlt className="text-pink-500 text-sm" />

                <span className="text-sm font-medium text-gray-700">
                  Belagavi
                </span>
              </div>

              {/* Login */}
              <Link
                to="/login"
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  border
                  border-purple-600
                  text-purple-600
                  font-semibold
                  hover:bg-purple-50
                  transition-all
                  duration-300
                  text-sm
                "
              >
                Login
              </Link>

              {/* Get Started */}
              <Link
                to="/signup"
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-600
                  via-fuchsia-500
                  to-pink-500
                  text-white
                  font-semibold
                  shadow-lg
                  shadow-purple-200
                  hover:scale-105
                  transition-all
                  duration-300
                  text-sm
                "
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(true)}
              className="
                lg:hidden
                flex-shrink-0
                flex
                items-center
                justify-center
                w-10
                h-10
                sm:w-12
                sm:h-12
                rounded-xl
                hover:bg-gray-100
                active:bg-gray-200
                transition-all
                duration-200
                active:scale-95
              "
              aria-label="Open menu"
            >
              <HiBars3 size={28} className="text-gray-800" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`
          fixed
          top-0
          right-0
          h-full
          w-[85vw]
          max-w-[320px]
          bg-white
          z-50
          shadow-2xl
          transition-transform
          duration-500
          ease-in-out
          lg:hidden
          ${mobileMenu ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer Header */}
        <div
          className="
            flex
            items-center
            justify-between
            px-5
            sm:px-6
            h-16
            sm:h-20
            border-b
          "
        >
          <Link
            to="/"
            onClick={() => setMobileMenu(false)}
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                h-10
                w-10
                sm:h-11
                sm:w-11
                rounded-xl
                bg-gradient-to-br
                from-purple-600
                via-fuchsia-500
                to-pink-500
                flex
                items-center
                justify-center
                overflow-hidden
              "
            >
              <img
                src={smazeIcon}
                alt="Smaze"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                <span className="text-purple-600">S</span>
                <span className="text-gray-900">maze</span>
                <span className="text-pink-500 text-sm">™</span>
              </h2>

              <p className="text-xs text-gray-500">Local Discovery</p>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenu(false)}
            className="
              flex-shrink-0
              rounded-xl
              bg-gray-100
              p-2
              hover:bg-pink-500
              hover:text-white
              transition
            "
            aria-label="Close menu"
          >
            <HiXMark size={26} />
          </button>
        </div>

        {/* Mobile Links */}
        <div
          className="
            flex
            flex-col
            px-5
            sm:px-6
            py-6
            gap-2
            overflow-y-auto
          "
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={({ isActive }) => `
                rounded-xl
                px-5
                py-4
                font-semibold
                transition-all
                ${
                  isActive
                    ? `
                      bg-gradient-to-r
                      from-purple-600
                      via-fuchsia-500
                      to-pink-500
                      text-white
                    `
                    : `
                      text-gray-700
                      hover:bg-purple-50
                      hover:text-purple-600
                    `
                }
              `}
            >
              {item.title}
            </NavLink>
          ))}

          <div className="border-t my-4" />

          {/* Mobile Location */}
          <div
            className="
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              bg-gray-100
            "
          >
            <FaMapMarkerAlt className="text-pink-500" />
            <span className="font-medium">Belagavi</span>
          </div>

          {/* Login */}
          <Link
            to="/login"
            onClick={() => setMobileMenu(false)}
            className="
              text-center
              rounded-xl
              border
              border-purple-600
              text-purple-600
              py-3.5
              font-semibold
              hover:bg-purple-50
              transition
            "
          >
            Login
          </Link>

          {/* Get Started */}
          <Link
            to="/signup"
            onClick={() => setMobileMenu(false)}
            className="
              text-center
              rounded-xl
              py-3.5
              text-white
              font-semibold
              bg-gradient-to-r
              from-purple-600
              via-fuchsia-500
              to-pink-500
              shadow-lg
              hover:shadow-xl
              transition
            "
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
