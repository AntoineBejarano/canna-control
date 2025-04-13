"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { useProducts } from "@/contexts/product-context"

// Definición de tipos
export interface SaleItem {
  productId: number
  quantity: number
  price: number
  total: number
}

// Añadir este campo a la interfaz Sale
export interface Sale {
  id: number
  date: string
  time?: string // Nuevo campo para la hora
  customerId?: number | string
  customerName: string
  items: SaleItem[]
  total: number
  paymentMethod: "cash" | "card" | "transfer"
  status: "completed" | "pending" | "cancelled"
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SaleLog {
  id: number
  action: "create" | "update" | "delete"
  saleId: number
  details: string
  timestamp: string
  userId: number
  userName: string
}

interface SalesContextType {
  sales: Sale[]
  logs: SaleLog[]
  addSale: (sale: Omit<Sale, "id" | "createdAt" | "updatedAt">) => Sale
  updateSale: (id: number, sale: Partial<Sale>) => void
  deleteSale: (id: number) => void
  getSaleById: (id: number) => Sale | undefined
  getLogs: () => SaleLog[]
  getMonthlyRevenue: () => { name: string; ventas: number; ganancias: number }[]
  getTopProducts: () => { name: string; cantidad: number }[]
  getCustomerDistribution: () => { name: string; value: number }[]
  getRevenueStats: () => { total: number; change: number }
  getCustomerStats: () => { total: number; change: number }
  getProductStats: () => { total: number; change: number }
  getProfitStats: () => { total: number; change: number }
}

// Función para generar fechas aleatorias en un rango
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0]
}

