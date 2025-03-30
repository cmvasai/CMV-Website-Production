import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

export const Navbar = ({ toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Activities", path: "/activities" },
    { name: "Events", path: "/events" },
    { name: "Volunteer / Join Us", path: "/volunteer" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  return (
    <>
      <div className="h-auto px-4 lg:px-16 flex justify-between items-center shadow-lg bg-white dark:bg-gray-800">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="pt-1">
            <Link to="/">
              <img
                src={darkMode ? "/images/lamp1.png" : "/images/lamp.png"}
                alt="img"
                className="h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto"
              />
            </Link>
          </div>
          <div>
            <Link to="/">
              <h1 className="sm:text-xl md:text-base lg:text-lg xl:text-xl text-[#BC3612] dark:text-[#F47930] font-bold">CHINMAYA MISSION VASAI</h1>
            </Link>
            <Link to="/">
              <p className="text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base font-bold dark:text-[#FFFFFF]">
                To Give Maximum Happiness To Maximum People
              </p>
              <p className="text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base font-bold dark:text-[#FFFFFF]">
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
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="hidden lg:flex flex-wrap items-center">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {navItems.map((item, index) => (
              <li key={index} className="mb-2 lg:mb-0">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-xs sm:text-xs md:text-xs lg:text-sm xl:text-lg font-bold transition-all ${
                      isActive
                        ? "text-[#BC3612] dark:text-[#F47930] underline underline-offset-4"
                        : "hover:text-[#BC3612] dark:hover:text-[#F47930] dark:text-[#FFFFFF]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dark Mode Toggle Button and Login Button for Larger Screens */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
          {/* <Link to="/admin/login" className="text-[#BC3612] dark:text-[#F47930] font-bold">
            Admin Login
          </Link> */}
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isOpen && (
        <nav className="lg:hidden px-4 py-4 bg-white dark:bg-gray-800">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 text-sm font-bold transition-all ${
                      isActive
                        ? "text-[#BC3612] dark:text-[#F47930] underline underline-offset-4"
                        : "hover:text-[#BC3612] dark:hover:text-[#F47930] dark:text-[#FFFFFF]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            {/* <li>
              <Link to="/admin/login" className="block w-full text-left px-3 py-2 text-sm font-bold transition-all text-[#BC3612] dark:text-[#F47930] hover:text-[#BC3612] dark:hover:text-[#F47930]">
                Admin Login
              </Link>
            </li> */}
          </ul>
        </nav>
      )}
    </>
  );
};