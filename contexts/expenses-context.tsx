"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

// Definir tipos
export type ExpenseCategory =
  | "product"
  | "beverages"
  | "rent"
  | "taxes"
  | "affiliates"
  | "utilities"
  | "salaries"
  | "marketing"
  | "other"

export type PaymentMethod = "cash" | "card" | "transfer" | "check"
export type ExpenseStatus = "paid" | "pending" | "cancelled"

export interface Expense {
  id: string
  date: string // formato: "YYYY-MM-DD"
  category: ExpenseCategory
  description: string
  amount: number
  paymentMethod: PaymentMethod
  status: ExpenseStatus
  notes?: string
}

export interface ExpenseLog {
  id: string
  timestamp: string
  action: "create" | "update" | "delete"
  expenseId: string
  details: string
  previousData?: Partial<Expense>
  newData?: Partial<Expense>
}

interface ExpenseStats {
  total: number
  change: number
  byCategory: Record<ExpenseCategory, number>
}

interface ExpensesContextType {
  expenses: Expense[]
  expenseLogs: ExpenseLog[]
  addExpense: (expense: Omit<Expense, "id">) => void
  updateExpense: (id: string, expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  getExpenseById: (id: string) => Expense | undefined
  getExpenseStats: () => ExpenseStats
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined)

// Datos de ejemplo para gastos
const initialExpenses: Expense[] = [
  {
    id: "exp-1",
    date: "2023-03-10",
    category: "product",
    description: "Compra de flores premium",
    amount: 1500,
    paymentMethod: "transfer",
    status: "paid",
  },
  {
    id: "exp-2",
    date: "2023-03-15",
    category: "rent",
    description: "Alquiler mensual del local",
    amount: 2000,
    paymentMethod: "transfer",
    status: "paid",
  },
  {
    id: "exp-3",
    date: "2023-03-20",
    category: "utilities",
    description: "Factura de electricidad",
    amount: 350,
    paymentMethod: "card",
    status: "paid",
  },
  {
    id: "exp-4",
    date: "2023-03-25",
    category: "salaries",
    description: "Salarios del personal",
    amount: 3500,
    paymentMethod: "transfer",
    status: "paid",
  },
  {
    id: "exp-5",
    date: "2023-04-01",
    category: "taxes",
    description: "Impuestos trimestrales",
    amount: 1200,
    paymentMethod: "transfer",
    status: "pending",
  },
  {
    id: "exp-6",
    date: "2023-04-05",
    category: "marketing",
    description: "Campaña publicitaria en redes sociales",
    amount: 500,
    paymentMethod: "card",
    status: "paid",
  },
  {
    id: "exp-7",
    date: "2023-04-10",
    category: "beverages",
    description: "Compra de bebidas para el club",
    amount: 800,
    paymentMethod: "cash",
    status: "paid",
  },
  {
    id: "exp-8",
    date: "2023-04-15",
    category: "affiliates",
    description: "Comisiones a afiliados",
    amount: 450,
    paymentMethod: "transfer",
    status: "pending",
  },
]

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [expenseLogs, setExpenseLogs] = useState<ExpenseLog[]>([])

  // Cargar datos del localStorage si existen
  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses")
    const storedLogs = localStorage.getItem("expenseLogs")

    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses))
    }

    if (storedLogs) {
      setExpenseLogs(JSON.parse(storedLogs))
    }
  }, [])

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem("expenseLogs", JSON.stringify(expenseLogs))
  }, [expenseLogs])

  // Función para añadir un nuevo gasto
  const addExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4(),
    }

    setExpenses((prevExpenses) => [...prevExpenses, newExpense])

    // Registrar en el log
    const log: ExpenseLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action: "create",
      expenseId: newExpense.id,
      details: `Gasto creado: ${newExpense.description}`,
      newData: newExpense,
    }

    setExpenseLogs((prevLogs) => [...prevLogs, log])
  }

  // Función para actualizar un gasto existente
  const updateExpense = (id: string, expenseData: Omit<Expense, "id">) => {
    const expenseToUpdate = expenses.find((expense) => expense.id === id)

    if (!expenseToUpdate) return

    const updatedExpense: Expense = {
      ...expenseData,
      id,
    }

    setExpenses((prevExpenses) => prevExpenses.map((expense) => (expense.id === id ? updatedExpense : expense)))

    // Registrar en el log
    const log: ExpenseLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action: "update",
      expenseId: id,
      details: `Gasto actualizado: ${updatedExpense.description}`,
      previousData: expenseToUpdate,
      newData: updatedExpense,
    }

    setExpenseLogs((prevLogs) => [...prevLogs, log])
  }

  // Función para eliminar un gasto
  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find((expense) => expense.id === id)

    if (!expenseToDelete) return

    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id))

    // Registrar en el log
    const log: ExpenseLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action: "delete",
      expenseId: id,
      details: `Gasto eliminado: ${expenseToDelete.description}`,
      previousData: expenseToDelete,
    }

    setExpenseLogs((prevLogs) => [...prevLogs, log])
  }

  // Función para obtener un gasto por su ID
  const getExpenseById = (id: string) => {
    return expenses.find((expense) => expense.id === id)
  }

  // Función para obtener estadísticas de gastos
  const getExpenseStats = (): ExpenseStats => {
    // Calcular el total de gastos
    const total = expenses.reduce((sum, expense) => {
      if (expense.status !== "cancelled") {
        return sum + expense.amount
      }
      return sum
    }, 0)

    // Calcular gastos por categoría
    const byCategory = expenses.reduce(
      (acc, expense) => {
        if (expense.status !== "cancelled") {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        }
        return acc
      },
      {} as Record<ExpenseCategory, number>,
    )

    // Calcular el cambio porcentual respecto al mes pasado
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear &&
        expense.status !== "cancelled"
      )
    })

    const previousMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getMonth() === previousMonth &&
        expenseDate.getFullYear() === previousYear &&
        expense.status !== "cancelled"
      )
    })

    const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    let change = 0
    if (previousMonthTotal > 0) {
      change = Math.round(((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100)
    }

    return {
      total,
      change,
      byCategory,
    }
  }

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        expenseLogs,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenseById,
        getExpenseStats,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  )
}

export const useExpenses = () => {
  const context = useContext(ExpensesContext)
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpensesProvider")
  }
  return context
}
