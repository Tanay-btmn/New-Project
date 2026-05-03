import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'
import { toast } from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const loggedInUser = await login(formData.username, formData.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-sm">Login to book your tickets</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-medium">Username or Email</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username or email"
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#F84464] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#F84464] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl mt-2
              ${loading
                ? 'bg-white/10 cursor-not-allowed'
                : 'bg-[#F84464] hover:bg-[#ff5272] shadow-red-900/20'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#F84464] hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login