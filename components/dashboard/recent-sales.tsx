"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSales } from "@/contexts/sales-context"

export function RecentSales() {
  const { sales } = useSales()

  // Obtener las 5 dispensaciones más recientes completadas
  const recentSales = sales
    .filter((sale) => sale.status === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Función para obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
            <AvatarFallback>{getInitials(sale.customerName)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customerName}</p>
            <p className="text-sm text-muted-foreground">Dispensación #{sale.id}</p>
          </div>
          <div className="ml-auto font-medium">+${sale.total.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
