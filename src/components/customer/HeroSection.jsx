// src/components/customer/HeroSection.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi2";

// Import your images
import hero1 from "../../assets/images/hero1.jpg";
import hero2 from "../../assets/images/hero2.jpg";
import hero3 from "../../assets/images/hero3.jpg";

const HeroSection = ({ customer }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Welcome Back, {name}!",
      subtitle: "Discover amazing deals curated just for you",
      cta: "Explore Offers",
      link: "/customer/offers",
      image: hero1,
      badge: "New Arrivals",
      badgeColor: "from-blue-500 to-purple-600",
    },
    {
      id: 2,
      title: "🔥 Trending Now",
      subtitle: "Hottest deals in your area",
      cta: "View Trending",
      link: "/customer/offers?trending=true",
      image: hero2,
      badge: "Trending",
      badgeColor: "from-orange-500 to-red-600",
    },
    {
      id: 3,
      title: "⚡ Flash Deals",
      subtitle: "Limited time offers ending soon",
      cta: "Grab Now",
      link: "/customer/offers?flash=true",
      image: hero3,
      badge: "Limited Time",
      badgeColor: "from-red-500 to-pink-600",
    },
  ];

  const totalSlides = slides.length;

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides, isHovered]);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  return (
    <div className="relative w-full">
      <section
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[380px] lg:h-[450px] xl:h-[500px] overflow-hidden rounded-xl sm:rounded-2xl shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex h-full items-center px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28">
                <div className="max-w-2xl lg:max-w-3xl w-full">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="mb-2 sm:mb-3"
                  >
                    <span
                      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${slides[currentSlide].badgeColor} px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-black/30`}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      {slides[currentSlide].badge}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                    className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight"
                  >
                    {slides[currentSlide].title.replace(
                      "{name}",
                      customer?.name || "Explorer",
                    )}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-white/90 drop-shadow-lg"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 sm:mt-5"
                  >
                    <Link
                      to={slides[currentSlide].link}
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl text-sm sm:text-base"
                    >
                      {slides[currentSlide].cta}
                      <HiOutlineArrowRight
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        size={20}
                      />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 sm:left-8 md:left-12 top-1/2 z-20 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200"
          aria-label="Previous slide"
        >
          <HiOutlineArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 sm:right-8 md:right-12 top-1/2 z-20 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200"
          aria-label="Next slide"
        >
          <HiOutlineArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 sm:w-10 h-2 bg-white rounded-full shadow-lg"
                  : "w-2 h-2 bg-white/40 rounded-full hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
