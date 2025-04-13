"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  History,
  Filter,
  X,
  CreditCard,
  DollarSign,
  BanknoteIcon,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpDown,
  Calendar,
  User,
  Package,
  Receipt,
} from "lucide-react"
import { useSales, type Sale } from "@/contexts/sales-context"
import { useCustomers } from "@/contexts/customer-context"
// Asegurarse de que la importación del componente AddSaleDialog es correcta
import { AddSaleDialog } from "@/components/sales/add-sale-dialog"
import { EditSaleDialog } from "@/components/sales/edit-sale-dialog"
import { SalesLogsDialog } from "@/components/sales/sales-logs-dialog"
import { format } from "date-fns"
import { Combobox } from "@/components/ui/combobox"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"

// Importar el archivo CSS
import "./sales.css"
import { TableContainer } from "@/components/ui/table-container"

export default function SalesPage() {
  const { sales, deleteSale } = useSales()
  const { customers, updateCustomerStats } = useCustomers()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showLogsDialog, setShowLogsDialog] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [deletingSaleId, setDeletingSaleId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Filtrar ventas según la búsqueda, el cliente seleccionado y la pestaña activa
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.id.toString().includes(searchQuery.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.total.toString().includes(searchQuery.toLowerCase())

    const matchesCustomer = selectedCustomerId ? sale.customerId?.toString() === selectedCustomerId : true

    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "completed"
          ? sale.status === "completed"
          : activeTab === "pending"
            ? sale.status === "pending"
            : activeTab === "cancelled"
              ? sale.status === "cancelled"
              : true

    return matchesSearch && matchesCustomer && matchesTab
  })

  // Ordenar ventas por fecha (más recientes primero)
  const sortedSales = [...filteredSales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Función para mostrar el estado de la venta con iconos
  const getStatusBadge = (status: Sale["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 flex items-center gap-1 px-2 py-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {!isMobile && "Completada"}
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500 flex items-center gap-1 px-2 py-1">
            <Clock className="h-3.5 w-3.5" />
            {!isMobile && "Pendiente"}
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-500 flex items-center gap-1 px-2 py-1">
            <XCircle className="h-3.5 w-3.5" />
            {!isMobile && "Cancelada"}
          </Badge>
        )
      default:
        return null
    }
  }

  // Función para mostrar el método de pago con iconos
  const getPaymentMethodIcon = (method: Sale["paymentMethod"]) => {
    switch (method) {
      case "cash":
        return <DollarSign className="h-4 w-4 text-green-600" title="Efectivo" />
      case "card":
        return <CreditCard className="h-4 w-4 text-blue-600" title="Tarjeta" />
      case "transfer":
        return <BanknoteIcon className="h-4 w-4 text-purple-600" title="Transferencia" />
      default:
        return null
    }
  }

  // Manejar la eliminación de una venta
  const handleDelete = () => {
    if (deletingSaleId !== null) {
      deleteSale(deletingSaleId)
      // Actualizar estadísticas de clientes después de eliminar una venta
      updateCustomerStats()
      setDeletingSaleId(null)
    }
  }

  // Preparar opciones de clientes para el combobox
  const customerOptions = [
    { label: "Todos los clientes", value: "", disabled: false },
    ...customers.map((customer) => ({
      label: customer.name,
      value: customer.id.toString(),
      disabled: false,
    })),
  ]

  // Limpiar filtros
  const clearFilters = () => {
    setSelectedCustomerId("")
    setShowFilters(false)
  }

  // Obtener conteos para las pestañas
  const completedCount = sales.filter((sale) => sale.status === "completed").length
  const pendingCount = sales.filter((sale) => sale.status === "pending").length
  const cancelledCount = sales.filter((sale) => sale.status === "cancelled").length

  // Renderizar la vista móvil con tarjetas
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-4">
      {sortedSales.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No hay ventas</h3>
          <Button className="mt-4" size="lg" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Nueva venta
          </Button>
        </div>
      ) : (
        sortedSales.map((sale) => (
          <Card
            key={sale.id}
            className="overflow-hidden border-l-4"
            style={{
              borderLeftColor:
                sale.status === "completed"
                  ? "rgb(34, 197, 94)"
                  : sale.status === "pending"
                    ? "rgb(234, 179, 8)"
                    : "rgb(239, 68, 68)",
            }}
          >
            <CardContent className="p-0">
              <div className="flex justify-between items-center p-4 bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="font-bold">#{sale.id}</span>
                  {getStatusBadge(sale.status)}
                </div>
                <div className="text-xl font-bold">${sale.total.toFixed(2)}</div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(sale.date), "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">{getPaymentMethodIcon(sale.paymentMethod)}</div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{sale.customerName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">
                    {sale.items.map((item, index) => (
                      <span key={index}>
                        {index > 0 && ", "}
                        {item.quantity}x #{item.productId}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              <div className="flex border-t">
                <Button variant="ghost" className="flex-1 rounded-none h-12" onClick={() => setEditingSale(sale)}>
                  <Edit className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 rounded-none h-12 text-destructive hover:text-destructive"
                  onClick={() => setDeletingSaleId(sale.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )

  // Renderizar la vista de escritorio con tabla
  const renderDesktopView = () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No se encontraron ventas
              </TableCell>
            </TableRow>
          ) : (
            sortedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">#{sale.id}</TableCell>
                <TableCell>{format(new Date(sale.date), "dd/MM/yyyy")}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate max-w-[150px]">
                      {sale.items.map((item, index) => (
                        <span key={index}>
                          {index > 0 && ", "}
                          {item.quantity}x #{item.productId}
                        </span>
                      ))}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-bold">${sale.total.toFixed(2)}</TableCell>
                <TableCell>{getPaymentMethodIcon(sale.paymentMethod)}</TableCell>
                <TableCell>{getStatusBadge(sale.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingSale(sale)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingSaleId(sale.id)}
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
    </TableContainer>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
        <div className="flex gap-2">
          <Button variant="outline" size={isMobile ? "icon" : "default"} onClick={() => setShowLogsDialog(true)}>
            <History className={isMobile ? "h-5 w-5" : "mr-2 h-4 w-4"} />
            {!isMobile && "Historial"}
          </Button>
          <Button
            size={isMobile ? "icon" : "default"}
            onClick={() => setShowAddDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className={isMobile ? "h-5 w-5" : "mr-2 h-4 w-4"} />
            {!isMobile && "Nueva venta"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {!isMobile && <DateRangePicker />}

        <div className="relative w-full sm:w-auto sm:ml-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ventas..."
            className="w-full sm:w-[250px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {!isMobile && (
          <>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {selectedCustomerId && (
                <Badge variant="secondary" className="ml-2">
                  1
                </Badge>
              )}
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && !isMobile && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filtros</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cliente</label>
                <Combobox
                  options={customerOptions}
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                  placeholder="Seleccionar cliente"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pestañas para filtrar por estado */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" className="flex items-center justify-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span>Todas</span>
            <Badge variant="secondary" className="ml-1">
              {sales.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Completadas</span>
            <Badge variant="secondary" className="ml-1">
              {completedCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span>Pendientes</span>
            <Badge variant="secondary" className="ml-1">
              {pendingCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center justify-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span>Canceladas</span>
            <Badge variant="secondary" className="ml-1">
              {cancelledCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardContent className={isMobile ? "p-4" : "py-6"}>
              {isMobile ? renderMobileView() : renderDesktopView()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para añadir venta */}
      <AddSaleDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {/* Modal para editar venta */}
      {editingSale && (
        <EditSaleDialog
          open={!!editingSale}
          onOpenChange={(open) => {
            if (!open) setEditingSale(null)
          }}
          sale={editingSale}
        />
      )}

      {/* Modal para ver logs */}
      <SalesLogsDialog open={showLogsDialog} onOpenChange={setShowLogsDialog} />

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog
        open={deletingSaleId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingSaleId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la venta de tu historial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
