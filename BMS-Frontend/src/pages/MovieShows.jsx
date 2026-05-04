import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Ticket } from 'lucide-react'
import API from '../services/api'

const MovieShows = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [theaterShows, setTheaterShows] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const movieRes = await API.get(`/api/movies/${id}`)
        setMovie(movieRes.data)

        const showsRes = await API.get(`/api/shows/movie/${id}`)
        
        // Group shows by theater
        const grouped = showsRes.data.reduce((acc, show) => {
          const tId = show.theater.id
          if (!acc[tId]) {
            acc[tId] = {
              name: show.theater.theaterName,
              location: show.theater.location,
              screen: show.theater.screenType,
              shows: []
            }
          }
          acc[tId].shows.push(show)
          return acc
        }, {})
        
        setTheaterShows(grouped)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <div className="bg-[#050505] min-h-screen text-white pt-20 flex justify-center items-center">Loading...</div>

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 px-6 md:px-16 lg:px-36">
      <div className="mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">{movie?.name}</h1>
        <p className="text-gray-400 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> {movie?.genre} • {movie?.language} • {movie?.duration} mins
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {Object.keys(theaterShows).length > 0 ? (
          Object.values(theaterShows).map((theater, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="md:w-1/3">
                <h2 className="text-xl font-bold mb-1">{theater.name}</h2>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F84464]" /> {theater.location}
                </p>
                <span className="inline-block mt-3 bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-[#F84464] border border-white/10">
                  {theater.screen}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 md:w-2/3">
                {theater.shows.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => navigate(`/Movies/${id}/${show.id}`)}
                    className="group border border-white/10 hover:border-[#F84464] bg-white/5 hover:bg-[#F84464]/10 rounded-xl px-6 py-3 transition-all text-center flex flex-col gap-1 min-w-[120px]"
                  >
                    <span className="text-[#F84464] font-bold">
                      {new Date(show.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] text-gray-500 group-hover:text-white uppercase font-bold">₹{show.price}</span>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">No shows found for this movie.</div>
        )}
      </div>
    </div>
  )
}

export default MovieShows
