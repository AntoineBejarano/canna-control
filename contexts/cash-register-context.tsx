"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSales } from "./sales-context"
import { useAuth } from "./auth-context"

// Definición de tipos
export interface CashRegister {
  id: number
  initialAmount: number
  finalAmount?: number
  expectedAmount?: number
  difference?: number
  openingDate: string
  closingDate?: string
  status: "open" | "closed"
  observations?: string
  userId: number
  userName: string
}

export interface CashRegisterSummary {
  totalCashSales: number
  totalCardSales: number
  totalTransferSales: number
  totalSales: number
  salesCount: number
}

interface CashRegisterContextType {
  currentRegister: CashRegister | null
  registers: CashRegister[]
  openRegister: (initialAmount: number) => void
  closeRegister: (finalAmount: number, observations?: string) => void
  getRegisterById: (id: number) => CashRegister | undefined
  getRegisterSummary: (registerId: number) => CashRegisterSummary
  isRegisterOpen: boolean
}

const CashRegisterContext = createContext<CashRegisterContextType | undefined>(undefined)

// Datos iniciales de ejemplo
const initialRegisters: CashRegister[] = [
  {
    id: 1,
    initialAmount: 500,
    finalAmount: 1250.75,
    expectedAmount: 1245.5,
    difference: 5.25,
    openingDate: "2025-03-10T08:30:00",
    closingDate: "2025-03-10T20:15:00",
    status: "closed",
    observations: "Diferencia positiva de $5.25, posiblemente por propinas no registradas.",
    userId: 1,
    userName: "Juan Pérez",
  },
  {
    id: 2,
    initialAmount: 600,
    finalAmount: 1420.3,
    expectedAmount: 1425.0,
    difference: -4.7,
    openingDate: "2025-03-11T08:45:00",
    closingDate: "2025-03-11T20:00:00",
    status: "closed",
    observations: "Faltante de $4.70, posible error en cambio.",
    userId: 1,
    userName: "Juan Pérez",
  },
  {
    id: 3,
    initialAmount: 500,
    finalAmount: 1350.25,
    expectedAmount: 1350.25,
    difference: 0,
    openingDate: "2025-03-12T08:30:00",
    closingDate: "2025-03-12T20:10:00",
    status: "closed",
    userId: 1,
    userName: "Juan Pérez",
  },
]

export function CashRegisterProvider({ children }: { children: ReactNode }) {
  const [registers, setRegisters] = useState<CashRegister[]>([])
  const [currentRegister, setCurrentRegister] = useState<CashRegister | null>(null)
  const { sales } = useSales()
  const { user } = useAuth()

  // Cargar registros desde localStorage o inicializar con datos de ejemplo
  useEffect(() => {
    const storedRegisters = localStorage.getItem("cashRegisters")
    if (storedRegisters) {
      const parsedRegisters = JSON.parse(storedRegisters)
      setRegisters(parsedRegisters)

      // Verificar si hay una caja abierta
      const openRegister = parsedRegisters.find((register: CashRegister) => register.status === "open")
      if (openRegister) {
        setCurrentRegister(openRegister)
      }
    } else {
      setRegisters(initialRegisters)
    }
  }, [])

  // Guardar registros en localStorage cuando cambien
  useEffect(() => {
    if (registers.length > 0) {
      localStorage.setItem("cashRegisters", JSON.stringify(registers))
    }
  }, [registers])

  // Verificar si hay una caja abierta
  const isRegisterOpen = currentRegister !== null && currentRegister.status === "open"

  // Abrir una nueva caja
  const openRegister = (initialAmount: number) => {
    if (isRegisterOpen) {
      throw new Error("Ya hay una caja abierta. Debe cerrarla antes de abrir una nueva.")
    }

    if (!user) {
      throw new Error("Debe iniciar sesión para abrir una caja.")
    }

    const newRegister: CashRegister = {
      id: Math.max(0, ...registers.map((r) => r.id)) + 1,
      initialAmount,
      openingDate: new Date().toISOString(),
      status: "open",
      userId: user.id,
      userName: user.name,
    }

    setRegisters((prev) => [...prev, newRegister])
    setCurrentRegister(newRegister)
    return newRegister
  }

  // Cerrar la caja actual
  const closeRegister = (finalAmount: number, observations?: string) => {
    if (!isRegisterOpen || !currentRegister) {
      throw new Error("No hay una caja abierta para cerrar.")
    }

    // Calcular el monto esperado (inicial + ventas en efectivo)
    const summary = getRegisterSummary(currentRegister.id)
    const expectedAmount = currentRegister.initialAmount + summary.totalCashSales
    const difference = finalAmount - expectedAmount

    const closedRegister: CashRegister = {
      ...currentRegister,
      finalAmount,
      expectedAmount,
      difference,
      closingDate: new Date().toISOString(),
      status: "closed",
      observations,
    }

    setRegisters((prev) => prev.map((register) => (register.id === currentRegister.id ? closedRegister : register)))
    setCurrentRegister(null)
    return closedRegister
  }

  // Obtener un registro por su ID
  const getRegisterById = (id: number) => {
    return registers.find((register) => register.id === id)
  }

  // Obtener resumen de ventas para un registro específico
  const getRegisterSummary = (registerId: number): CashRegisterSummary => {
    const register = getRegisterById(registerId)

    if (!register) {
      return {
        totalCashSales: 0,
        totalCardSales: 0,
        totalTransferSales: 0,
        totalSales: 0,
        salesCount: 0,
      }
    }

    // Filtrar ventas que ocurrieron durante el período de apertura de la caja
    const registerSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date + "T" + (sale.time || "00:00:00"))
      const openingDate = new Date(register.openingDate)
      const closingDate = register.closingDate ? new Date(register.closingDate) : new Date()

      return saleDate >= openingDate && saleDate <= closingDate && sale.status === "completed"
    })

    // Calcular totales por método de pago
    const totalCashSales = registerSales
      .filter((sale) => sale.paymentMethod === "cash")
      .reduce((sum, sale) => sum + sale.total, 0)

    const totalCardSales = registerSales
      .filter((sale) => sale.paymentMethod === "card")
      .reduce((sum, sale) => sum + sale.total, 0)

    const totalTransferSales = registerSales
      .filter((sale) => sale.paymentMethod === "transfer")
      .reduce((sum, sale) => sum + sale.total, 0)

    const totalSales = totalCashSales + totalCardSales + totalTransferSales

    return {
      totalCashSales,
      totalCardSales,
      totalTransferSales,
      totalSales,
      salesCount: registerSales.length,
    }
  }

  return (
    <CashRegisterContext.Provider
      value={{
        currentRegister,
        registers,
        openRegister,
        closeRegister,
        getRegisterById,
        getRegisterSummary,
        isRegisterOpen,
      }}
    >
      {children}
    </CashRegisterContext.Provider>
  )
}

export function useCashRegister() {
  const context = useContext(CashRegisterContext)
  if (context === undefined) {
    throw new Error("useCashRegister must be used within a CashRegisterProvider")
  }
  return context
}
