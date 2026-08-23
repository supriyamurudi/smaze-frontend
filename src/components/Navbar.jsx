import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import smazeLogo from "../assets/icons/smazeLogo.jpeg";

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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Navbar */}
      <header
        className={`
          fixed
          top-0
          left-0
          right-0
          z-50
          w-full
          max-w-full
          overflow-hidden
          transition-all
          duration-500
          ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
              : "bg-white/90 backdrop-blur-md"
          }
        `}
      >
        {/* IMPORTANT: grid prevents hamburger from being pushed */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div
            className="
              h-16
              sm:h-20
              w-full
              grid
              grid-cols-[minmax(0,1fr)_auto]
              lg:flex
              lg:items-center
              lg:justify-between
            "
          >
            {/* Logo */}
            <Link
              to="/"
              className="
                flex
                items-center
                gap-2
                sm:gap-3
                min-w-0
                overflow-hidden
                lg:flex-none
              "
            >
              <div
                className="
                  w-10
                  h-10
                  sm:w-12
                  sm:h-12
                  flex-shrink-0
                  rounded-xl
                  sm:rounded-2xl
                  overflow-hidden
                  bg-gradient-to-br
                  from-purple-600
                  via-fuchsia-500
                  to-pink-500
                  shadow-lg
                "
              >
                <img
                  src={smazeLogo}
                  alt="Smaze"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-black tracking-tight whitespace-nowrap">
                  <span className="text-purple-600">S</span>
                  <span className="text-gray-900">maze</span>
                </h1>

                <p className="hidden sm:block text-[10px] sm:text-[11px] text-gray-500 -mt-1 tracking-widest uppercase whitespace-nowrap">
                  Local Discovery
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={({ isActive }) =>
                    `
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
                  `
                  }
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

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <FaMapMarkerAlt className="text-pink-500 text-sm" />

                <span className="text-sm font-medium text-gray-700">
                  Belagavi
                </span>
              </div>

              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl border border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-all duration-300 text-sm"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-200 hover:scale-105 transition-all duration-300 text-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenu(true)}
              className="
              lg:hidden
              w-11
              h-11
              flex
              items-center
              justify-center
              flex-shrink-0
              rounded-xl
              hover:bg-gray-100
              active:bg-gray-200
              transition-all
              ml-2  // Reduce this or use -mr-1
            "
              aria-label="Open menu"
            >
              <HiBars3 size={30} className="text-gray-900" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <aside
        className={`
          fixed
          top-0
          right-0
          z-50
          h-dvh
          w-[85vw]
          max-w-[320px]
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out
          lg:hidden
          ${mobileMenu ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer Header */}
        <div className="h-16 sm:h-20 px-5 flex items-center justify-between border-b">
          <Link
            to="/"
            onClick={() => setMobileMenu(false)}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500">
              <img
                src={smazeLogo}
                alt="Smaze"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-xl font-black">
                <span className="text-purple-600">S</span>
                <span className="text-gray-900">maze</span>
              </h2>

              <p className="text-[10px] text-gray-500">Local Discovery</p>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenu(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-pink-500 hover:text-white transition"
            aria-label="Close menu"
          >
            <HiXMark size={27} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="h-[calc(100dvh-64px)] sm:h-[calc(100dvh-80px)] overflow-y-auto px-5 py-6 flex flex-col gap-2">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={({ isActive }) =>
                `
                rounded-xl
                px-5
                py-4
                font-semibold
                transition-all
                ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                }
              `
              }
            >
              {item.title}
            </NavLink>
          ))}

          <div className="border-t my-4" />

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100">
            <FaMapMarkerAlt className="text-pink-500" />
            <span className="font-medium">Belagavi</span>
          </div>

          <Link
            to="/login"
            onClick={() => setMobileMenu(false)}
            className="text-center rounded-xl border border-purple-600 text-purple-600 py-3.5 font-semibold hover:bg-purple-50 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={() => setMobileMenu(false)}
            className="text-center rounded-xl py-3.5 text-white font-semibold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
