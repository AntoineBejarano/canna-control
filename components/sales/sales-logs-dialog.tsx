"use client"

import { useSales, type SaleLog } from "@/contexts/sales-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SalesLogsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SalesLogsDialog({ open, onOpenChange }: SalesLogsDialogProps) {
  const { logs } = useSales()

  // Ordenar logs por fecha (más recientes primero)
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm:ss", { locale: es })
  }

  // Mejorar la visualización de los logs
  const getActionBadge = (action: SaleLog["action"]) => {
    switch (action) {
      case "create":
        return <Badge className="bg-green-500">Creación</Badge>
      case "update":
        return <Badge className="bg-blue-500">Actualización</Badge>
      case "delete":
        return <Badge className="bg-red-500">Eliminación</Badge>
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Registro de actividad de ventas</DialogTitle>
          <DialogDescription>Historial de todas las acciones realizadas en el módulo de ventas.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {sortedLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay registros de actividad disponibles.</p>
            ) : (
              sortedLogs.map((log) => (
                // Actualizar el formato de los logs para mostrar más detalles
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getActionBadge(log.action)}
                      <span className="font-medium">Venta #{log.saleId}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</span>
                  </div>
                  <p className="text-sm mb-2">{log.details}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Realizado por: {log.userName}</p>
                    <p className="text-xs text-muted-foreground">ID: {log.id}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
