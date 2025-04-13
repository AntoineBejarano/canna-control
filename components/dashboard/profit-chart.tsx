"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { useSales } from "@/contexts/sales-context"

export function ProfitChart() {
  const { getMonthlyRevenue } = useSales()
  const monthlyData = getMonthlyRevenue()

  // Transformar los datos para el gráfico de área
  const data = monthlyData.map((month) => ({
    name: month.name,
    ingresos: month.ventas,
    costos: month.ventas - month.ganancias,
    ganancias: month.ganancias,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, ""]} />
        <Legend />
        <Area type="monotone" dataKey="ingresos" stackId="1" stroke="#4ade80" fill="#4ade80" name="Ingresos" />
        <Area type="monotone" dataKey="costos" stackId="1" stroke="#f87171" fill="#f87171" name="Costos" />
        <Area type="monotone" dataKey="ganancias" stroke="#60a5fa" fill="#60a5fa" name="Excedente" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
