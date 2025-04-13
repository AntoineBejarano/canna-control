"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { useSales } from "@/contexts/sales-context"

export function ProductsChart() {
  const { getTopProducts } = useSales()
  const data = getTopProducts()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} unidades`, "Cantidad vendida"]} />
        <Legend />
        <Bar dataKey="cantidad" fill="#4ade80" name="Unidades vendidas" />
      </BarChart>
    </ResponsiveContainer>
  )
}