// Función para generar horas aleatorias
const randomTime = () => {
  const hours = Math.floor(Math.random() * 12) + 8 // 8 AM a 8 PM
  const minutes = Math.floor(Math.random() * 60)
  const seconds = Math.floor(Math.random() * 60)
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

// Función para generar un timestamp aleatorio
const randomTimestamp = (date: string) => {
  return `${date}T${randomTime()}`
}

// Datos iniciales de ventas
const initialSales: Sale[] = [
  {
    id: 1001,
    date: "2025-03-10",
    customerId: 1,
    customerName: "Juan Pérez",
    items: [
      { productId: 1, quantity: 3, price: 15, total: 45 },
      { productId: 5, quantity: 1, price: 89.99, total: 89.99 },
    ],
    total: 134.99,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2025-03-10T14:30:00",
    updatedAt: "2025-03-10T14:30:00",
  },
  {
    id: 1002,
    date: "2025-03-10",
    customerId: 2,
    customerName: "María López",
    items: [
      { productId: 2, quantity: 5, price: 14, total: 70 },
      { productId: 3, quantity: 2, price: 25, total: 50 },
    ],
    total: 120.0,
    paymentMethod: "card",
    status: "completed",
    createdAt: "2025-03-10T16:45:00",
    updatedAt: "2025-03-10T16:45:00",
  },
  {
    id: 1003,
    date: "2025-03-09",
    customerId: 3,
    customerName: "Carlos Rodríguez",
    items: [{ productId: 4, quantity: 3, price: 18, total: 54 }],
    total: 54.0,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2025-03-09T11:20:00",
    updatedAt: "2025-03-09T11:20:00",
  },
  {
    id: 1004,
    date: "2025-03-09",
    customerId: 4,
    customerName: "Ana Martínez",
    items: [
      { productId: 1, quantity: 2, price: 15, total: 30 },
      { productId: 2, quantity: 2, price: 14, total: 28 },
    ],
    total: 58.0,
    paymentMethod: "card",
    status: "completed",
    createdAt: "2025-03-09T15:10:00",
    updatedAt: "2025-03-09T15:10:00",
  },
  {
    id: 1005,
    date: "2025-03-08",
    customerId: 5,
    customerName: "Roberto Sánchez",
    items: [{ productId: 5, quantity: 1, price: 89.99, total: 89.99 }],
    total: 89.99,
    paymentMethod: "card",
    status: "pending",
    createdAt: "2025-03-08T10:05:00",
    updatedAt: "2025-03-08T10:05:00",
  },
  // Añadir más ventas para tener datos más completos
  {
    id: 1006,
    date: "2025-03-07",
    customerId: 6,
    customerName: "Laura Fernández",
    items: [
      { productId: 1, quantity: 2, price: 15, total: 30 },
      { productId: 3, quantity: 1, price: 25, total: 25 },
    ],
    total: 55.0,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2025-03-07T09:15:00",
    updatedAt: "2025-03-07T09:15:00",
  },
  {
    id: 1007,
    date: "2025-03-06",
    customerId: 8,
    customerName: "Carmen Díaz",
    items: [
      { productId: 2, quantity: 3, price: 14, total: 42 },
      { productId: 4, quantity: 2, price: 18, total: 36 },
    ],
    total: 78.0,
    paymentMethod: "transfer",
    status: "completed",
    createdAt: "2025-03-06T14:20:00",
    updatedAt: "2025-03-06T14:20:00",
  },
  {
    id: 1008,
    date: "2025-03-05",
    customerId: 1,
    customerName: "Juan Pérez",
    items: [{ productId: 6, quantity: 1, price: 18, total: 18 }],
    total: 18.0,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2025-03-05T11:30:00",
    updatedAt: "2025-03-05T11:30:00",
  },
  {
    id: 1009,
    date: "2025-03-04",
    customerId: 3,
    customerName: "Carlos Rodríguez",
    items: [
      { productId: 1, quantity: 1, price: 15, total: 15 },
      { productId: 2, quantity: 1, price: 14, total: 14 },
      { productId: 3, quantity: 1, price: 25, total: 25 },
    ],
    total: 54.0,
    paymentMethod: "card",
    status: "completed",
    createdAt: "2025-03-04T16:45:00",
    updatedAt: "2025-03-04T16:45:00",
  },
  {
    id: 1010,
    date: "2025-03-03",
    customerId: 5,
    customerName: "Roberto Sánchez",
    items: [{ productId: 4, quantity: 4, price: 18, total: 72 }],
    total: 72.0,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2025-03-03T10:15:00",
    updatedAt: "2025-03-03T10:15:00",
  },
]

// Generar más ventas para los meses anteriores
const generateMoreSales = (): Sale[] => {
  const additionalSales: Sale[] = []
  const customerIds = [1, 2, 3, 4, 5, 6, 7, 8]
  const customerNames = [
    "Juan Pérez",
    "María López",
    "Carlos Rodríguez",
    "Ana Martínez",
    "Roberto Sánchez",
    "Laura Fernández",
    "Miguel González",
    "Carmen Díaz",
  ]
  const productIds = [1, 2, 3, 4, 5, 6]
  const paymentMethods: ("cash" | "card" | "transfer")[] = ["cash", "card", "transfer"]

  // Generar ventas para los últimos 12 meses
  const today = new Date()
  const startDate = new Date(today)
  startDate.setMonth(today.getMonth() - 12)

  // Generar 200 ventas adicionales
  for (let i = 0; i < 200; i++) {
    const date = randomDate(startDate, today)
    const customerIndex = Math.floor(Math.random() * customerIds.length)
    const customerId = customerIds[customerIndex]
    const customerName = customerNames[customerIndex]

    // Generar entre 1 y 3 items por venta
    const itemCount = Math.floor(Math.random() * 3) + 1
    const items: SaleItem[] = []
    let total = 0

    for (let j = 0; j < itemCount; j++) {
      const productId = productIds[Math.floor(Math.random() * productIds.length)]
      const quantity = Math.floor(Math.random() * 5) + 1
      let price = 0

      // Asignar precios según el producto
      switch (productId) {
        case 1:
          price = 15
          break
        case 2:
          price = 14
          break
        case 3:
          price = 25
          break
        case 4:
          price = 18
          break
        case 5:
          price = 89.99
          break
        case 6:
          price = 18
          break
        default:
          price = 10
      }

      const itemTotal = price * quantity
      total += itemTotal

      items.push({
        productId,
        quantity,
        price,
        total: itemTotal,
      })
    }

    const timestamp = randomTimestamp(date)

    additionalSales.push({
      id: 1011 + i,
      date,
      customerId,
      customerName,
      items,
      total,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status: Math.random() > 0.1 ? "completed" : Math.random() > 0.5 ? "pending" : "cancelled",
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  return additionalSales
}

// Combinar ventas iniciales con las generadas
const allSales = [...initialSales, ...generateMoreSales()]

// Datos iniciales de logs
const initialLogs: SaleLog[] = [
  {
    id: 1,
    action: "create",
    saleId: 1001,
    details: "Venta creada",
    timestamp: "2025-03-10T14:30:00",
    userId: 1,
    userName: "Juan Pérez",
  },
  {
    id: 2,
    action: "create",
    saleId: 1002,
    details: "Venta creada",
    timestamp: "2025-03-10T16:45:00",
    userId: 1,
    userName: "Juan Pérez",
  },
  {
    id: 3,
    action: "create",
    saleId: 1003,
    details: "Venta creada",
    timestamp: "2025-03-09T11:20:00",
    userId: 1,
    userName: "Juan Pérez",
  },
  {
    id: 4,
    action: "create",
    saleId: 1004,
    details: "Venta creada",
    timestamp: "2025-03-09T15:10:00",
    userId: 1,
    userName: "Juan Pérez",
  },
  {
    id: 5,
    action: "create",
    saleId: 1005,
    details: "Venta creada",
    timestamp: "2025-03-08T10:05:00",
    userId: 1,
    userName: "Juan Pérez",
  },
]

const SalesContext = createContext<SalesContextType | undefined>(undefined)

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([])
  const [logs, setLogs] = useState<SaleLog[]>([])
  const { products, updateProduct } = useProducts()

  // Cargar ventas y logs iniciales o desde localStorage
  useEffect(() => {
    const storedSales = localStorage.getItem("sales")
    const storedLogs = localStorage.getItem("saleLogs")

    if (storedSales) {
      setSales(JSON.parse(storedSales))
    } else {
      setSales(allSales)
    }

    if (storedLogs) {
      setLogs(JSON.parse(storedLogs))
    } else {
      setLogs(initialLogs)
    }
  }, [])

  // Guardar ventas y logs en localStorage cuando cambien
  useEffect(() => {
    if (sales.length > 0) {
      localStorage.setItem("sales", JSON.stringify(sales))
    }

    if (logs.length > 0) {
      localStorage.setItem("saleLogs", JSON.stringify(logs))
    }
  }, [sales, logs])

  // Función para crear un nuevo log
  const createLog = (action: "create" | "update" | "delete", saleId: number, details: string) => {
    const newLog: SaleLog = {
      id: Math.max(0, ...logs.map((log) => log.id)) + 1,
      action,
      saleId,
      details,
      timestamp: new Date().toISOString(),
      userId: 1, // En una aplicación real, esto vendría del usuario autenticado
      userName: "Juan Pérez", // En una aplicación real, esto vendría del usuario autenticado
    }

    setLogs((prevLogs) => [...prevLogs, newLog])
    return newLog
  }

  // Función para actualizar el stock de productos después de una venta
  const updateProductStock = (items: SaleItem[]) => {
    items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity)

        // Determinar el nuevo estado del stock
        let newStatus: "in_stock" | "low_stock" | "out_of_stock" = product.status

        if (newStock === 0) {
          newStatus = "out_of_stock"
        } else if (newStock < 10) {
          // Umbral para stock bajo
          newStatus = "low_stock"
        } else {
          newStatus = "in_stock"
        }

        // Actualizar el producto con el nuevo stock y estado
        updateProduct(product.id, {
          stock: newStock,
          status: newStatus,
        })
      }
    })
  }

  // En la función addSale, añadir la hora actual y actualizar el stock
  const addSale = (sale: Omit<Sale, "id" | "createdAt" | "updatedAt">) => {
    const timestamp = new Date().toISOString()
    const now = new Date()
    const time = now.toTimeString().split(" ")[0] // Formato HH:MM:SS

    const newSale: Sale = {
      ...sale,
      time, // Añadir la hora
      id: Math.max(0, ...sales.map((s) => s.id)) + 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    setSales((prevSales) => [...prevSales, newSale])

    // Actualizar el stock de los productos vendidos
    if (sale.status === "completed") {
      updateProductStock(sale.items)
    }

    // Crear log de la acción
    createLog("create", newSale.id, `Venta creada por un total de $${newSale.total.toFixed(2)}`)

    return newSale
  }

  // Actualizar una venta existente
  const updateSale = (id: number, updatedSaleData: Partial<Sale>) => {
    // Obtener la venta antes de actualizarla para el log
    const originalSale = sales.find((sale) => sale.id === id)

    if (!originalSale) return

    // Actualizar la venta
    const updatedSale = {
      ...originalSale,
      ...updatedSaleData,
      updatedAt: new Date().toISOString(),
    }

    setSales((prevSales) => prevSales.map((sale) => (sale.id === id ? updatedSale : sale)))

    // Si el estado cambió de no completado a completado, actualizar el stock
    if (originalSale.status !== "completed" && updatedSale.status === "completed") {
      updateProductStock(updatedSale.items)
    }

    // Crear log de la acción con detalles específicos
    const details = []

    if (updatedSaleData.customerId && updatedSaleData.customerId !== originalSale.customerId) {
      details.push(`Cliente: ${originalSale.customerName} → ${updatedSaleData.customerName}`)
    }

    if (updatedSaleData.total && updatedSaleData.total !== originalSale.total) {
      details.push(`Total: $${originalSale.total.toFixed(2)} → $${updatedSaleData.total.toFixed(2)}`)
    }

    if (updatedSaleData.status && updatedSaleData.status !== originalSale.status) {
      details.push(`Estado: ${originalSale.status} → ${updatedSaleData.status}`)
    }

    if (updatedSaleData.paymentMethod && updatedSaleData.paymentMethod !== originalSale.paymentMethod) {
      details.push(`Método de pago: ${originalSale.paymentMethod} → ${updatedSaleData.paymentMethod}`)
    }

    const logDetails =
      details.length > 0 ? `Venta #${id} actualizada. Cambios: ${details.join(", ")}` : `Venta #${id} actualizada`

    createLog("update", id, logDetails)
  }

  // Eliminar una venta
  const deleteSale = (id: number) => {
    // Obtener la venta antes de eliminarla para el log
    const saleToDelete = sales.find((sale) => sale.id === id)

    if (!saleToDelete) return

    // Eliminar la venta
    setSales((prevSales) => prevSales.filter((sale) => sale.id !== id))

    // Crear log de la acción con detalles específicos
    createLog(
      "delete",
      id,
      `Venta #${id} eliminada. Cliente: ${saleToDelete.customerName}, Total: $${saleToDelete.total.toFixed(2)}, Fecha: ${saleToDelete.date}, Estado: ${saleToDelete.status}`,
    )
  }

  // Obtener una venta por su ID
  const getSaleById = (id: number) => {
    return sales.find((sale) => sale.id === id)
  }

  // Obtener todos los logs
  const getLogs = () => {
    return logs
  }

  // Obtener datos para el gráfico de ventas mensuales
  const getMonthlyRevenue = () => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    // Inicializar datos para los últimos 12 meses
    const monthlyData = months.map((name) => ({ name, ventas: 0, ganancias: 0 }))

    // Obtener el mes actual (0-11)
    const currentMonth = new Date().getMonth()

    // Calcular ventas y ganancias por mes
    sales.forEach((sale) => {
      if (sale.status === "completed") {
        const saleDate = new Date(sale.date)
        const saleMonth = saleDate.getMonth()
        const saleYear = saleDate.getFullYear()
        const currentYear = new Date().getFullYear()

        // Solo considerar ventas del último año
        if (
          (saleYear === currentYear && saleMonth <= currentMonth) ||
          (saleYear === currentYear - 1 && saleMonth > currentMonth)
        ) {
          // Calcular el índice en el array (relativo al mes actual)
          const monthIndex = (saleMonth - currentMonth + 12) % 12

          // Actualizar ventas
          monthlyData[monthIndex].ventas += sale.total

          // Estimar ganancias (aproximadamente 50% del total)
          monthlyData[monthIndex].ganancias += sale.total * 0.5
        }
      }
    })

    // Reordenar para que el mes actual esté al final
    const result = [...monthlyData.slice(currentMonth + 1), ...monthlyData.slice(0, currentMonth + 1)]

    return result
  }

  // Obtener datos para el gráfico de productos más vendidos
  const getTopProducts = () => {
    const productCounts: Record<number, number> = {}

    // Contar la cantidad vendida de cada producto
    sales.forEach((sale) => {
      if (sale.status === "completed") {
        sale.items.forEach((item) => {
          if (!productCounts[item.productId]) {
            productCounts[item.productId] = 0
          }
          productCounts[item.productId] += item.quantity
        })
      }
    })

    // Convertir a array y ordenar por cantidad
    const productArray = Object.entries(productCounts).map(([productId, cantidad]) => {
      // Mapear nombres de productos
      let name = `Producto #${productId}`
      switch (Number(productId)) {
        case 1:
          name = "OG Kush"
          break
        case 2:
          name = "Blue Dream"
          break
        case 3:
          name = "Gummies CBD"
          break
        case 4:
          name = "Sour Diesel"
          break
        case 5:
          name = "Vaporizador Premium"
          break
        case 6:
          name = "Girl Scout Cookies"
          break
      }

      return { name, cantidad }
    })

    // Ordenar por cantidad (descendente) y tomar los 8 primeros
    return productArray.sort((a, b) => b.cantidad - a.cantidad).slice(0, 8)
  }

  // Obtener datos para el gráfico de distribución de clientes
  const getCustomerDistribution = () => {
    const customerTypes: Record<string, number> = {
      Recreativo: 0,
      Médico: 0,
    }

    // Contar ventas por tipo de cliente
    const customerSales: Record<number, { count: number; type?: string }> = {}

    sales.forEach((sale) => {
      if (sale.status === "completed" && sale.customerId) {
        const customerId = typeof sale.customerId === "string" ? Number.parseInt(sale.customerId) : sale.customerId

        if (!customerSales[customerId]) {
          customerSales[customerId] = { count: 0 }

          // Asignar tipo según el ID (simulado)
          if ([2, 4, 6, 8].includes(customerId)) {
            customerSales[customerId].type = "Médico"
          } else {
            customerSales[customerId].type = "Recreativo"
          }
        }

        customerSales[customerId].count += 1
      }
    })

    // Sumar por tipo
    Object.values(customerSales).forEach((customer) => {
      if (customer.type) {
        customerTypes[customer.type] += customer.count
      }
    })

    // Convertir a array para el gráfico
    return Object.entries(customerTypes).map(([name, value]) => ({ name, value }))
  }

  // Obtener estadísticas de ingresos
  const getRevenueStats = () => {
    // Calcular ingresos totales (ventas completadas)
    const total = sales.filter((sale) => sale.status === "completed").reduce((sum, sale) => sum + sale.total, 0)

    // Calcular cambio respecto al mes anterior
    const today = new Date()
    const currentMonth = today.getMonth()
    const lastMonth = (currentMonth - 1 + 12) % 12

    const currentMonthSales = sales
      .filter((sale) => {
        const saleDate = new Date(sale.date)
        return (
          sale.status === "completed" &&
          saleDate.getMonth() === currentMonth &&
          saleDate.getFullYear() === today.getFullYear()
        )
      })
      .reduce((sum, sale) => sum + sale.total, 0)

    const lastMonthSales = sales
      .filter((sale) => {
        const saleDate = new Date(sale.date)
        const year = saleDate.getMonth() < currentMonth ? today.getFullYear() : today.getFullYear() - 1
        return sale.status === "completed" && saleDate.getMonth() === lastMonth && saleDate.getFullYear() === year
      })
      .reduce((sum, sale) => sum + sale.total, 0)

    // Calcular porcentaje de cambio
    const change =
      lastMonthSales === 0
        ? 100
        : // Si no hay ventas el mes pasado, consideramos un 100% de aumento
          Math.round(((currentMonthSales - lastMonthSales) / lastMonthSales) * 100 * 10) / 10

    return { total, change }
  }

  // Obtener estadísticas de clientes
  const getCustomerStats = () => {
    // Contar clientes únicos con ventas completadas
    const uniqueCustomers = new Set()

    sales
      .filter((sale) => sale.status === "completed")
      .forEach((sale) => {
        if (sale.customerId) {
          uniqueCustomers.add(sale.customerId)
        }
      })

    const total = uniqueCustomers.size

    // Simular un cambio respecto al mes anterior
    const change = 10.1 // En una aplicación real, esto se calcularía

    return { total, change }
  }

  // Obtener estadísticas de productos
  const getProductStats = () => {
    // Contar cantidad total de productos vendidos
    const total = sales
      .filter((sale) => sale.status === "completed")
      .reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
      }, 0)

    // Simular un cambio respecto al mes anterior
    const change = 19.0 // En una aplicación real, esto se calcularía

    return { total, change }
  }

  // Obtener estadísticas de ganancias
  const getProfitStats = () => {
    // Calcular ganancias totales (estimado como 50% de las ventas)
    const total = sales.filter((sale) => sale.status === "completed").reduce((sum, sale) => sum + sale.total * 0.5, 0)

    // Simular un cambio respecto al mes anterior
    const change = 15.0 // En una aplicación real, esto se calcularía

    return { total, change }
  }

  return (
    <SalesContext.Provider
      value={{
        sales,
        logs,
        addSale,
        updateSale,
        deleteSale,
        getSaleById,
        getLogs,
        getMonthlyRevenue,
        getTopProducts,
        getCustomerDistribution,
        getRevenueStats,
        getCustomerStats,
        getProductStats,
        getProfitStats,
      }}
    >
      {children}
    </SalesContext.Provider>
  )
}

export function useSales() {
  const context = useContext(SalesContext)
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider")
  }
  return context
}
