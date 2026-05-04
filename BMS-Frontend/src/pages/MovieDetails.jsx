import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Calendar, Clock, Heart } from 'lucide-react'
import API from '../services/api'

const MovieDetails = ({ toggleFavorite, favMovies = [] }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isFavorite = favMovies.some(m => m.id === parseInt(id))

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const response = await API.get(`/api/movies/${id}`)
        setMovie(response.data)

        // Fetch shows for this movie
        const showsResponse = await API.get(`/api/show/getshowsbymovie/${id}`)
        setShows(showsResponse.data)
      } catch (err) {
        setError('Movie not found')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [id])

  const handleBooking = (showId) => {
    navigate(`/Movies/${id}/${showId}`)
  }

  if (loading) return (
    <div className="bg-[#050505] min-h-screen text-white pt-20 flex items-center justify-center">
      <div className="text-xl text-gray-400">Loading...</div>
    </div>
  )

  if (error || !movie) return (
    <div className="bg-[#050505] min-h-screen text-white pt-20 flex items-center justify-center">
      <div className="text-xl text-red-400">{error || 'Movie not found'}</div>
    </div>
  )

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-20">
      <div className="px-6 md:px-16 lg:px-36 flex flex-col md:flex-row gap-10">

        {/* Poster */}
        <div className="w-full md:w-1/3">
          <img
            src={movie.posterUrl || '/placeholder.jpg'}
            alt={movie.name}
            className="rounded-2xl shadow-2xl border border-white/10 w-full object-cover aspect-[2/3]"
          />
        </div>

        {/* Details */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">{movie.name}</h1>

          <div className="flex items-center gap-6 text-gray-400 font-medium">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F84464]" /> {movie.releaseDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F84464]" /> {movie.duration} mins
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs border border-white/10 uppercase">
              {movie.language}
            </span>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">{movie.description}</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all border border-white/20">
              <Play className="w-5 h-5 fill-current" /> Watch Trailer
            </button>

            <button
              onClick={() => toggleFavorite(movie)}
              className={`p-3 rounded-full border transition-all group
                ${isFavorite
                  ? 'bg-[#F84464] border-[#F84464]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-white text-white' : 'group-hover:text-red-500'}`} />
            </button>
          </div>

          {/* Shows Section */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#F84464] rounded-full"></span>
              Available Shows
            </h2>
            {shows.length > 0 ? (
              <div className="flex flex-col gap-3">
                {shows.map((show) => (
                  <div
                    key={show.id}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-6 py-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-semibold">
                        {new Date(show.showTime).toLocaleDateString()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(show.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-gray-400 text-sm">{show.theater?.theaterName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[#F84464] font-bold text-lg">₹{show.price}</span>
                      <button
                        onClick={() => handleBooking(show.id)}
                        className="bg-[#F84464] hover:bg-[#ff5272] px-6 py-2 rounded-full font-bold transition-all shadow-lg"
                      >
                        Book Tickets
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No shows available for this movie.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails