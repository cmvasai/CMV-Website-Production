import { Link } from "react-router-dom";
import { GoPersonFill } from "react-icons/go";
import { LiaBookSolid } from "react-icons/lia";
import { BsPersonArmsUp } from "react-icons/bs";
import { MdContacts } from "react-icons/md";

const UtilityButtons = () => {
  const buttons = [
    {
      name: "Membership",
      icon: <GoPersonFill size={24} />,
      path: "/volunteer#volunteer-form", // Added anchor to the volunteer form
      description: "Join our community",
      isExternal: false,
    },
    {
      name: "Books & Publications",
      icon: <LiaBookSolid size={24} />,
      path: "https://eshop.chinmayamission.com/", // External URL
      description: "Explore our literature",
      isExternal: true,
    },
    {
      name: "Our Pledge",
      icon: <BsPersonArmsUp size={24} />,
      path: "/pledge",
      description: "Our commitment",
      isExternal: false,
    },
    {
      name: "Contact Us",
      icon: <MdContacts size={24} />,
      path: "/contact-us",
      description: "Get in touch",
      isExternal: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-4 px-4 shadow-md dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)]">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {buttons.map((button, index) => (
            button.isExternal ? (
              // External link for Books & Publications
              <a
                href={button.path}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group transition-transform hover:scale-110"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center 
                  bg-[#ffe4d6] dark:bg-gray-800 text-[#BC3612] dark:text-[#F47930] 
                  shadow-md group-hover:shadow-lg transition-all">
                  {button.icon}
                </div>
                <span className="mt-2 text-xs sm:text-sm text-center font-medium text-gray-900 dark:text-gray-100">
                  {button.name}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                  {button.description}
                </span>
              </a>
            ) : (
              // Regular Link component for internal navigation
              <Link
                to={button.path}
                key={index}
                className="flex flex-col items-center group transition-transform hover:scale-110"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center 
                  bg-[#ffe4d6] dark:bg-gray-800 text-[#BC3612] dark:text-[#F47930] 
                  shadow-md group-hover:shadow-lg transition-all">
                  {button.icon}
                </div>
                <span className="mt-2 text-xs sm:text-sm text-center font-medium text-gray-900 dark:text-gray-100">
                  {button.name}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                  {button.description}
                </span>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default UtilityButtons;