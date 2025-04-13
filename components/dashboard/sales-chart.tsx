"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useSales } from "@/contexts/sales-context"

export function SalesChart() {
  const { getMonthlyRevenue } = useSales()
  const data = getMonthlyRevenue()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, ""]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="ventas"
          stroke="#4ade80"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Dispensado"
        />
        <Line type="monotone" dataKey="ganancias" stroke="#60a5fa" strokeWidth={2} name="Excedente" />
      </LineChart>
    </ResponsiveContainer>
  )
}
