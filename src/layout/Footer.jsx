import { FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useCallback } from 'react';
import { scrollToTop as utilScrollToTop } from '../utils/scrollUtils';

const Footer = () => {
  // Function to scroll to top with smooth behavior
  const scrollToTop = useCallback(() => {
    utilScrollToTop();
  }, []);

  return (
    <footer className="bg-[#ffe4d6] dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-8 sm:py-12 shadow-inner">
      <div className="container mx-auto px-4">
        {/* Top Section: Mission Statement */}
        <div className="text-center mb-8">
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Chinmaya Mission Vasai
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="text-sm sm:text-base italic text-[#BC3612] dark:text-[#F47930] font-medium">
              "Maximum happiness to maximum people for maximum time"
            </p>
          </div>
        </div>

        {/* Middle Section: Enhanced Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about-us" },
                { name: "Events", path: "/events" },
                { name: "Contact Us", path: "/contact-us" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-[#BC3612] dark:hover:text-[#F47930] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities & Programs - Shortened Version */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Programs
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Children's Programs", path: "/activities" },
                { name: "Youth Programs", path: "/activities" },
                { name: "Family Programs", path: "/activities" },
                { name: "Adult Programs", path: "/activities" },
                { name: "Spiritual Camps", path: "/activities" },
                { name: "Study Groups", path: "/activities" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-[#BC3612] dark:hover:text-[#F47930] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/activities"
                  onClick={scrollToTop}
                  className="text-sm sm:text-base text-[#BC3612] dark:text-[#F47930] hover:text-orange-500 dark:hover:text-orange-500 font-medium transition-colors"
                >
                  View All Activities →
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Our Pledge", path: "/pledge" },
                { name: "Archived Events", path: "/archived-events" },
                { name: "Gallery", path: "/events" },
                { name: "Register CGCC 2025", path: "/register/cgcc2025" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-[#BC3612] dark:hover:text-[#F47930] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-[#BC3612] dark:text-[#F47930] mt-1 flex-shrink-0" size={16} />
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Sai Tower, Ambadi Rd, Vasai West,<br />
                  Maharashtra 401202, India
                </p>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-[#BC3612] dark:text-[#F47930] flex-shrink-0" size={16} />
                <a href="mailto:vasai@chinmayamission.com" className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-[#BC3612] dark:hover:text-[#F47930] transition-colors">
                  info@chinmayamissionvasai.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <FaPhone className="text-[#BC3612] dark:text-[#F47930] flex-shrink-0" size={16} />
                <a href="tel:+917303717177" className="text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-[#BC3612] dark:hover:text-[#F47930] transition-colors">
                  +91 7303717177
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Social Media and Copyright */}
        <div className="text-center">
          {/* Social Media */}
          <div className="mb-4">
            <div className="flex justify-center space-x-4">
              {[
                { href: "https://www.facebook.com/share/18uKZokgN6/", Icon: FaFacebook },
                { href: "https://www.instagram.com/cm_vasai?igsh=MWwyMjdlcHJ3dWJvNw==", Icon: FaInstagram },
                { href: "https://www.youtube.com/@chinmayamissionvasai730", Icon: FaYoutube },
                { href: "https://x.com/Chinmaya_Vasai", Icon: FaXTwitter },
              ].map(({ href, Icon }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#BC3612] dark:text-[#F47930] hover:text-orange-500 dark:hover:text-orange-500 transform hover:scale-110 transition-all"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm">
            <p>© 2025 Chinmaya Mission Vasai. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
