"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Menu, Search, LogOut, User, Settings, LayoutDashboard } from "lucide-react"
import { Sidebar } from "./sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { mockNotifications } from "@/lib/mockdata"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggleSimple } from "@/components/theme-toggle-simple"

export function Header() {
  const { user, logout } = useAuth()
  const unreadNotifications = mockNotifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 text-left">
              <SheetTitle className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </div>
                <span>CannaControl</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Buscar..." className="w-full pl-8" />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {/* Cambiamos al botón simple */}
        <ThemeToggleSimple />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                  {unreadNotifications}
                </Badge>
              )}
              <span className="sr-only">Notificaciones</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Notificaciones</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)] mt-4">
              {mockNotifications.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">No tienes notificaciones</div>
              ) : (
                <div className="space-y-2">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-md ${notification.read ? "bg-background" : "bg-muted/50"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        <Badge
                          variant={
                            notification.type === "warning"
                              ? "destructive"
                              : notification.type === "success"
                                ? "default"
                                : "secondary"
                          }
                          className="ml-2"
                        >
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.date).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="py-4 text-center">
                <Button variant="outline" className="w-full">
                  Ver todas las notificaciones
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Añadir botón de logout visible */}
        <Button variant="outline" size="icon" onClick={logout} className="hidden md:flex">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Cerrar sesión</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback>{user?.avatar || "U"}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Perfil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
