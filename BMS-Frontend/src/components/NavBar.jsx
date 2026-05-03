import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, Search, TicketPlus, Heart } from 'lucide-react'
import { isAuthenticated, logout, getCurrentUser, isAdmin } from '../services/authService'

const NavBar = ({ favCount = 0 }) => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const loggedIn = isAuthenticated()
  const adminUser = isAdmin()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-black/20 backdrop-blur-sm'>
      <Link to='/' className='max-md:flex-1'>
        <img src={assets.logo} alt="Logo" className='w-36 h-auto mix-blend-screen' />
      </Link>

      <div className='hidden md:flex items-center gap-8 py-3 rounded-full bg-white/10 border border-white/10'>
        <Link to='/' className='text-[#F84464] hover:text-[#F84464] transition-colors'>Home</Link>
        <Link to='/Movies' className='hover:text-[#F84464] transition-colors'>Movies</Link>
        <Link to='/Favourite' className='hover:text-[#F84464] transition-colors flex items-center gap-1'>
          Favourites
          {favCount > 0 && <span className='bg-[#F84464] text-[10px] px-1.5 py-0.5 rounded-full'>{favCount}</span>}
        </Link>
        {adminUser && (
          <Link to='/admin' className='hover:text-[#F84464] transition-colors'>
            Admin
          </Link>
        )}
      </div>

      <div className='flex items-center gap-5'>
        <Search className='w-5 h-5 cursor-pointer text-white hover:text-[#F84464] transition-colors' />
        {loggedIn ? (
          <div className='flex items-center gap-3'>
            <span className='text-white text-sm'>{user?.username}</span>
            <button
              onClick={handleLogout}
              className='bg-[#F84464] hover:bg-[#ff5272] text-white px-7 py-2 rounded-full text-sm font-semibold transition-all shadow-lg'
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-[#F84464] hover:bg-[#ff5272] text-white px-7 py-2 rounded-full text-sm font-semibold transition-all shadow-lg'
          >
            Login
          </button>
        )}
        <Menu className='md:hidden w-8 h-8 cursor-pointer text-white' />
      </div>
    </div>
  )
}

export default NavBar