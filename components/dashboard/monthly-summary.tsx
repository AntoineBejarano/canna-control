"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Download, FileText, TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"
import { useSales } from "@/contexts/sales-context"
import { useExpenses } from "@/contexts/expenses-context"
import { Badge } from "@/components/ui/badge"

// Colores para los gráficos
const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#fbbf24", "#a78bfa", "#34d399", "#fb923c", "#94a3b8"]

export function MonthlySummary() {
  // Estados para el mes y año seleccionados
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Obtener datos de dispensaciones y gastos
  const { sales } = useSales()
  const { expenses } = useExpenses()

  // Filtrar datos por mes y año seleccionados
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date)
    return (
      saleDate.getMonth() === Number.parseInt(selectedMonth) &&
      saleDate.getFullYear() === Number.parseInt(selectedYear) &&
      sale.status === "completed"
    )
  })

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getMonth() === Number.parseInt(selectedMonth) &&
      expenseDate.getFullYear() === Number.parseInt(selectedYear) &&
      expense.status === "paid"
    )
  })

  // Calcular totales
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netProfit = totalSales - totalExpenses

  // Calcular dispensaciones por día del mes
  const salesByDay: Record<number, number> = {}
  filteredSales.forEach((sale) => {
    const day = new Date(sale.date).getDate()
    salesByDay[day] = (salesByDay[day] || 0) + sale.total
  })

  const dailySalesData = Object.entries(salesByDay)
    .map(([day, amount]) => ({
      day: Number.parseInt(day),
      amount,
    }))
    .sort((a, b) => a.day - b.day)

  // Calcular gastos por categoría
  const expensesByCategory: Record<string, number> = {}
  filteredExpenses.forEach((expense) => {
    expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount
  })

  const expensesByCategoryData = Object.entries(expensesByCategory)
    .map(([category, amount]) => {
      let categoryName = category
      switch (category) {
        case "product":
          categoryName = "Productos"
          break
        case "beverages":
          categoryName = "Bebidas"
          break
        case "rent":
          categoryName = "Alquiler"
          break
        case "taxes":
          categoryName = "Impuestos"
          break
        case "affiliates":
          categoryName = "Afiliados"
          break
        case "utilities":
          categoryName = "Servicios"
          break
        case "salaries":
          categoryName = "Salarios"
          break
        case "marketing":
          categoryName = "Marketing"
          break
        case "other":
          categoryName = "Otros"
          break
      }
      return { name: categoryName, value: amount }
    })
    .filter((item) => item.value > 0) // Solo incluir categorías con valores positivos

  // Calcular productos más dispensados
  const productSales: Record<number, { quantity: number; revenue: number }> = {}
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { quantity: 0, revenue: 0 }
      }
      productSales[item.productId].quantity += item.quantity
      productSales[item.productId].revenue += item.total
    })
  })

  const topProducts = Object.entries(productSales)
    .map(([productId, data]) => {
      let productName = "Producto #" + productId
      switch (Number.parseInt(productId)) {
        case 1:
          productName = "OG Kush"
          break
        case 2:
          productName = "Blue Dream"
          break
        case 3:
          productName = "Gummies CBD"
          break
        case 4:
          productName = "Sour Diesel"
          break
        case 5:
          productName = "Vaporizador Premium"
          break
        case 6:
          productName = "Girl Scout Cookies"
          break
      }
      return {
        productId: Number.parseInt(productId),
        productName,
        quantity: data.quantity,
        revenue: data.revenue,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Función para generar el reporte
  const generateReport = () => {
    alert("Generando reporte para " + getMonthName(Number.parseInt(selectedMonth)) + " " + selectedYear)
    // Aquí iría la lógica para generar y descargar el reporte
  }

  // Función para obtener el nombre del mes
  const getMonthName = (monthIndex: number): string => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return months[monthIndex]
  }

  // Generar años para el selector (desde 2020 hasta el año actual)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => (2020 + i).toString())

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resumen Mensual</h2>
          <p className="text-muted-foreground">
            Análisis detallado para {getMonthName(Number.parseInt(selectedMonth))} {selectedYear}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Enero</SelectItem>
              <SelectItem value="1">Febrero</SelectItem>
              <SelectItem value="2">Marzo</SelectItem>
              <SelectItem value="3">Abril</SelectItem>
              <SelectItem value="4">Mayo</SelectItem>
              <SelectItem value="5">Junio</SelectItem>
              <SelectItem value="6">Julio</SelectItem>
              <SelectItem value="7">Agosto</SelectItem>
              <SelectItem value="8">Septiembre</SelectItem>
              <SelectItem value="9">Octubre</SelectItem>
              <SelectItem value="10">Noviembre</SelectItem>
              <SelectItem value="11">Diciembre</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generateReport} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Generar Reporte</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="sales">Dispensado</TabsTrigger>
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dispensado del Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalSales.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">{filteredSales.length} transacciones</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalExpenses.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">{filteredExpenses.length} transacciones</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Excedente Neto</CardTitle>
                {netProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${netProfit.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Margen: {totalSales > 0 ? Math.round((netProfit / totalSales) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Dispensado Diario</CardTitle>
                <CardDescription>Distribución de dispensado por día del mes</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {dailySalesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Dispensado"]} />
                      <Bar dataKey="amount" fill="#4ade80" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No hay datos de dispensado para este mes</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
                <CardDescription>Distribución de gastos por categoría</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {expensesByCategoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensesByCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                          "Gasto",
                        ]}
                        labelFormatter={(name) => `Categoría: ${name}`}
                      />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No hay datos de gastos para este mes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Productos Más Dispensados</CardTitle>
              <CardDescription>Top 5 productos por ingresos generados</CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-muted-foreground">{product.quantity} unidades dispensadas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          $
                          {product.revenue.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((product.revenue / totalSales) * 100)}% del total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">No hay datos de productos para este mes</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Ver Informe Completo de Productos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado de Dispensado</CardTitle>
              <CardDescription>Información detallada sobre el dispensado del mes</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Análisis detallado de dispensado estará disponible aquí</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado de Gastos</CardTitle>
              <CardDescription>
                Desglose de gastos por categoría para {getMonthName(Number.parseInt(selectedMonth))} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expensesByCategoryData.length > 0 ? (
                <div className="space-y-8">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={expensesByCategoryData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip
                          formatter={(value) => [
                            `$${value.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            "Gasto",
                          ]}
                        />
                        <Bar dataKey="value" fill="#f87171" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 p-4 font-medium">
                      <div>Categoría</div>
                      <div className="text-center">Monto</div>
                      <div className="text-right">% del Total</div>
                    </div>
                    <div className="divide-y">
                      {expensesByCategoryData
                        .sort((a, b) => b.value - a.value)
                        .map((item) => (
                          <div key={item.name} className="grid grid-cols-3 p-4">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-center">
                              $
                              {item.value.toLocaleString("es-ES", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                            <div className="text-right">
                              {totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0}%
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 p-4 font-medium bg-muted">
                      <div>Total</div>
                      <div className="text-center">
                        ${totalExpenses.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-right">100%</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center">
                  <p className="text-muted-foreground">No hay datos de gastos para este mes</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full gap-2" onClick={generateReport}>
                <Download className="h-4 w-4" />
                Exportar Informe de Gastos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado de Productos</CardTitle>
              <CardDescription>Información detallada sobre el rendimiento de los productos</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Análisis detallado de productos estará disponible aquí</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
