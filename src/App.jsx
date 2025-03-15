import { useState, useEffect } from 'react'
import './App.css'
import { Navbar } from './Navbar'
import Footer from './Footer'
import ImageCarousel from './Carousel'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from './About'
import Activities from './Activities'
import Events from './Events'
import { UpcomingEvents } from './UpcomingEvents'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Routes>
          <Route path='/' element={<><ImageCarousel /> <UpcomingEvents /></>} />
          <Route path='/about-us' element={<About />} />
          <Route path='/activities' element={<Activities />} />
          <Route path='/events' element={<Events />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
