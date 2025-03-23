import { useState, useEffect } from 'react'
import './App.css'
import { Navbar } from './Navbar'
import Footer from './Footer'
import ImageCarousel from './Carousel'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import About from './About'
import Activities from './Activities'
import Events from './Events'
import { UpcomingEvents } from './UpcomingEvents'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import EditCarousel from './EditCarousel'
import EditUpcomingEvents from './EditUpcomingEvents'
import EditFeaturedEvents from './EditFeaturedEvents'

const initialCarouselItems = [
  { title: "Bike Ride 2K24", description: "Chinmaya Mission Vasai Bike Ride to Trimbakeshwar Temple", image: "/images/bikeRide1.jpeg" },
  { title: "New Year", description: "Chinmaya Mission Vasai New Year Celebration", image: "/images/newYear1.jpeg" },
  { title: "Components", description: "Reusable components for your projects.", image: "/images/bikeRide2.jpeg" },
  { title: "Backgrounds", description: "Beautiful backgrounds and patterns for your projects.", image: "/images/trekImg.jpeg" },
  { title: "Common UI", description: "Common UI components are coming soon!", image: "/images/newYear2.jpeg" },
  { title: "Common UI", description: "Common UI components are coming soon!", image: "/images/bikeRide3.jpeg" },
];

const initialUpcomingEvents = [
  {
    id: 1,
    eventName: "Chinmaya Mission Vasai Bike Ride",
    image: "images/bikeRide25.jpeg",
    description: "Learning on Wheels - 6th Group Ride Series",
    schedule: "8-9th February, 2025",
    highlights: [
      "Bike Ride to Statue of Unity",
      "Discover the secret of: THE IRON MAN OF BHARAT",
      "Explore, Connect, Re-ignite",
    ],
    contact: "For detailed plan and registration, contact: +91 XXXXXXXXXX",
  },
];

const initialFeaturedEvents = [
  {
    id: 1,
    name: "Winter Camps",
    image: "/images/winter-camp.jpeg",
    description: "Our annual winter camps provide an immersive spiritual experience for youth. Through a blend of meditation, yoga, outdoor activities, and interactive Vedanta sessions, participants discover their inner potential while forming lasting friendships. ",
    schedule: "December (During Winter Break)",
    highlights: [
      "Spiritual discourses and interactive sessions",
      "Team building activities and games",
      "Yoga and meditation workshops",
      "Cultural performances and talent shows"
    ],
    contact: "For registration: camp.coordinator@chinmayavasai.org"
  },
  {
    id: 2,
    name: "Shivaratri Celebrations",
    image: "/images/shivaratri.jpeg",
    description: "Experience the divine night of Lord Shiva with continuous pujas, bhajans, and spiritual discourses. This night-long celebration includes special arrangements for devotees to participate in various sevas and spiritual activities.",
    schedule: "As per Hindu Calendar",
    highlights: [
      "Continuous Shiva Puja throughout the night",
      "Devotional music and bhajans",
      "Special spiritual discourses",
      "Prasad distribution"
    ],
    contact: "For more details: temple@chinmayavasai.org"
  },
  {
    id: 3,
    name: "Monsoon Trekking",
    image: "/images/trekking.jpeg",
    description: "Our spiritual treks combine the thrill of adventure with the wisdom of Vedanta. Experience the beauty of nature while engaging in meaningful discussions and meditation sessions amidst scenic locations.",
    schedule: "July - September (During Monsoon)",
    highlights: [
      "Guided treks with spiritual discussions",
      "Meditation in nature",
      "Team bonding activities",
      "Photography sessions"
    ],
    contact: "For trek details: youth.coordinator@chinmayavasai.org"
  },
  {
    id: 4,
    name: "New Year Celebrations",
    image: "/images/new-year.jpeg",
    description: "Start your new year with spiritual consciousness. Join us for a unique celebration that includes meditation, special pujas, cultural programs, and inspiring talks to begin the year with positive energy and spiritual resolve.",
    schedule: "December 31st - January 1st",
    highlights: [
      "Special New Year puja",
      "Meditation and chanting sessions",
      "Cultural performances",
      "Community dinner"
    ],
    contact: "For participation: events@chinmayavasai.org"
  }
];

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [carouselItems, setCarouselItems] = useState(() => {
    const savedItems = localStorage.getItem('carouselItems');
    return savedItems ? JSON.parse(savedItems) : initialCarouselItems;
  });
  const [upcomingEvents, setUpcomingEvents] = useState(() => {
    const savedEvents = localStorage.getItem('upcomingEvents');
    return savedEvents ? JSON.parse(savedEvents) : initialUpcomingEvents;
  });
  const [featuredEvents, setFeaturedEvents] = useState(() => {
    const savedEvents = localStorage.getItem('featuredEvents');
    return savedEvents ? JSON.parse(savedEvents) : initialFeaturedEvents;
  });

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
    localStorage.setItem('carouselItems', JSON.stringify(carouselItems));
  }, [carouselItems]);

  useEffect(() => {
    localStorage.setItem('upcomingEvents', JSON.stringify(upcomingEvents));
  }, [upcomingEvents]);

  useEffect(() => {
    localStorage.setItem('featuredEvents', JSON.stringify(featuredEvents));
  }, [featuredEvents]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Routes>
          <Route path='/' element={<><ImageCarousel carouselItems={carouselItems} /> <UpcomingEvents upcomingEvents={upcomingEvents} /></>} />
          <Route path='/about-us' element={<About />} />
          <Route path='/activities' element={<Activities />} />
          <Route path='/events' element={<Events featuredEvents={featuredEvents} />} />
          <Route path='/admin/login' element={<AdminLogin setAdminLoggedIn={setAdminLoggedIn} />} />
          <Route path='/admin/dashboard' element={adminLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
          <Route path='/admin/edit-carousel' element={adminLoggedIn ? <EditCarousel carouselItems={carouselItems} setCarouselItems={setCarouselItems} /> : <Navigate to="/admin/login" />} />
          <Route path='/admin/edit-upcoming-events' element={adminLoggedIn ? <EditUpcomingEvents upcomingEvents={upcomingEvents} setUpcomingEvents={setUpcomingEvents} /> : <Navigate to="/admin/login" />} />
          <Route path='/admin/edit-featured-events' element={adminLoggedIn ? <EditFeaturedEvents featuredEvents={featuredEvents} setFeaturedEvents={setFeaturedEvents} /> : <Navigate to="/admin/login" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App