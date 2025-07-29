import { Link } from "react-router-dom";
import { GoPersonFill } from "react-icons/go";
import { LiaBookSolid } from "react-icons/lia";
import { BsPersonArmsUp } from "react-icons/bs";
import { MdContacts } from "react-icons/md";
import { FaHeart } from "react-icons/fa";

const UtilityButtons = () => {
  const buttons = [
    {
      name: "Donate",
      icon: <FaHeart className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "/donate",
      description: "Support our mission",
      isExternal: false,
    },
    {
      name: "Join Us",
      icon: <GoPersonFill className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "/volunteer#volunteer-form",
      description: "Join our community",
      isExternal: false,
    },
    {
      name: "Books Store",
      icon: <LiaBookSolid className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "https://eshop.chinmayamission.com/",
      description: "Explore our literature",
      isExternal: true,
    },
    {
      name: "Our Pledge",
      icon: <BsPersonArmsUp className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "/pledge",
      description: "Our commitment",
      isExternal: false,
    },
    {
      name: "Contact Us",
      icon: <MdContacts className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
      path: "/contact-us",
      description: "Get in touch",
      isExternal: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-3 px-4 sm:py-6 md:py-4 lg:py-6 shadow-md dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)]">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-nowrap sm:flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 overflow-x-auto sm:overflow-visible px-2 sm:px-0 scrollbar-hide sm:scrollbar-default">
          {buttons.map((button, index) => (
            button.isExternal ? (
              <a
                href={button.path}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group transition-transform hover:scale-110 relative overflow-hidden min-w-[90px] sm:min-w-0 px-2 sm:px-0"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full flex items-center justify-center 
                  bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-600 dark:to-gray-800 text-[#BC3612] dark:text-[#F47930] 
                  shadow-md transition-all duration-300">
                  {button.icon}
                </div>
                <span className="mt-2 text-xs sm:text-sm md:text-base lg:text-base text-center font-medium text-gray-900 dark:text-gray-100 max-w-[80px] sm:max-w-none">
                  {button.name}
                </span>
                <span className="text-xs sm:text-xs md:text-sm lg:text-sm text-gray-600 dark:text-gray-400 hidden md:block text-center">
                  {button.description}
                </span>
              </a>
            ) : (
              <Link
                to={button.path}
                key={index}
                className="flex flex-col items-center group transition-transform hover:scale-110 relative overflow-hidden min-w-[90px] sm:min-w-0 px-2 sm:px-0"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full flex items-center justify-center 
                  bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-600 dark:to-gray-800 text-[#BC3612] dark:text-[#F47930] 
                  shadow-md transition-all duration-300">
                  {button.icon}
                </div>
                <span className="mt-2 text-xs sm:text-sm md:text-base lg:text-base text-center font-medium text-gray-900 dark:text-gray-100 max-w-[80px] sm:max-w-none">
                  {button.name}
                </span>
                <span className="text-xs sm:text-xs md:text-sm lg:text-sm text-gray-600 dark:text-gray-400 hidden md:block text-center">
                  {button.description}
                </span>
              </Link>
            )
          ))}
        </div>
      </div>
      <style>
        {`
          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 0.3;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }
          .ripple {
            animation: ripple 600ms ease-out;
          }
          /* Hide scrollbar for horizontal scroll area only on small screens */
          @media (max-width: 639px) {
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default UtilityButtons;