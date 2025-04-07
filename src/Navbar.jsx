import { useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; // For mobile menu animation

export const Navbar = ({ toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu after clicking a link (auto-collapse)
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Memoize navItems to prevent re-creation on every render
  const navItems = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about-us" },
      { name: "Activities", path: "/activities" },
      { name: "Events", path: "/events" },
      { name: "Volunteer / Join Us", path: "/volunteer" },
      { name: "Contact Us", path: "/contact-us" },
    ],
    []
  );

  return (
    <>
      <div className="h-auto px-4 lg:px-16 flex justify-between items-center shadow-lg bg-white dark:bg-gray-800">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="pt-1">
            <Link to="/" aria-label="Chinmaya Mission Vasai Home">
              <img
                src={darkMode ? "/images/lamp1.png" : "/images/lamp.png"}
                alt="Chinmaya Mission Vasai Logo"
                className="h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto"
              />
            </Link>
          </div>
          <div>
            <Link to="/">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#BC3612] dark:text-[#F47930] font-bold">
                CHINMAYA MISSION VASAI
              </h1>
            </Link>
            <Link to="/">
              <p className="text-xs sm:text-sm md:text-base font-bold dark:text-white">
                To Give Maximum Happiness To Maximum People
              </p>
              <p className="text-xs sm:text-sm md:text-base font-bold dark:text-white">
                For Maximum Time
              </p>
            </Link>
          </div>
        </div>

        {/* Hamburger Icon and Dark Mode Toggle for Mobile */}
        <div className="lg:hidden flex flex-col items-center space-y-2">
          <button
            className="text-[#F47930] dark:text-[#F47930] focus:outline-none"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F47930]"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="hidden lg:flex flex-wrap items-center">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm md:text-base lg:text-lg font-bold transition-colors ${
                      isActive
                        ? "text-[#BC3612] dark:text-[#F47930] underline underline-offset-4"
                        : "text-gray-800 dark:text-white hover:text-[#BC3612] dark:hover:text-[#F47930]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dark Mode Toggle Button for Larger Screens */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F47930]"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Mobile with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="lg:hidden px-4 py-4 bg-white dark:bg-gray-800 shadow-md"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    onClick={handleLinkClick} // Auto-collapse on click
                    className={({ isActive }) =>
                      `block w-full text-left px-3 py-2 text-sm md:text-base font-bold transition-colors ${
                        isActive
                          ? "text-[#BC3612] dark:text-[#F47930] underline underline-offset-4"
                          : "text-gray-800 dark:text-white hover:text-[#BC3612] dark:hover:text-[#F47930]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};