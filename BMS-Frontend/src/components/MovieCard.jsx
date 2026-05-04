import React from 'react'
import { Heart, Star, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MovieCard = ({ movie, toggleFavorite, favMovies = [] }) => {
  const navigate = useNavigate()


  const isFavorite = favMovies.some(m => m.id === movie.id)

  return (
    <div 
      onClick={() => navigate(`/Movies/${movie.id}`)}
      className="group cursor-pointer bg-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition-all border border-white/10 shadow-xl"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
        <img 
          src={movie.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80'} 
          alt={movie.name || movie.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        
        <button 
          className={`absolute top-3 left-3 p-2 rounded-lg backdrop-blur-md border border-white/10 transition-all z-10 
            ${isFavorite ? 'bg-[#F84464] border-[#F84464]' : 'bg-black/50 hover:bg-[#F84464]'}`}
          onClick={(e) => {
            e.stopPropagation(); 
            toggleFavorite(movie); 
          }}
        >
          <Heart 
            className={`w-4 h-4 transition-all ${isFavorite ? 'fill-white text-white' : 'text-white'}`} 
          />
        </button>

        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold border border-white/10">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '8.5'}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg truncate uppercase tracking-tight">{movie.name || movie.title}</h3>
        <p className="text-gray-400 text-xs mt-1 font-medium">
          {movie.genre || (movie.genres?.[0]?.name) || 'Action'} • {movie.duration || movie.runtime || 120} mins
        </p>
        
        <button className="w-full mt-5 bg-[#F84464] group-hover:bg-[#ff5272] py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg shadow-red-900/20">
          <Ticket className="w-4 h-4" /> Book Now
        </button>
      </div>
    </div>
  )
}

export default MovieCard