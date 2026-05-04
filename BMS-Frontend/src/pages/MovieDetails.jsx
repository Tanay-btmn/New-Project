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

  const isFavorite = favMovies.some(m => m.id === id)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const response = await API.get(`/api/movies/${id}`)
        setMovie(response.data)

        // Fetch shows for this movie
        const showsResponse = await API.get(`/api/shows/movie/${id}`)
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
            {movie.trailerUrl && (
              <a 
                href={movie.trailerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all border border-white/20"
              >
                <Play className="w-5 h-5 fill-current" /> Watch Trailer
              </a>
            )}

            <button 
              onClick={() => navigate(`/Movies/${id}/shows`)}
              className="bg-[#F84464] hover:bg-[#ff5272] px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <Ticket className="w-5 h-5" /> Book Tickets
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

          {/* Cast & Crew Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 mb-20">
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-3 text-gray-200 uppercase tracking-widest text-xs">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, index) => (
                    <span key={index} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm text-gray-400">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {movie.crew && movie.crew.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-3 text-gray-200 uppercase tracking-widest text-xs">Crew</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.crew.map((member, index) => (
                    <span key={index} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm text-gray-400">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
ls