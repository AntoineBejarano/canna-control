"use client"

import { createContext, useState, useEffect } from "react"
import { mockUser, mockEmployeeUser } from "@/lib/mockdata"

export const AuthContext = createContext(null)

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAdmin(JSON.parse(storedUser).role === "admin")
    }
  }, [])

  const login = async (email, password) => {
    // Simulación de autenticación
    if (email === mockUser.email && password === mockUser.password) {
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
      setIsAdmin(true)
      return true
    } else if (email === mockEmployeeUser.email && password === mockEmployeeUser.password) {
      localStorage.setItem("user", JSON.stringify(mockEmployeeUser))
      setUser(mockEmployeeUser)
      setIsAdmin(false)
      return true
    } else {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setIsAdmin(false)
  }

  return {
    user,
    isAdmin: () => isAdmin,
    login,
    logout,
  }
}
