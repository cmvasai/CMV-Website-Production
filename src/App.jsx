import { useState } from 'react'
import './App.css'
import { Navbar } from './Navbar'
import Footer from './Footer'
import ImageCarousel from './Carousel'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import About from './About'
import Activities from './Activities'
import Events from './Events'

function App() {
  

  return (
    <BrowserRouter>
    <Navbar/><br/>
    <Routes>
      <Route path='/' element={<ImageCarousel/>} />
      <Route path='/about-us' element={<About/>} />
      <Route path='/activities' element={<Activities/>} />
      <Route path='/events' element={<Events/>} />

    </Routes>
    <Footer/>

    </BrowserRouter>
  )
}

export default App
