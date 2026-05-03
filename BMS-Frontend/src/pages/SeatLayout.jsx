import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import API from '../services/api'
import { getCurrentUser } from '../services/authService'

const SeatLayout = ({ setBookings }) => {
  const { showId } = useParams()
  const navigate = useNavigate()

  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookedSeats, setBookedSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [confirming, setConfirming] = useState(false)

  const rows = ['A', 'B', 'C', 'D', 'E', 'F']
  const seatsPerRow = 10

  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true)
        const response = await API.get(`/api/show/${showId}`)
        setShow(response.data)

        // Fetch already booked seats for this show
        const bookingsResponse = await API.get(`/api/booking/getshowbookings/${showId}`)
        const allBookedSeats = bookingsResponse.data
          .filter(b => b.bookingStatus !== 'CANCELLED')
          .flatMap(b => b.seatNumbers)
        setBookedSeats(allBookedSeats)
      } catch (err) {
        console.error('Failed to load show:', err)
        toast.error('Failed to load show details')
      } finally {
        setLoading(false)
      }
    }
    fetchShow()
  }, [showId])

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    )
  }

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) return

    const user = getCurrentUser()
    if (!user) {
      toast.error('Please login to book tickets')
      navigate('/login')
      return
    }

    try {
      setConfirming(true)
      const bookingData = {
        userId: user.id,
        showId: parseInt(showId),
        numberOfSeats: selectedSeats.length,
        seatNumbers: selectedSeats,
        price: show?.price || 250
      }

      const response = await API.post('/api/booking/createbooking', bookingData)

      // Update local bookings state
      setBookings(prev => [response.data, ...prev])

      toast.success('Seats reserved. Complete payment to confirm.')
      navigate(`/payment/${response.data.id}`, {
        state: {
          amount: response.data.price,
          booking: response.data
        }
      })
    } catch (err) {
      console.error('Booking failed:', err)
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setConfirming(false)
    }
  }

  const price = show?.price || 250

  if (loading) return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 flex items-center justify-center">
      <p className="text-gray-400 text-xl">Loading seats...</p>
    </div>
  )

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 px-6 md:px-16 flex flex-col items-center">

      {/* Show Info */}
      {show && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white">{show.movie?.name}</h2>
          <p className="text-gray-400 mt-1">
            {new Date(show.showTime).toLocaleDateString()} •{' '}
            {new Date(show.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-gray-400">{show.theater?.theaterName}</p>
        </div>
      )}

      <h2 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-[0.2em]">Screen this way</h2>
      <div className="w-full max-w-2xl h-1 bg-linear-to-r from-transparent via-[#F84464] to-transparent mb-16 shadow-[0_4px_20px_rgba(248,68,100,0.3)]" />

      {/* Legend */}
      <div className="flex items-center gap-6 mb-8 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-transparent border border-white/10"></div>
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#F84464]"></div>
          Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/20"></div>
          Booked
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col gap-6">
        {rows.map(row => (
          <div key={row} className="flex gap-6 items-center">
            <span className="w-4 text-xs text-gray-600 font-bold">{row}</span>
            <div className="flex gap-2.5">
              {[...Array(seatsPerRow)].map((_, i) => {
                const seatId = `${row}${i + 1}`
                const isSelected = selectedSeats.includes(seatId)
                const isBooked = bookedSeats.includes(seatId)
                return (
                  <button
                    key={seatId}
                    onClick={() => toggleSeat(seatId)}
                    disabled={isBooked}
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-md text-[10px] font-bold transition-all border
                      ${isBooked
                        ? 'bg-white/20 border-white/20 text-gray-600 cursor-not-allowed'
                        : isSelected
                          ? 'bg-[#F84464] border-[#F84464] text-white shadow-lg'
                          : 'bg-transparent border-white/10 text-gray-400 hover:border-[#F84464] hover:text-[#F84464]'
                      }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Summary */}
      <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10 w-full max-w-md backdrop-blur-xl">
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Selected Seats</p>
            <p className="text-lg font-bold text-white leading-none">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Select Seats'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Price</p>
            <p className="text-2xl font-black text-[#F84464]">₹{selectedSeats.length * price}</p>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0 || confirming}
          className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl
            ${selectedSeats.length > 0 && !confirming
              ? 'bg-[#F84464] hover:bg-[#ff5272] text-white shadow-red-900/20'
              : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}
        >
          {confirming ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  )
}

export default SeatLayout