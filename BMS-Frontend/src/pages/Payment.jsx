import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import API from '../services/api'

const Payment = () => {
  const { bookingId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)

  const amount = useMemo(() => {
    return location.state?.amount ?? location.state?.booking?.price ?? 0
  }, [location.state])

  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    try {
      setProcessing(true)
      await API.put(`/api/booking/${bookingId}/confirm`)
      toast.success('Payment successful. Booking confirmed!')
      navigate('/MyBookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 px-6 md:px-16 lg:px-36">
      <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Payment</h1>
        <p className="text-gray-400 mb-8">Booking ID: #{bookingId}</p>

        <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <span className="text-gray-400">Amount to pay</span>
          <span className="text-2xl font-bold text-[#F84464]">₹{amount}</span>
        </div>

        <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="cardName"
            placeholder="Cardholder name"
            value={form.cardName}
            onChange={handleChange}
            required
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#F84464]"
          />
          <input
            name="cardNumber"
            placeholder="Card number"
            value={form.cardNumber}
            onChange={handleChange}
            required
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#F84464]"
          />
          <input
            name="expiry"
            placeholder="MM/YY"
            value={form.expiry}
            onChange={handleChange}
            required
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#F84464]"
          />
          <input
            name="cvv"
            placeholder="CVV"
            value={form.cvv}
            onChange={handleChange}
            required
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#F84464]"
          />

          <button
            type="submit"
            disabled={processing}
            className={`md:col-span-2 mt-2 py-3 rounded-xl font-bold transition-all ${
              processing
                ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                : 'bg-[#F84464] hover:bg-[#ff5272] text-white'
            }`}
          >
            {processing ? 'Processing payment...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Payment
