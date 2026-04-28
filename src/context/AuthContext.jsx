import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Verificar sesión al montar
  useEffect(() => {
    const verificarSesion = async () => {
      const t = localStorage.getItem('token')
      if (t) {
        try {
          const perfil = await authAPI.perfil()
          setToken(t)
          setUsuario(perfil)
        } catch (err) {
          localStorage.removeItem('token')
        }
      }
      setCargando(false)
    }
    verificarSesion()
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      const data = await authAPI.login(email, password)
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUsuario(data.usuari)
      return data.usuari
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const registro = useCallback(async (email, password, nombre, foto) => {
    setError(null)
    try {
      const data = await authAPI.registro(email, password, nombre, foto)
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUsuario(data.usuari)
      return data.usuari
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUsuario(null)
    localStorage.removeItem('token')
  }, [])

  const actualizarUsuario = useCallback((datos) => {
    setUsuario(datos)
  }, [])

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      cargando,
      error,
      login,
      registro,
      logout,
      actualizarUsuario,
      autenticado: !!token,
      esAdmin: usuario?.rol === 'admin',
      esEditor: usuario?.rol === 'editor' || usuario?.rol === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
