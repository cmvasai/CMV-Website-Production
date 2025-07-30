import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Temporarily disable smooth scrolling for instant scroll
    document.documentElement.classList.add('scroll-instant');
    
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Re-enable smooth scrolling after a short delay
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('scroll-instant');
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;
