"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import { Search, Download, Eye, DollarSign, AlertCircle } from "lucide-react"
import { useCashRegister } from "@/contexts/cash-register-context"
import { OpenRegisterDialog } from "@/components/cash-register/open-register-dialog"
import { CloseRegisterDialog } from "@/components/cash-register/close-register-dialog"
import { RegisterDetailsDialog } from "@/components/cash-register/register-details-dialog"
import { format } from "date-fns"
import { TableContainer } from "@/components/ui/table-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function CashRegisterPage() {
  const { registers, currentRegister, isRegisterOpen } = useCashRegister()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showOpenDialog, setShowOpenDialog] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [viewingRegisterId, setViewingRegisterId] = useState<number | null>(null)

  // Filtrar registros según la búsqueda y la pestaña activa
  const filteredRegisters = registers.filter((register) => {
    const matchesSearch =
      register.id.toString().includes(searchQuery) ||
      register.userName.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "open") return matchesSearch && register.status === "open"
    if (activeTab === "closed") return matchesSearch && register.status === "closed"

    return matchesSearch
  })

  // Ordenar registros por fecha (más recientes primero)
  const sortedRegisters = [...filteredRegisters].sort((a, b) => {
    const dateA = new Date(a.status === "closed" && a.closingDate ? a.closingDate : a.openingDate)
    const dateB = new Date(b.status === "closed" && b.closingDate ? b.closingDate : b.openingDate)
    return dateB.getTime() - dateA.getTime()
  })

  // Función para exportar a CSV (simulada)
  const handleExportCSV = () => {
    toast({
      title: "Exportación iniciada",
      description: "Se ha iniciado la exportación del historial de cajas a CSV.",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Caja</h1>
        <div className="flex gap-2">
          {isRegisterOpen ? (
            <Button onClick={() => setShowCloseDialog(true)}>
              <DollarSign className="mr-2 h-4 w-4" />
              Cerrar caja
            </Button>
          ) : (
            <Button onClick={() => setShowOpenDialog(true)}>
              <DollarSign className="mr-2 h-4 w-4" />
              Abrir caja
            </Button>
          )}
        </div>
      </div>

      {currentRegister && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle>Caja actual</CardTitle>
            <CardDescription>
              Abierta el {format(new Date(currentRegister.openingDate), "dd/MM/yyyy 'a las' HH:mm")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium">Monto inicial</h3>
                <p className="text-2xl font-bold">${currentRegister.initialAmount.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Operador</h3>
                <p className="text-lg">{currentRegister.userName}</p>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="ml-auto" onClick={() => setShowCloseDialog(true)}>
                  Cerrar caja
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <DateRangePicker />
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar registros..."
            className="w-[300px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="open">Abiertos</TabsTrigger>
          <TabsTrigger value="closed">Cerrados</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de cajas</CardTitle>
              <CardDescription>Visualiza y gestiona todas las aperturas y cierres de caja.</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedRegisters.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No se encontraron registros</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    No hay registros de caja que coincidan con tu búsqueda o filtros.
                  </p>
                  {!isRegisterOpen && (
                    <Button className="mt-4" onClick={() => setShowOpenDialog(true)}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Abrir caja
                    </Button>
                  )}
                </div>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Operador</TableHead>
                        <TableHead>Apertura</TableHead>
                        <TableHead>Cierre</TableHead>
                        <TableHead>Monto inicial</TableHead>
                        <TableHead>Monto final</TableHead>
                        <TableHead>Diferencia</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedRegisters.map((register) => (
                        <TableRow key={register.id}>
                          <TableCell className="font-medium">#{register.id}</TableCell>
                          <TableCell>{register.userName}</TableCell>
                          <TableCell>{format(new Date(register.openingDate), "dd/MM/yyyy HH:mm")}</TableCell>
                          <TableCell>
                            {register.closingDate
                              ? format(new Date(register.closingDate), "dd/MM/yyyy HH:mm")
                              : "Pendiente"}
                          </TableCell>
                          <TableCell>${register.initialAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            {register.finalAmount ? `$${register.finalAmount.toFixed(2)}` : "Pendiente"}
                          </TableCell>
                          <TableCell>
                            {register.difference !== undefined ? (
                              <span
                                className={
                                  register.difference > 0
                                    ? "text-green-500 font-medium"
                                    : register.difference < 0
                                      ? "text-red-500 font-medium"
                                      : ""
                                }
                              >
                                ${register.difference.toFixed(2)}
                              </span>
                            ) : (
                              "Pendiente"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={register.status === "open" ? "outline" : "secondary"}
                              className={
                                register.status === "open" ? "bg-green-500/20 text-green-500 border-green-500/20" : ""
                              }
                            >
                              {register.status === "open" ? "Abierta" : "Cerrada"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => setViewingRegisterId(register.id)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver detalles</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogos */}
      <OpenRegisterDialog open={showOpenDialog} onOpenChange={setShowOpenDialog} />
      <CloseRegisterDialog open={showCloseDialog} onOpenChange={setShowCloseDialog} />
      {viewingRegisterId !== null && (
        <RegisterDetailsDialog
          open={viewingRegisterId !== null}
          onOpenChange={(open) => {
            if (!open) setViewingRegisterId(null)
          }}
          registerId={viewingRegisterId}
        />
      )}
    </div>
  )
}
