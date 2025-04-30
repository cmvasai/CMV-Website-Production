import { useState, useEffect, memo } from 'react';
import './App.css';
import { Navbar } from './Navbar';
import Footer from './Footer';
import ImageCarousel from './Carousel';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import About from './About';
import Activities from './Activities';
import Events from './Events';
import { UpcomingEvents } from './UpcomingEvents';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import EditCarousel from './EditCarousel';
import EditUpcomingEvents from './EditUpcomingEvents';
import EditFeaturedEvents from './EditFeaturedEvents';
import ContactUs from './ContactUs';
import axios from 'axios';
import Volunteer from './Volunteer';
import UtilityButtons from './UtilityButtons';
import OurPledge from './OurPledge';

// Enhanced Skeleton Component with Full-Width Shimmering Bar Effect
const CarouselSkeleton = memo(() => {
  const isMobile = window.innerWidth < 768;

  return (
    <>
      <style>{`.animate-shimmer { /* Log to confirm CSS */ }`}</style>
      <div className="relative w-full bg-gray-200 dark:bg-gray-700">
        <div
          className="w-full bg-gray-300 dark:bg-gray-600 animate-shimmer relative"
          style={{
            height: isMobile ? '50vh' : '80vh',
            willChange: 'transform',
          }}
        ></div>
        <div className="absolute bottom-0 w-full bg-black bg-opacity-50 p-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 bg-gray-400 dark:bg-gray-500 rounded-full animate-shimmer-small relative"
              style={{ willChange: 'transform' }}
            ></div>
            <div
              className="h-6 w-1/3 bg-gray-400 dark:bg-gray-500 rounded animate-shimmer-small relative"
              style={{ willChange: 'transform' }}
            ></div>
          </div>
          <div
            className="mt-2 h-4 w-2/3 bg-gray-400 dark:bg-gray-500 rounded animate-shimmer-small relative"
            style={{ willChange: 'transform' }}
          ></div>
        </div>
      </div>
    </>
  );
});

// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative w-full bg-transparent">
      <img
        src="/images/newYear2.jpeg"
        alt="Chinmaya Mission Vasai spiritual gathering"
        className="w-full h-full max-h-[50vh] object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-3">
          Chinmaya Mission Vasai
        </h1>
        <p className="text-base sm:text-lg text-white text-center max-w-xl mb-6">
          Spiritual Events, Bala Vihar, and Community in Vasai
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 max-w-md w-full">
          <Link
            to="/events"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] text-center"
            aria-label="Explore our events"
          >
            Explore Events
          </Link>
          <Link
            to="/volunteer"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#BC3612] dark:bg-[#F47930] hover:bg-[#ff725e] dark:hover:bg-[#ff725e] text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] text-center"
            aria-label="Volunteer with us"
          >
            Volunteer
          </Link>
        </div>
      </div>
    </div>
  );
};

// Statistics Section Component
const StatisticsSection = () => {
  // Stats data
  const stats = [
    { name: "Balavihar", count: "35+", icon: "fas fa-child" },
    { name: "CHYK", count: "30+", icon: "fas fa-users" },
    { name: "Members", count: "145+", icon: "fas fa-user-friends" },
    { name: "Devi Group", count: "35+", icon: "fas fa-hands-praying" }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center bg-[#ffe4d6] dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <i className={`${stat.icon} text-[#BC3612] dark:text-[#F47930] text-xl md:text-2xl mb-2`}></i>
              <span className="text-2xl md:text-3xl font-bold text-[#BC3612] dark:text-[#F47930]">
                {stat.count}
              </span>
              <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">
                {stat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [carouselItems, setCarouselItems] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        const [carouselRes, upcomingRes, featuredRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/carousel-items`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/upcoming-events`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/featured-events`),
        ]);
        
        // Ensure we always set arrays
        setCarouselItems(Array.isArray(carouselRes.data) ? carouselRes.data : []);
        setUpcomingEvents(Array.isArray(upcomingRes.data) ? upcomingRes.data : []);
        setFeaturedEvents(Array.isArray(featuredRes.data) ? featuredRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error
        setCarouselItems([]);
        setUpcomingEvents([]);
        setFeaturedEvents([]);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minDisplayTime = 500; // Minimum 500ms for skeleton
        
        if (elapsedTime < minDisplayTime) {
          setTimeout(() => {
            setLoading(false);
          }, minDisplayTime - elapsedTime);
        } else {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <HelmetProvider>
      <div className={darkMode ? 'dark' : ''}>
        <Helmet>
          <title>Chinmaya Mission Vasai | Spiritual Events & Community</title>
          <meta name="description" content="Chinmaya Mission Vasai offers spiritual events, Bala Vihar youth programs, and community activities in Vasai, Mumbai. Join us for Vedantic wisdom and cultural programs." />
          <meta name="keywords" content="Chinmaya Mission Vasai, Vasai spirituality, Vedanta, Bala Vihar, spiritual events Mumbai" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://chinmayamissionvasai.com" />
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Chinmaya Mission Vasai",
                "url": "https://chinmayamissionvasai.com",
                "logo": "https://chinmayamissionvasai.com/images/lamp.png",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Sai Tower, Ambadi Rd",
                  "addressLocality": "Vasai West",
                  "addressRegion": "Maharashtra",
                  "postalCode": "401202",
                  "addressCountry": "IN"
                },
                "email": "vasai@chinmayamission.com",
                "sameAs": [
                  "https://www.facebook.com/share/18uKZokgN6/",
                  "https://www.instagram.com/cm_vasai?igsh=MWwyMjdlcHJ3dWJvNw==",
                  "https://www.youtube.com/@chinmayamissionvasai730",
                  "https://x.com/Chinmaya_Vasai"
                ]
              }
            `}
          </script>
        </Helmet>
        <BrowserRouter>
          <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex flex-col gap-0">
                  <HeroSection />
                  <StatisticsSection />
                  {loading ? <CarouselSkeleton /> : <ImageCarousel carouselItems={carouselItems} />}
                  <UtilityButtons />
                  <UpcomingEvents upcomingEvents={upcomingEvents} />
                </div>
              }
            />
            <Route path="/about-us" element={<About />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/events" element={<Events featuredEvents={featuredEvents} />} />
            <Route path="/admin/login" element={<AdminLogin setAdminLoggedIn={setAdminLoggedIn} />} />
            <Route
              path="/admin/dashboard"
              element={adminLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/login" />}
            />
            <Route
              path="/admin/edit-carousel"
              element={
                adminLoggedIn ? (
                  <EditCarousel
                    carouselItems={Array.isArray(carouselItems) ? carouselItems : []}
                    setCarouselItems={setCarouselItems}
                  />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="/admin/edit-upcoming-events"
              element={
                adminLoggedIn ? (
                  <EditUpcomingEvents
                    upcomingEvents={Array.isArray(upcomingEvents) ? upcomingEvents : []}
                    setUpcomingEvents={setUpcomingEvents}
                  />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="/admin/edit-featured-events"
              element={
                adminLoggedIn ? (
                  <EditFeaturedEvents
                    featuredEvents={Array.isArray(featuredEvents) ? featuredEvents : []}
                    setFeaturedEvents={setFeaturedEvents}
                  />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route path="/pledge" element={<OurPledge />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;