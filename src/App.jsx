import { useState, useEffect, memo } from 'react';
import './App.css';
import { Navbar } from './Navbar';
import Footer from './Footer';
import ImageCarousel from './Carousel';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
        setCarouselItems(carouselRes.data || []);
        setUpcomingEvents(upcomingRes.data || []);
        setFeaturedEvents(featuredRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    <div className={darkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {loading ? <CarouselSkeleton /> : <ImageCarousel carouselItems={carouselItems} />}
                <UpcomingEvents upcomingEvents={upcomingEvents} />
              </>
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
                <EditCarousel carouselItems={carouselItems} setCarouselItems={setCarouselItems} />
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
                  upcomingEvents={upcomingEvents}
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
                  featuredEvents={featuredEvents}
                  setFeaturedEvents={setFeaturedEvents}
                />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;