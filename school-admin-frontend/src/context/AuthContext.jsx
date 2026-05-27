import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

function isTokenValid(token) {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]))
    return exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    const token  = localStorage.getItem('token')
    if (!stored || !token || !isTokenValid(token)) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      return null
    }
    return JSON.parse(stored)
  })

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      id: data.userId,
      username: data.username,
      fullName: data.fullName,
      role: data.role,
      studentId: data.studentId ?? null,
    }))
    setUser({ id: data.userId, username: data.username, fullName: data.fullName, role: data.role, studentId: data.studentId ?? null })
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
