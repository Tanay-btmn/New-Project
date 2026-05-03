import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import API from '../services/api'

const Movies = ({ toggleFavorite, favMovies = [] }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState('All Genres')
  const [genres, setGenres] = useState(['All Genres'])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await API.get('/api/movies/getAllMovies')
        setMovies(response.data)

        // Extract unique genres from movies
        const uniqueGenres = ['All Genres', ...new Set(response.data.map(m => m.genre).filter(Boolean))]
        setGenres(uniqueGenres)
      } catch (err) {
        setError('Failed to load movies')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const filteredMovies = selectedGenre === 'All Genres'
    ? movies
    : movies.filter(m => m.genre === selectedGenre)

  if (loading) return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 flex items-center justify-center">
      <div className="text-xl text-gray-400">Loading movies...</div>
    </div>
  )

  if (error) return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 flex items-center justify-center">
      <div className="text-xl text-red-400">{error}</div>
    </div>
  )

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 px-6 md:px-16 lg:px-36">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span className="w-2 h-8 bg-red-600 rounded-full"></span>
          All Movies
        </h1>

        <div className="flex gap-4">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-red-600"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 pb-20">
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              toggleFavorite={toggleFavorite}
              favMovies={favMovies}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-lg">No movies found.</p>
        </div>
      )}
    </div>
  )
}

export default Movies