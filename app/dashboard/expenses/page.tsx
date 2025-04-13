"use client"

import { useState } from "react"
import { useExpenses } from "@/contexts/expenses-context"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Search, Filter, Edit, Trash2, FileText } from "lucide-react"
import { EditExpenseDialog } from "@/components/expenses/edit-expense-dialog"

export default function ExpensesPage() {
  const { expenses, deleteExpense } = useExpenses()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filtrar gastos
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Ordenar gastos por fecha (más recientes primero)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Función para formatear el monto
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  // Función para obtener el texto de la categoría
  const getCategoryText = (category: string) => {
    switch (category) {
      case "product":
        return "Productos"
      case "beverages":
        return "Bebidas"
      case "rent":
        return "Alquiler"
      case "taxes":
        return "Impuestos"
      case "affiliates":
        return "Afiliados"
      case "utilities":
        return "Servicios"
      case "salaries":
        return "Salarios"
      case "marketing":
        return "Marketing"
      case "other":
        return "Otros"
      default:
        return category
    }
  }

  // Función para obtener el texto del método de pago
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "Efectivo"
      case "card":
        return "Tarjeta"
      case "transfer":
        return "Transferencia"
      case "check":
        return "Cheque"
      default:
        return method
    }
  }

  // Función para obtener la clase de color según el estado
  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600"
      case "pending":
        return "text-amber-600"
      case "cancelled":
        return "text-red-600"
      default:
        return ""
    }
  }

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Gastos</h1>
        <AddExpenseDialog />
      </div>

      <div className="bg-card rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar gastos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="product">Productos</SelectItem>
                  <SelectItem value="beverages">Bebidas</SelectItem>
                  <SelectItem value="rent">Alquiler</SelectItem>
                  <SelectItem value="taxes">Impuestos</SelectItem>
                  <SelectItem value="affiliates">Afiliados</SelectItem>
                  <SelectItem value="utilities">Servicios</SelectItem>
                  <SelectItem value="salaries">Salarios</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="paid">Pagado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No se encontraron gastos
                  </TableCell>
                </TableRow>
              ) : (
                sortedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{format(new Date(expense.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{getCategoryText(expense.category)}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{formatAmount(expense.amount)}</TableCell>
                    <TableCell>{getPaymentMethodText(expense.paymentMethod)}</TableCell>
                    <TableCell>
                      <span className={getStatusClass(expense.status)}>{getStatusText(expense.status)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" title="Ver detalles">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <EditExpenseDialog
                          expense={expense}
                          trigger={
                            <Button variant="outline" size="icon" title="Editar gasto">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          title="Eliminar gasto"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
