"use client"

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts"
import { useSales } from "@/contexts/sales-context"

export function CustomersChart() {
  const { getCustomerDistribution } = useSales()
  const data = getCustomerDistribution()

  const COLORS = ["#4ade80", "#60a5fa"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}`, "Cantidad"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
