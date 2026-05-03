import React, { useEffect, useState } from 'react'
import { CheckCircle2, Clock } from 'lucide-react'
import API from '../services/api'
import { getCurrentUser, isAuthenticated } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated()) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        const user = getCurrentUser()
        const response = await API.get(`/api/booking/getuserbookings/${user.id}`)
        setBookings(response.data)
      } catch (err) {
        console.error('Failed to load bookings:', err)
        setError('Failed to load your bookings')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleCancel = async (bookingId) => {
    try {
      await API.put(`/api/booking/${bookingId}/cancel`)
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId
            ? { ...b, bookingStatus: 'CANCELLED' }
            : b
        )
      )
    } catch (err) {
      console.error('Cancel failed:', err)
    }
  }

  if (loading) return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 flex items-center justify-center">
      <p className="text-gray-400 text-xl">Loading your bookings...</p>
    </div>
  )

  if (error) return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 flex items-center justify-center">
      <p className="text-red-400 text-xl">{error}</p>
    </div>
  )

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 px-6 md:px-16 lg:px-36">
      <h1 className="text-3xl font-bold mb-10 flex items-center gap-3">
        <span className="w-2 h-8 bg-[#F84464] rounded-full"></span>
        Purchase History
      </h1>

      <div className="flex flex-col gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Movie Poster */}
              <img
                src={booking.show?.movie?.poster_path || '/placeholder.jpg'}
                className="w-24 h-36 rounded-lg object-cover border border-white/10"
                alt={booking.show?.movie?.name}
              />

              {/* Booking Info */}
              <div className="grow">
                <h2 className="text-xl font-bold uppercase tracking-tight">
                  {booking.show?.movie?.name}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {booking.show?.showTime
                    ? `${new Date(booking.show.showTime).toLocaleDateString()} • ${new Date(booking.show.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Show time unavailable'
                  }
                </p>
                <p className="text-gray-400 text-sm">
                  {booking.show?.theater?.theaterName}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {booking.seatNumbers?.map(seat => (
                    <span
                      key={seat}
                      className="bg-white/10 px-3 py-1 rounded-md text-xs font-mono border border-white/5"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Status */}
              <div className="text-right flex flex-col items-end gap-2">
                <p className="text-2xl font-bold text-[#F84464]">₹{booking.price}</p>

                {booking.bookingStatus === 'CONFIRMED' && (
                  <span className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    <CheckCircle2 className="w-4 h-4" /> Confirmed
                  </span>
                )}
                {booking.bookingStatus === 'PENDING' && (
                  <>
                    <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                      <Clock className="w-4 h-4" /> Pending Payment
                    </span>
                    <button
                      onClick={() => navigate(`/payment/${booking.id}`, { state: { amount: booking.price, booking } })}
                      className="text-xs text-[#F84464] hover:text-[#ff5272] underline transition-colors"
                    >
                      Pay Now
                    </button>
                  </>
                )}
                {booking.bookingStatus === 'CANCELLED' && (
                  <span className="flex items-center gap-1 text-red-500 text-sm font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    Cancelled
                  </span>
                )}

                {booking.bookingStatus !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="mt-2 text-xs text-gray-400 hover:text-red-400 underline transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No bookings found in your history.</p>
            <button
              onClick={() => navigate('/Movies')}
              className="mt-4 bg-[#F84464] hover:bg-[#ff5272] text-white px-6 py-2 rounded-full font-semibold transition-all"
            >
              Browse Movies
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings