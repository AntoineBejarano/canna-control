"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Customer } from "@/contexts/customer-context"
// Importar el componente ManageBalanceDialog
import { ManageBalanceDialog } from "./manage-balance-dialog"
import { useState, useEffect } from "react"
import { useCustomers } from "@/contexts/customer-context"

interface CustomerDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
  onEdit: () => void
  isAdmin?: boolean
}

export function CustomerDetailDialog({
  open,
  onOpenChange,
  customer: initialCustomer,
  onEdit,
  isAdmin = true,
}: CustomerDetailDialogProps) {
  // Usar un estado local para el socio que se actualiza
  const [customer, setCustomer] = useState<Customer>(initialCustomer)
  const { getCustomerById } = useCustomers()

  // Actualizar el socio cuando cambie el socio inicial o cuando se abra el diálogo
  useEffect(() => {
    if (open && initialCustomer.id) {
      const updatedCustomer = getCustomerById(initialCustomer.id)
      if (updatedCustomer) {
        setCustomer(updatedCustomer)
      }
    }
  }, [open, initialCustomer, getCustomerById])

  // Función para mostrar el estado del socio
  const getStatusBadge = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Activo</Badge>
      case "inactive":
        return <Badge className="bg-yellow-500">Inactivo</Badge>
      default:
        return null
    }
  }

  // Función para mostrar el tipo de socio
  const getTypeBadge = (type: Customer["type"]) => {
    switch (type) {
      case "medical":
        return <Badge variant="outline">Médico</Badge>
      case "recreational":
        return <Badge variant="secondary">Recreativo</Badge>
      case "both":
        return (
          <Badge variant="outline" className="bg-primary/10">
            Ambos
          </Badge>
        )
      default:
        return null
    }
  }

  // Datos simulados para el historial de compras
  const purchaseHistory = [
    {
      id: 1,
      date: "15/03/2025",
      products: "OG Kush (3.5g), Vape Pen",
      total: 85.5,
    },
    {
      id: 2,
      date: "28/02/2025",
      products: "Blue Dream (7g), Edibles",
      total: 120.75,
    },
    {
      id: 3,
      date: "10/02/2025",
      products: "Sour Diesel (1g), Rolling Papers",
      total: 25.99,
    },
    {
      id: 4,
      date: "25/01/2025",
      products: "Purple Haze (3.5g)",
      total: 45.0,
    },
  ]

  // Datos simulados para las notas
  const notes = [
    {
      id: 1,
      date: "15/03/2025",
      author: "Juan Pérez",
      content: "Socio prefiere productos con alto contenido de CBD para dolor crónico.",
    },
    {
      id: 2,
      date: "28/02/2025",
      author: "María García",
      content: "Solicitó información sobre nuevos productos comestibles.",
    },
  ]

  // Añadir estado para controlar la apertura del diálogo de gestión de saldo
  const [showManageBalance, setShowManageBalance] = useState(false)

  // Función para actualizar el socio después de modificar el saldo
  const handleBalanceUpdate = () => {
    if (customer.id) {
      const updatedCustomer = getCustomerById(customer.id)
      if (updatedCustomer) {
        setCustomer(updatedCustomer)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalles del socio</DialogTitle>
          <DialogDescription>Información completa del socio y su historial.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4 max-h-[calc(90vh-10rem)]">
          <div className="flex flex-col md:flex-row gap-4 items-start mb-6">
            <Avatar className="w-20 h-20">
              {customer.imageUrl ? (
                <AvatarImage src={customer.imageUrl} alt={customer.name} />
              ) : (
                <AvatarImage src={`/placeholder.svg?height=80&width=80&text=${customer.avatar}`} />
              )}
              <AvatarFallback className="text-2xl">{customer.avatar}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{customer.name}</h3>
              <div className="flex flex-wrap gap-2">
                {getTypeBadge(customer.type)}
                {getStatusBadge(customer.status)}
              </div>
              <p className="text-muted-foreground">{customer.email}</p>
              <p className="text-muted-foreground">{customer.phone}</p>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="info" className="flex-1">
                Información
              </TabsTrigger>
              <TabsTrigger value="purchases" className="flex-1">
                Compras
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="notes" className="flex-1">
                  Notas
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="info" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saldo disponible</CardTitle>
                  <CardDescription>Saldo que el socio puede utilizar en futuras compras.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">${customer.balance.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Saldo actual</p>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowManageBalance(true)
                          }}
                        >
                          Gestionar saldo
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Información personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-sm text-muted-foreground">{customer.address || "No disponible"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fecha de nacimiento</p>
                      <p className="text-sm text-muted-foreground">{customer.birthDate || "No disponible"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fecha de registro</p>
                      <p className="text-sm text-muted-foreground">{customer.registrationDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Última visita</p>
                      <p className="text-sm text-muted-foreground">{customer.lastVisit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información médica</CardTitle>
                    <CardDescription>Detalles sobre la condición médica del socio.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Condición médica</p>
                      <p className="text-sm text-muted-foreground">{customer.medicalCondition || "No disponible"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Número de tarjeta médica</p>
                      <p className="text-sm text-muted-foreground">{customer.medicalCardNumber || "No disponible"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fecha de vencimiento</p>
                      <p className="text-sm text-muted-foreground">{customer.medicalCardExpiry || "No disponible"}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas</CardTitle>
                    <CardDescription>Resumen de la actividad del socio.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Total gastado</p>
                        <p className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Visitas</p>
                        <p className="text-2xl font-bold">{customer.visits}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Valor promedio</p>
                        <p className="text-2xl font-bold">
                          ${(customer.totalSpent / (customer.visits || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="purchases" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de compras</CardTitle>
                  <CardDescription>Últimas compras realizadas por el socio.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseHistory.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell>{purchase.date}</TableCell>
                          <TableCell>{purchase.products}</TableCell>
                          <TableCell className="text-right">${purchase.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            {isAdmin && (
              <TabsContent value="notes" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notas</CardTitle>
                    <CardDescription>Notas internas sobre el socio.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notes.map((note) => (
                        <div key={note.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{note.author}</p>
                            <p className="text-sm text-muted-foreground">{note.date}</p>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {isAdmin && (
            <Button
              onClick={() => {
                onEdit()
                onOpenChange(false)
              }}
            >
              Editar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      {isAdmin && showManageBalance && (
        <ManageBalanceDialog
          open={showManageBalance}
          onOpenChange={(open) => {
            setShowManageBalance(open)
            if (!open) {
              // Actualizar el socio cuando se cierra el diálogo de gestión de saldo
              handleBalanceUpdate()
            }
          }}
          customer={customer}
        />
      )}
    </Dialog>
  )
}
