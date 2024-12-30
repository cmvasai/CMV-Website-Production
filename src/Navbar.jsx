import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
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
    { name: "Donate", path: "/donate" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  return (
    <>
      <div className="h-auto px-4 lg:px-16 flex justify-between items-center shadow-lg">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="pt-1">
            <Link to="/">
            <img
              src="src/assets/lamp.png"
              alt="img"
              className="h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto"
            />
            </Link>
          </div>
          <div>
            <Link to="/">
              <h1 className="sm:text-xl md:text-base lg:text-lg xl:text-xl text-[#BC3612] font-bold">CHINMAYA MISSION VASAI</h1>
            </Link>
            <Link to="/">
            <p className="text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base font-bold">
              To Give Maximum Happiness To Maximum People
            </p>
            <p className="text-xs sm:text-sm md:text-xs lg:text-sm xl:text-base font-bold">
              For Maximum Time
            </p>
            </Link>
          </div>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden">
          <button
            className="text-[#F47930] focus:outline-none"
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
                        ? "text-[#BC3612] underline underline-offset-4"
                        : "hover:text-[#BC3612]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isOpen && (
        <nav className="lg:hidden px-4 py-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 text-sm font-bold transition-all ${
                      isActive
                        ? "text-[#BC3612] underline underline-offset-4"
                        : "hover:text-[#BC3612]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};
