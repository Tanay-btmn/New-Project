import React, { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection'
import MovieCard from '../components/MovieCard'
import API from '../services/api'

const Home = ({ toggleFavorite, favMovies }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [featuredMovie, setFeaturedMovie] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await API.get('/api/movies/getAllMovies')
        setMovies(response.data)
        // Use first movie as featured in hero section
        if (response.data.length > 0) {
          setFeaturedMovie(response.data[0])
        }
      } catch (err) {
        console.error('Failed to load movies:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      <HeroSection movie={featuredMovie} />

      <div className="px-6 md:px-16 lg:px-36 py-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-red-600 rounded-full"></span>
          Now Showing
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-xl">Loading movies...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {movies.map(movie => (
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
            <p className="text-gray-400 text-xl">No movies available right now.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home