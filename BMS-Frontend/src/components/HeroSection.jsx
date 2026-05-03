import React from 'react'
import { assets } from '../assets/assets'
import { Calendar as CalenderIcon, Clock as ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = ({ movie }) => {
  const navigate = useNavigate()

  // Use real movie data if available, fallback to defaults
  const title = movie?.name || 'Welcome to Auric'
  const genre = movie?.genre || 'Action | Adventure | Drama'
  const year = movie?.releaseDate ? new Date(movie.releaseDate).getFullYear() : '2025'
  const duration = movie?.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : ''
  const background = movie?.poster_path || assets.backgroundImage

  return (
    <div
      className='relative flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen text-white'
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url(${background})`
      }}
    >
      {/* Title */}
      <h1 className='text-5xl md:text-[70px] leading-[1.1] font-bold max-w-125 uppercase tracking-tight'>
        {title}
      </h1>

      {/* Info Row */}
      <div className='flex flex-wrap items-center gap-4 text-gray-300 font-medium'>
        <span>{genre}</span>

        <div className='flex items-center gap-2'>
          <CalenderIcon className='w-5 h-5 text-red-500' />
          <span>{year}</span>
        </div>

        {duration && (
          <div className='flex items-center gap-2'>
            <ClockIcon className='w-5 h-5 text-red-500' />
            <span>{duration}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className='flex items-center gap-4 mt-4'>
        {movie ? (
          <button
            onClick={() => navigate(`/Movies/${movie.id}`)}
            className='bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-all shadow-lg'
          >
            Book Tickets
          </button>
        ) : (
          <button
            onClick={() => navigate('/Movies')}
            className='bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-all shadow-lg'
          >
            Browse Movies
          </button>
        )}
        <button className='bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-md font-semibold transition-all border border-white/20'>
          Watch Trailer
        </button>
      </div>
    </div>
  )
}

export default HeroSection