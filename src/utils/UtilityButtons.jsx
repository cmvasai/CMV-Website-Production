import { Link } from "react-router-dom";
import { GoPersonFill } from "react-icons/go";
import { LiaBookSolid } from "react-icons/lia";
import { BsPersonArmsUp } from "react-icons/bs";
import { MdContacts } from "react-icons/md";

const UtilityButtons = () => {
  const buttons = [
    {
      name: "Membership",
      icon: <GoPersonFill className="w-5 h-5 sm:w-14 sm:h-14 md:w-10 md:h-10" />,
      path: "/volunteer#volunteer-form",
      description: "Join our community",
      isExternal: false,
    },
    {
      name: "Books & Publications",
      icon: <LiaBookSolid className="w-5 h-5 sm:w-14 sm:h-14 md:w-10 md:h-10" />,
      path: "https://eshop.chinmayamission.com/",
      description: "Explore our literature",
      isExternal: true,
    },
    {
      name: "Our Pledge",
      icon: <BsPersonArmsUp className="w-5 h-5 sm:w-14 sm:h-14 md:w-10 md:h-10" />,
      path: "/pledge",
      description: "Our commitment",
      isExternal: false,
    },
    {
      name: "Contact Us",
      icon: <MdContacts className="w-5 h-5 sm:w-14 sm:h-14 md:w-10 md:h-10" />,
      path: "/contact-us",
      description: "Get in touch",
      isExternal: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-0.5 px-2 sm:py-4 md:py-1 sm:px-4 shadow-md dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)]">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-8 md:gap-12">
          {buttons.map((button, index) => (
            button.isExternal ? (
              <a
                href={button.path}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group transition-transform hover:scale-110 relative overflow-hidden"
              >
                <div className="w-9 h-9 sm:w-14 sm:h-14 md:w-10 md:h-10 rounded-full flex items-center justify-center 
                  bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-600 dark:to-gray-800 text-[#BC3612] dark:text-[#F47930] 
                  shadow-md group-hover:shadow-lg transition-all">
                  {button.icon}
                  <div className="absolute inset-0 bg-orange-500 dark:bg-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full ripple"></div>
                </div>
                <span className="mt-1 sm:mt-2 text-[10px] sm:text-base md:text-base text-center font-medium text-gray-900 dark:text-gray-100">
                  {button.name}
                </span>
                <span className="text-[10px] sm:text-sm md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  {button.description}
                </span>
              </a>
            ) : (
              <Link
                to={button.path}
                key={index}
                className="flex flex-col items-center group transition-transform hover:scale-110 relative overflow-hidden"
              >
                <div className="w-9 h-9 sm:w-14 sm:h-14 md:w-10 md:h-10 rounded-full flex items-center justify-center 
                  bg-gradient-to-r from-orange-100 to-orange-50 dark:from-gray-600 dark:to-gray-800 text-[#BC3612] dark:text-[#F47930] 
                  shadow-md group-hover:shadow-lg transition-all">
                  {button.icon}
                  <div className="absolute inset-0 bg-orange-500 dark:bg-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full ripple"></div>
                </div>
                <span className="mt-1 sm:mt-2 text-[10px] sm:text-base md:text-base text-center font-medium text-gray-900 dark:text-gray-100">
                  {button.name}
                </span>
                <span className="text-[10px] sm:text-sm md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
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
        `}
      </style>
    </div>
  );
};

export default UtilityButtons;