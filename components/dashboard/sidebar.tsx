"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, LineChart, Users, Settings, LogOut, Cannabis } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventario",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Ventas",
    href: "/dashboard/sales",
    icon: LineChart,
  },
  {
    title: "Socios",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Empleados",
    href: "/dashboard/employees",
    icon: Users,
  },
  {
    title: "Caja",
    href: "/dashboard/cash-register",
    icon: LayoutDashboard,
  },
  {
    title: "Base de Datos",
    href: "/dashboard/database",
    icon: LayoutDashboard,
  },
  {
    title: "Ajustes",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold px-2">
          <Cannabis className="h-6 w-6" />
          <span>CannaControl</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {sidebarNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="block w-full">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === item.href ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-3 border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </Button>
      </div>
    </div>
  )
}
