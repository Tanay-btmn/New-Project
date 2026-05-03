import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import API from '../services/api'
import { isAdmin } from '../services/authService'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])

  const [movieForm, setMovieForm] = useState({
    name: '',
    description: '',
    genre: '',
    duration: '',
    releaseDate: '',
    language: ''
  })

  const [theaterForm, setTheaterForm] = useState({
    theaterName: '',
    theaterCapacity: '',
    location: '',
    screenType: ''
  })

  const [showForm, setShowForm] = useState({
    showTime: '',
    price: '',
    movieId: '',
    theaterId: ''
  })

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('Admin access required')
      navigate('/login')
      return
    }

    const loadMovies = async () => {
      try {
        const response = await API.get('/api/movies/getAllMovies')
        setMovies(response.data)
      } catch {
        toast.error('Failed to load movies')
      }
    }
    loadMovies()
  }, [navigate])

  const submitMovie = async (e) => {
    e.preventDefault()
    try {
      await API.post('/api/admin/movies', {
        ...movieForm,
        duration: Number(movieForm.duration)
      })
      toast.success('Movie added successfully')
      setMovieForm({
        name: '',
        description: '',
        genre: '',
        duration: '',
        releaseDate: '',
        language: ''
      })
      const response = await API.get('/api/movies/getAllMovies')
      setMovies(response.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add movie')
    }
  }

  const submitTheater = async (e) => {
    e.preventDefault()
    try {
      await API.post('/api/admin/theaters', {
        ...theaterForm,
        theaterCapacity: Number(theaterForm.theaterCapacity)
      })
      toast.success('Theater added successfully')
      setTheaterForm({
        theaterName: '',
        theaterCapacity: '',
        location: '',
        screenType: ''
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add theater')
    }
  }

  const submitShow = async (e) => {
    e.preventDefault()
    try {
      await API.post('/api/admin/shows', {
        showTime: showForm.showTime,
        price: Number(showForm.price),
        movieId: showForm.movieId,
        theaterId: showForm.theaterId
      })
      toast.success('Show added successfully')
      setShowForm({
        showTime: '',
        price: '',
        movieId: '',
        theaterId: ''
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add show')
    }
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white px-6 md:px-16 lg:px-36 py-10">
      <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form onSubmit={submitMovie} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold">Add Movie</h2>
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Name" value={movieForm.name} onChange={(e) => setMovieForm({ ...movieForm, name: e.target.value })} required />
          <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Description" value={movieForm.description} onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })} required />
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Genre" value={movieForm.genre} onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })} required />
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" type="number" placeholder="Duration (minutes)" value={movieForm.duration} onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })} required />
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" type="date" value={movieForm.releaseDate} onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })} required />
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Language" value={movieForm.language} onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })} required />
          <button type="submit" className="w-full py-2 rounded-lg bg-[#F84464] hover:bg-[#ff5272] font-semibold">Add Movie</button>
        </form>

        <form onSubmit={submitTheater} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold">Add Theater</h2>
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Theater name" value={theaterForm.theaterName} onChange={(e) => setTheaterForm({ ...theaterForm, theaterName: e.target.value })} required />
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" type="number" placeholder="Capacity" value={theaterForm.theaterCapacity} onChange={(e) => setTheaterForm({ ...theaterForm, theaterCapacity: e.target.value })} required />
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Location" value={theaterForm.location} onChange={(e) => setTheaterForm({ ...theaterForm, location: e.target.value })} required />
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Screen type (2D/3D/IMAX)" value={theaterForm.screenType} onChange={(e) => setTheaterForm({ ...theaterForm, screenType: e.target.value })} required />
          <button type="submit" className="w-full py-2 rounded-lg bg-[#F84464] hover:bg-[#ff5272] font-semibold">Add Theater</button>
        </form>

        <form onSubmit={submitShow} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold">Add Show</h2>
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" type="datetime-local" value={showForm.showTime} onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })} required />
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" type="number" placeholder="Price" value={showForm.price} onChange={(e) => setShowForm({ ...showForm, price: e.target.value })} required />
          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={showForm.movieId} onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })} required>
            <option value="">Select movie</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>{movie.id} - {movie.name}</option>
            ))}
          </select>
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" type="number" placeholder="Theater ID" value={showForm.theaterId} onChange={(e) => setShowForm({ ...showForm, theaterId: e.target.value })} required />
          <p className="text-xs text-gray-400">Use an existing theater ID from your database.</p>
          <button type="submit" className="w-full py-2 rounded-lg bg-[#F84464] hover:bg-[#ff5272] font-semibold">Add Show</button>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard
