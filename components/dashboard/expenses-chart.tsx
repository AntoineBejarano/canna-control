"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useTheme } from "next-themes"

import { useExpenses } from "@/contexts/expenses-context"

export function ExpensesChart() {
  const { expenses } = useExpenses()
  const [chartData, setChartData] = useState<any[]>([])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    // Agrupar gastos por categoría
    const expensesByCategory = expenses.reduce(
      (acc, expense) => {
        if (expense.status !== "cancelled") {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        }
        return acc
      },
      {} as Record<string, number>,
    )

    // Convertir a formato para el gráfico
    const data = Object.entries(expensesByCategory).map(([category, amount]) => ({
      category: translateCategory(category),
      amount,
    }))

    // Ordenar por monto (de mayor a menor)
    data.sort((a, b) => b.amount - a.amount)

    setChartData(data)
  }, [expenses])

  // Función para traducir categorías
  const translateCategory = (category: string) => {
    switch (category) {
      case "product":
        return "Productos"
      case "beverages":
        return "Bebidas"
      case "rent":
        return "Alquiler"
      case "taxes":
        return "Impuestos"
      case "affiliates":
        return "Afiliados"
      case "utilities":
        return "Servicios"
      case "salaries":
        return "Salarios"
      case "marketing":
        return "Marketing"
      case "other":
        return "Otros"
      default:
        return category
    }
  }

  // Formateador para los valores del eje Y
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`
    }
    return `$${value}`
  }

  // Formateador para el tooltip
  const formatTooltip = (value: number) => {
    return [`$${value.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Monto"]
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="category"
          stroke={isDark ? "#888888" : "#888888"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={isDark ? "#888888" : "#888888"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatYAxis}
        />
        <Tooltip
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            borderRadius: "0.375rem",
            color: isDark ? "#f3f4f6" : "#1f2937",
          }}
        />
        <Bar dataKey="amount" fill={isDark ? "#3b82f6" : "#3b82f6"} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
