"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { useSales } from "./sales-context"

// Definición de tipos
export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  status: "active" | "inactive"
  type: "medical" | "recreational" | "both"
  totalSpent: number
  lastVisit: string
  visits: number
  avatar: string
  imageUrl?: string
  balance: number
  address?: string
  city?: string
  postalCode?: string
  notes?: string
  birthdate?: string
  registrationDate: string
  membershipId?: string
}

interface CustomerContextType {
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id" | "registrationDate" | "totalSpent" | "visits" | "lastVisit">) => void
  updateCustomer: (id: number, customer: Partial<Customer>) => void
  deleteCustomer: (id: number) => void
  getCustomerById: (id: number) => Customer | undefined
  updateCustomerStats: () => void
  updateCustomerBalance: (id: number, amount: number, isAddition?: boolean) => void
}

// Datos iniciales de clientes
const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "+34 612 345 678",
    status: "active",
    type: "recreational",
    totalSpent: 0, // Inicializamos en 0, se calculará después
    lastVisit: "2025-03-10",
    visits: 0, // Inicializamos en 0, se calculará después
    avatar: "JP",
    balance: 0,
    address: "Calle Principal 123",
    city: "Madrid",
    postalCode: "28001",
    registrationDate: "2024-12-15",
  },
  {
    id: 2,
    name: "María López",
    email: "maria.lopez@example.com",
    phone: "+34 623 456 789",
    status: "active",
    type: "medical",
    totalSpent: 0,
    lastVisit: "2025-03-09",
    visits: 0,
    avatar: "ML",
    balance: 50,
    address: "Avenida Central 45",
    city: "Barcelona",
    postalCode: "08001",
    notes: "Paciente con receta médica para dolor crónico",
    registrationDate: "2024-11-20",
    membershipId: "MED-2024-002",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    phone: "+34 634 567 890",
    status: "active",
    type: "recreational",
    totalSpent: 0,
    lastVisit: "2025-03-08",
    visits: 0,
    avatar: "CR",
    balance: 0,
    registrationDate: "2025-01-05",
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ana.martinez@example.com",
    phone: "+34 645 678 901",
    status: "inactive",
    type: "medical",
    totalSpent: 0,
    lastVisit: "2025-02-01",
    visits: 0,
    avatar: "AM",
    balance: 25,
    address: "Calle Secundaria 78",
    city: "Valencia",
    postalCode: "46001",
    notes: "Paciente con receta para ansiedad",
    registrationDate: "2024-10-12",
    membershipId: "MED-2024-015",
  },
  {
    id: 5,
    name: "Roberto Sánchez",
    email: "roberto.sanchez@example.com",
    phone: "+34 656 789 012",
    status: "active",
    type: "recreational",
    totalSpent: 0,
    lastVisit: "2025-03-07",
    visits: 0,
    avatar: "RS",
    balance: 0,
    address: "Plaza Mayor 12",
    city: "Sevilla",
    postalCode: "41001",
    registrationDate: "2024-09-30",
  },
  {
    id: 6,
    name: "Laura Fernández",
    email: "laura.fernandez@example.com",
    phone: "+34 667 890 123",
    status: "active",
    type: "medical",
    totalSpent: 0,
    lastVisit: "2025-03-05",
    visits: 0,
    avatar: "LF",
    balance: 10,
    address: "Calle Nueva 34",
    city: "Bilbao",
    postalCode: "48001",
    notes: "Paciente con receta para insomnio",
    registrationDate: "2024-11-15",
    membershipId: "MED-2024-023",
  },
  {
    id: 7,
    name: "Miguel González",
    email: "miguel.gonzalez@example.com",
    phone: "+34 678 901 234",
    status: "inactive",
    type: "recreational",
    totalSpent: 0,
    lastVisit: "2025-01-15",
    visits: 0,
    avatar: "MG",
    balance: 0,
    registrationDate: "2025-01-02",
  },
  {
    id: 8,
    name: "Carmen Díaz",
    email: "carmen.diaz@example.com",
    phone: "+34 689 012 345",
    status: "active",
    type: "medical",
    totalSpent: 0,
    lastVisit: "2025-03-06",
    visits: 0,
    avatar: "CD",
    balance: 15,
    address: "Avenida Principal 56",
    city: "Málaga",
    postalCode: "29001",
    notes: "Paciente con receta para dolor crónico",
    registrationDate: "2024-08-20",
    membershipId: "MED-2024-008",
  },
]

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const { sales } = useSales()

  // Cargar clientes iniciales o desde localStorage
  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    } else {
      // Inicializar con los datos de ejemplo
      setCustomers(initialCustomers)
    }
  }, [])

  // Actualizar estadísticas de clientes basadas en las ventas
  const updateCustomerStats = () => {
    // Crear un mapa para almacenar las estadísticas por cliente
    const customerStats = new Map<number, { totalSpent: number; visits: number; lastVisit: string }>()

    // Inicializar el mapa con valores por defecto
    customers.forEach((customer) => {
      customerStats.set(customer.id, {
        totalSpent: 0,
        visits: 0,
        lastVisit: customer.lastVisit,
      })
    })

    // Calcular estadísticas basadas en las ventas
    sales.forEach((sale) => {
      // Solo considerar ventas completadas
      if (sale.status === "completed" && sale.customerId) {
        const customerId = typeof sale.customerId === "string" ? Number.parseInt(sale.customerId) : sale.customerId

        const stats = customerStats.get(customerId)

        if (stats) {
          // Actualizar total gastado
          stats.totalSpent += sale.total

          // Incrementar número de visitas
          stats.visits += 1

          // Actualizar última visita si es más reciente
          const saleDate = new Date(sale.date)
          const lastVisitDate = new Date(stats.lastVisit)

          if (saleDate > lastVisitDate) {
            stats.lastVisit = sale.date
          }

          customerStats.set(customerId, stats)
        }
      }
    })

    // Actualizar los clientes con las nuevas estadísticas
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) => {
        const stats = customerStats.get(customer.id)

        if (stats) {
          return {
            ...customer,
            totalSpent: stats.totalSpent,
            visits: stats.visits,
            lastVisit: stats.lastVisit,
          }
        }

        return customer
      }),
    )
  }

  // Actualizar estadísticas cuando cambian las ventas
  useEffect(() => {
    updateCustomerStats()
  }, [sales])

  // Guardar clientes en localStorage cuando cambien
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem("customers", JSON.stringify(customers))
    }
  }, [customers])

  // Añadir un nuevo cliente
  const addCustomer = (customer: Omit<Customer, "id" | "registrationDate" | "totalSpent" | "visits" | "lastVisit">) => {
    const newCustomer: Customer = {
      ...customer,
      id: Math.max(0, ...customers.map((c) => c.id)) + 1,
      registrationDate: new Date().toISOString().split("T")[0],
      totalSpent: 0,
      visits: 0,
      lastVisit: new Date().toISOString().split("T")[0],
      balance: 0,
    }
    setCustomers((prev) => [...prev, newCustomer])
  }

  // Actualizar un cliente existente
  const updateCustomer = (id: number, updatedCustomer: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((customer) => (customer.id === id ? { ...customer, ...updatedCustomer } : customer)),
    )
  }

  // Eliminar un cliente
  const deleteCustomer = (id: number) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id))
  }

  // Obtener un cliente por su ID
  const getCustomerById = (id: number) => {
    return customers.find((customer) => customer.id === id)
  }

  // Añadir una nueva función para actualizar el saldo del cliente
  const updateCustomerBalance = (id: number, amount: number, isAddition = true) => {
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id === id) {
          const newBalance = isAddition ? customer.balance + amount : Math.max(0, customer.balance - amount)
          return { ...customer, balance: newBalance }
        }
        return customer
      }),
    )
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        updateCustomerStats,
        updateCustomerBalance,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export function useCustomers() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomers must be used within a CustomerProvider")
  }
  return context
}
