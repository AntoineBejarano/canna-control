"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useSales } from "@/contexts/sales-context"

export function Overview() {
  const { getMonthlyRevenue } = useSales()
  const data = getMonthlyRevenue()

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value) => [`$${value.toFixed(2)}`, "Dispensado"]}
          labelFormatter={(label) => `Mes: ${label}`}
        />
        <Bar dataKey="ventas" fill="#4ade80" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
