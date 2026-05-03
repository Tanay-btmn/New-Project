import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favourite from './pages/Favourite'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Payment from './pages/Payment'
import AdminDashboard from './pages/AdminDashboard'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  const [bookings, setBookings] = useState([])
  const [favMovies, setFavMovies] = useState([])

  const toggleFavorite = (movie) => {
    setFavMovies(prev =>
      prev.find(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie]
    )
  }

  return (
    <div className='bg-[#050505] min-h-screen flex flex-col'>
      <Toaster position="bottom-right" />
      {!isAdminRoute && <NavBar favCount={favMovies.length} />}
      <main className='grow'>
        <Routes>
          <Route path='/' element={<Home toggleFavorite={toggleFavorite} favMovies={favMovies} />} />
          <Route path='/Movies' element={<Movies toggleFavorite={toggleFavorite} favMovies={favMovies} />} />
          <Route path='/Movies/:id' element={<MovieDetails toggleFavorite={toggleFavorite} favMovies={favMovies} />} />
          <Route path='/Movies/:id/:showId' element={<SeatLayout setBookings={setBookings} />} />
          <Route path='/MyBookings' element={<MyBookings bookings={bookings} />} />
          <Route path='/Favourite' element={<Favourite favMovies={favMovies} toggleFavorite={toggleFavorite} />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/payment/:bookingId' element={<Payment />} />
          <Route path='/admin' element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App