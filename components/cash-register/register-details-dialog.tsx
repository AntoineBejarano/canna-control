"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download } from "lucide-react"
import { useCashRegister } from "@/contexts/cash-register-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface RegisterDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  registerId: number
}

export function RegisterDetailsDialog({ open, onOpenChange, registerId }: RegisterDetailsDialogProps) {
  const { getRegisterById, getRegisterSummary } = useCashRegister()
  const register = getRegisterById(registerId)
  const summary = register ? getRegisterSummary(registerId) : null

  // Función para formatear la fecha
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No disponible"
    try {
      return format(new Date(dateString), "dd MMMM yyyy, HH:mm:ss", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  // Función para exportar a PDF (simulada)
  const handleExportPDF = () => {
    alert("Exportación a PDF simulada. En una implementación real, se generaría un PDF con los detalles de la caja.")
  }

  if (!register || !summary) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de caja #{register.id}</DialogTitle>
          <DialogDescription>Información completa sobre la apertura y cierre de caja.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Caja #{register.id}</h2>
              <p className="text-sm text-muted-foreground">Operada por: {register.userName}</p>
            </div>
            <Badge
              variant={register.status === "open" ? "outline" : "secondary"}
              className={register.status === "open" ? "bg-green-500/20 text-green-500 border-green-500/20" : ""}
            >
              {register.status === "open" ? "Abierta" : "Cerrada"}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Apertura</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Fecha y hora:</dt>
                  <dd>{formatDate(register.openingDate)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Monto inicial:</dt>
                  <dd className="font-bold">${register.initialAmount.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Cierre</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Fecha y hora:</dt>
                  <dd>{register.status === "closed" ? formatDate(register.closingDate) : "Pendiente"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Monto final:</dt>
                  <dd className="font-bold">
                    {register.status === "closed" ? `$${register.finalAmount?.toFixed(2)}` : "Pendiente"}
                  </dd>
                </div>
                {register.status === "closed" && (
                  <>
                    <div className="flex justify-between">
                      <dt className="font-medium">Monto esperado:</dt>
                      <dd>${register.expectedAmount?.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Diferencia:</dt>
                      <dd
                        className={`font-bold ${register.difference && register.difference > 0 ? "text-green-500" : register.difference && register.difference < 0 ? "text-red-500" : ""}`}
                      >
                        ${register.difference?.toFixed(2)}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Resumen de ventas</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Ventas en efectivo:</dt>
                <dd>${summary.totalCashSales.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Ventas con tarjeta:</dt>
                <dd>${summary.totalCardSales.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Ventas por transferencia:</dt>
                <dd>${summary.totalTransferSales.toFixed(2)}</dd>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <dt className="font-medium">Total de ventas:</dt>
                <dd className="font-bold">${summary.totalSales.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Número de transacciones:</dt>
                <dd>{summary.salesCount}</dd>
              </div>
            </dl>
          </div>

          {register.observations && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Observaciones</h3>
                <p className="text-sm">{register.observations}</p>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exportar a PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
