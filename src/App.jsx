import { useState, useEffect, memo, lazy, Suspense } from 'react';
import './styles/App.css';
import { Navbar } from './layout/Navbar';
import Footer from './layout/Footer';
import ImageCarousel from './modals/Carousel';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { UpcomingEvents } from './sections/UpcomingEvents';
import axios from 'axios';
import UtilityButtons from './utils/UtilityButtons';
import QuotesSection from './sections/QuotesSection';
import ScrollToTopButton from './components/ScrollToTopButton';
import { ToastContainer } from './components/Toast';
import { scrollToTop } from './utils/scrollUtils';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const About = lazy(() => import('./pages/public/About'));
const Activities = lazy(() => import('./pages/public/Activities'));
const Events = lazy(() => import('./pages/public/Events'));
const ContactUs = lazy(() => import('./pages/public/ContactUs'));
const Volunteer = lazy(() => import('./pages/public/Volunteer'));
const OurPledge = lazy(() => import('./pages/public/OurPledge'));
const ArchivedEvents = lazy(() => import('./pages/public/ArchivedEvents'));
const ArchivedEventDetails = lazy(() => import('./pages/public/ArchivedEventDetails'));

// Admin components - lazy loaded
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const EditCarousel = lazy(() => import('./pages/admin/EditCarousel'));
const EditUpcomingEvents = lazy(() => import('./pages/admin/EditUpcomingEvents'));
const EditFeaturedEvents = lazy(() => import('./pages/admin/EditFeaturedEvents'));
const AddArchivedEvent = lazy(() => import('./pages/admin/AddArchivedEvent'));
const ManageArchivedEvents = lazy(() => import('./pages/admin/ManageArchivedEvents'));
const ArchivedEventsDebug = lazy(() => import('./components/ArchivedEventsDebug'));

// Enhanced Skeleton Component with Full-Width Shimmering Bar Effect
const CarouselSkeleton = memo(function CarouselSkeleton() {
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
CarouselSkeleton.displayName = "CarouselSkeleton";

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

  const handleViewMoreEventsClick = () => {
    scrollToTop();
  };

  return (
    <HelmetProvider>
      <ErrorBoundary>
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
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          }>
            <Routes>
            <Route
              path="/"
              element={
                <div className="flex flex-col gap-0">
                  <QuotesSection />
                  <UpcomingEvents upcomingEvents={upcomingEvents} />
                  <UtilityButtons />
                  {/* "Our Events" Heading */}
                  <div className="bg-white dark:bg-gray-900 py-4 sm:py-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white text-center">
                      Our Events
                    </h2>
                  </div>
                  {loading ? <CarouselSkeleton /> : <ImageCarousel carouselItems={carouselItems} />}
                  {/* "View More Events" Link */}
                  <div className="bg-white dark:bg-gray-900 py-4 sm:py-6 flex justify-center">
                    <Link
                      to="/events#featured-events"
                      onClick={handleViewMoreEventsClick}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
                    >
                      View More Events
                    </Link>
                  </div>
                </div>
              }
            />
            <Route path="/about-us" element={<About />} />
            <Route path="/archived-events" element={<ArchivedEvents />} />
            <Route path="/archived-events/:id" element={<ArchivedEventDetails />} />
            <Route path="/archived-events-debug" element={<ArchivedEventsDebug />} />
            <Route path="/events/archived" element={<ArchivedEvents />} />
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
              path="/admin/archived-events"
              element={
                adminLoggedIn ? (
                  <ManageArchivedEvents />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
            />
            <Route
              path="/admin/archived-events/add"
              element={
                adminLoggedIn ? (
                  <AddArchivedEvent />
                ) : (
                  <Navigate to="/admin/login" />
                )
              }
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
          </Suspense>
          <Footer />
          <ScrollToTopButton />
          <ToastContainer />
        </BrowserRouter>
      </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;