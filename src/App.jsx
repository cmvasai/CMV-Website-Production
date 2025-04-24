import { useState, useEffect } from 'react';
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

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [carouselItems, setCarouselItems] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);

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
                <ImageCarousel carouselItems={carouselItems} />
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