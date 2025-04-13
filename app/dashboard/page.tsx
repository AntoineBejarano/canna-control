"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { PurchaseRecommendations } from "@/components/dashboard/purchase-recommendations"
import { MonthlySummary } from "@/components/dashboard/monthly-summary"
import { DollarSign, Package, CreditCard, Wallet } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useSales } from "@/contexts/sales-context"
import { useExpenses } from "@/contexts/expenses-context"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { getRevenueStats, getCustomerStats, getProductStats } = useSales()
  const { getExpenseStats } = useExpenses()

  // Estado local solo para el dispensario
  const [dispensaryName, setDispensaryName] = useState("")

  // Actualizar el estado local cuando cambia el usuario
  useEffect(() => {
    if (user && user.dispensary) {
      setDispensaryName(user.dispensary.name || "")
    }
  }, [user])

  const revenueStats = getRevenueStats()
  const customerStats = getCustomerStats()
  const productStats = getProductStats()
  const expenseStats = getExpenseStats()

  // Calcular ingresos netos (dispensaciones - gastos)
  const netProfit = revenueStats.total - expenseStats.total
  const netProfitChange = revenueStats.change - expenseStats.change

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Bienvenido</h1>
      <p className="text-muted-foreground">Aquí tienes un resumen de tu dispensario {dispensaryName}.</p>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="monthly">Resumen por Meses</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dispensado total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${revenueStats.total.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">+{revenueStats.change}% respecto al mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos totales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${expenseStats.total.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {expenseStats.change >= 0 ? "+" : ""}
                  {expenseStats.change}% respecto al mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Excedente neto</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${netProfit.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {netProfitChange >= 0 ? "+" : ""}
                  {netProfitChange.toFixed(1)}% respecto al mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productos dispensados</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{productStats.total.toLocaleString("es-ES")}</div>
                <p className="text-xs text-muted-foreground">+{productStats.change}% respecto al mes pasado</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen de dispensado</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Dispensado reciente</CardTitle>
                <CardDescription>Visualiza tu dispensado más reciente.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            <PurchaseRecommendations />
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlySummary />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis avanzado</CardTitle>
              <CardDescription>Visualiza tendencias detalladas de tu dispensado y productos.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Gráficos de análisis detallados estarán disponibles aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
