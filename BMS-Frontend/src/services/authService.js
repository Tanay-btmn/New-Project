import API from './api'

export const register = async (username, email, password) => {
  const response = await API.post('/api/auth/registernormaluser', {  // ← changed
    username,
    email,
    password
  })
  return response.data
}
export const login = async (username, password) => {
  const response = await API.post('/api/auth/login', {
    username,
    password
  })
  // Save token to localStorage
  localStorage.setItem('token', response.data.jwtToken)
  localStorage.setItem('user', JSON.stringify(response.data))
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'))
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

export const isAdmin = () => {
  const user = getCurrentUser()
  return !!user?.roles?.includes('ROLE_ADMIN')
}