"use client"

import { useState } from "react"
import { useCustomers, type Customer } from "@/contexts/customer-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AddCustomerDialog } from "@/components/customers/add-customer-dialog"
import { EditCustomerDialog } from "@/components/customers/edit-customer-dialog"
import { CustomerDetailDialog } from "@/components/customers/customer-detail-dialog"
import { Search, UserPlus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CustomersPage() {
  const { customers, deleteCustomer } = useCustomers()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  // Filtrar socios según el término de búsqueda
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  )

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

  // Manejar la edición de un socio
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowEditDialog(true)
  }

  // Manejar la visualización de detalles de un socio
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowDetailDialog(true)
  }

  // Manejar la eliminación de un socio
  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowDeleteDialog(true)
  }

  // Confirmar la eliminación de un socio
  const confirmDelete = () => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id)
      setShowDeleteDialog(false)
      setSelectedCustomer(null)
    }
  }

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Socios</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir socio
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por nombre, email o teléfono..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Socio</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No se encontraron socios con los criterios de búsqueda.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewDetails(customer)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {customer.imageUrl ? (
                          <AvatarImage src={customer.imageUrl} alt={customer.name} />
                        ) : (
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${customer.avatar}`} />
                        )}
                        <AvatarFallback>{customer.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.city ? `${customer.city}` : "Sin ubicación"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(customer.type)}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>${customer.balance.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetails(customer)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(customer)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(customer)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogos */}
      <AddCustomerDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {selectedCustomer && (
        <>
          <EditCustomerDialog open={showEditDialog} onOpenChange={setShowEditDialog} customer={selectedCustomer} />

          <CustomerDetailDialog
            open={showDetailDialog}
            onOpenChange={setShowDetailDialog}
            customer={selectedCustomer}
            onEdit={() => {
              setShowDetailDialog(false)
              setShowEditDialog(true)
            }}
          />

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente al socio {selectedCustomer.name} y no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
