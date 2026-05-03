import React from 'react'
import MovieCard from '../components/MovieCard'
import { Heart } from 'lucide-react'


const Favourite = ({ favMovies, toggleFavorite }) => {
  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 px-6 md:px-16 lg:px-36">
      <h1 className="text-3xl font-bold mb-10 flex items-center gap-3">
        <span className="w-2 h-8 bg-[#F84464] rounded-full"></span>
        My Wishlist
      </h1>

      
      {favMovies && favMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {favMovies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              toggleFavorite={toggleFavorite} 
              favMovies={favMovies} 
            />
          ))}
        </div>
      ) : (
        
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Heart className="w-16 h-16 mb-4 text-gray-600" />
          <p className="text-xl font-medium text-gray-500">Your wishlist is empty</p>
          <p className="text-sm text-gray-600 mt-2 text-center">Tap the heart icon on a movie to save it here.</p>
        </div>
      )}
    </div>
  )
}

export default Favourite