import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#ffe4d6] dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Social Media */}
          <div className="mb-3">
            <div className="flex justify-center space-x-4">
              <a href="https://www.facebook.com/ChinmayaVasai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-black dark:text-white hover:text-[#ff725e] dark:hover:text-[#ff725e]">
                <FaFacebook size={24} />
              </a>
              <a href="https://www.instagram.com/chinmayamissionvasai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-black dark:text-white hover:text-[#ff725e] dark:hover:text-[#ff725e]">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.youtube.com/@chinmayamissionvasai730" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-black dark:text-white hover:text-[#ff725e] dark:hover:text-[#ff725e]">
                <FaYoutube size={24} />
              </a>
              <a href="https://twitter.com/ChinmayaVasai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-black dark:text-white hover:text-[#ff725e] dark:hover:text-[#ff725e]">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm">
            <p>© 2025 Chinmaya Mission Vasai. All Rights Reserved.</p>
            <p className="text-xs mt-1">Hari Om!</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;