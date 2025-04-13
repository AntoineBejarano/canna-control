"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { mockUser, mockEmployeeUser } from "@/lib/mockdata"

type User = {
  id: number
  name: string
  email: string
  role: string
  avatar: string
  dispensary: {
    id: number
    name: string
    address: string
    type: string
    license: string
    phone: string
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: () => boolean
  updateUserInfo: (updatedInfo: Partial<User>) => void
  updateDispensaryInfo: (updatedInfo: Partial<User["dispensary"]>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulación de autenticación
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular delay de red

      // Verificar credenciales de administrador
      if (email === mockUser.email && password === mockUser.password) {
        const userData = { ...mockUser }
        delete (userData as any).password
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }

      // Verificar credenciales de empleado
      if (email === mockEmployeeUser.email && password === mockEmployeeUser.password) {
        const userData = { ...mockEmployeeUser }
        delete (userData as any).password
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }

      return false
    } catch (error) {
      console.error("Error during login:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  // Nueva función para actualizar la información del usuario
  const updateUserInfo = useCallback(
    (updatedInfo: Partial<User>) => {
      if (!user) return

      const updatedUser = {
        ...user,
        ...updatedInfo,
      }

      console.log("Actualizando información del usuario:", updatedUser)
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    },
    [user],
  )

  // Nueva función para actualizar la información del dispensario
  const updateDispensaryInfo = useCallback(
    (updatedInfo: Partial<User["dispensary"]>) => {
      if (!user) return

      const updatedUser = {
        ...user,
        dispensary: {
          ...user.dispensary,
          ...updatedInfo,
        },
      }

      console.log("Actualizando información del dispensario:", updatedUser)
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    },
    [user],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        isAdmin,
        updateUserInfo,
        updateDispensaryInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
