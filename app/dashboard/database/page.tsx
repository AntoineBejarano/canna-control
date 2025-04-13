"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Database, Table, Check, X, AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DatabasePage() {
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [connectionData, setConnectionData] = useState<any>(null)
  const [tables, setTables] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("connection")
  const [seedingStatus, setSeedingStatus] = useState<Record<string, "idle" | "loading" | "success" | "error">>({
    socios: "idle",
    productos: "idle",
    ventas: "idle",
    gastos: "idle",
    all: "idle",
  })
  const [cleaningStatus, setCleaningStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [databaseName, setDatabaseName] = useState("")

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/db-test")
      const data = await response.json()

      if (data.success) {
        setConnectionStatus("success")
        setConnectionData(data.data)

        // Extraer el nombre de la base de datos
        if (data.data && data.data.database) {
          setDatabaseName(data.data.database)
        }
      } else {
        setConnectionStatus("error")
        setConnectionData({ error: data.message })
      }
    } catch (error) {
      setConnectionStatus("error")
      setConnectionData({ error: "Error al conectar con la API" })
    } finally {
      setLoading(false)
    }
  }

  const listTables = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/db-tables")
      const data = await response.json()

      if (data.success) {
        setTables(data.tables)
      } else {
        setTables([])
      }
    } catch (error) {
      setTables([])
    } finally {
      setLoading(false)
    }
  }

  const cleanupDatabase = async () => {
    setCleaningStatus("loading")
    try {
      const response = await fetch("/api/db-cleanup", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setCleaningStatus("success")
        toast({
          title: "Base de datos limpiada",
          description: data.message,
          variant: "default",
        })

        // Actualizar la lista de tablas
        if (activeTab === "tables") {
          listTables()
        }
      } else {
        setCleaningStatus("error")
        toast({
          title: "Error al limpiar la base de datos",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      setCleaningStatus("error")
      toast({
        title: "Error al limpiar la base de datos",
        description: "Ha ocurrido un error al intentar limpiar la base de datos.",
        variant: "destructive",
      })
    } finally {
      setCleaningStatus("idle")
    }
  }

  const generateSeedData = async (type: "socios" | "productos" | "ventas" | "gastos" | "all") => {
    setSeedingStatus((prev) => ({ ...prev, [type]: "loading" }))

    try {
      const response = await fetch(`/api/seed/${type}`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setSeedingStatus((prev) => ({ ...prev, [type]: "success" }))
        toast({
          title: "Datos generados correctamente",
          description: data.message,
          variant: "default",
        })

        // Si generamos todos los datos, actualizar el estado de todos los tipos
        if (type === "all") {
          setSeedingStatus({
            socios: "success",
            productos: "success",
            ventas: "success",
            gastos: "success",
            all: "success",
          })
        }

        // Actualizar la lista de tablas
        if (activeTab === "tables") {
          listTables()
        }
      } else {
        setSeedingStatus((prev) => ({ ...prev, [type]: "error" }))
        toast({
          title: "Error al generar datos",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      setSeedingStatus((prev) => ({ ...prev, [type]: "error" }))
      toast({
        title: "Error al generar datos",
        description: "Ha ocurrido un error al intentar generar los datos de prueba.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (activeTab === "tables" && tables.length === 0) {
      listTables()
    }

    // Probar la conexión al cargar la página
    if (connectionStatus === "idle") {
      testConnection()
    }
  }, [activeTab, tables.length, connectionStatus])

  const isCorrectDatabase = databaseName === "neon-lightBlue-yacht"

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Base de Datos</h1>
        </div>

        {connectionStatus === "success" && !isCorrectDatabase && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Base de datos incorrecta</AlertTitle>
            <AlertDescription>
              Estás conectado a la base de datos "{databaseName}" en lugar de "neon-lightBlue-yacht". Por favor,
              actualiza la variable de entorno DATABASE_URL para que apunte a la base de datos correcta.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="connection">Estado de Conexión</TabsTrigger>
            <TabsTrigger value="tables">Tablas</TabsTrigger>
            <TabsTrigger value="seed">Datos de Prueba</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Conexión a Base de Datos Neon</CardTitle>
                <CardDescription>Verifica la conexión a la base de datos PostgreSQL alojada en Neon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Base de datos PostgreSQL en Neon</span>
                  </div>

                  {connectionStatus === "success" && (
                    <div
                      className={`rounded-md ${isCorrectDatabase ? "bg-green-50" : "bg-amber-50"} p-4 border ${isCorrectDatabase ? "border-green-200" : "border-amber-200"}`}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          {isCorrectDatabase ? (
                            <Check className="h-5 w-5 text-green-400" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <h3
                            className={`text-sm font-medium ${isCorrectDatabase ? "text-green-800" : "text-amber-800"}`}
                          >
                            {isCorrectDatabase ? "Conexión exitosa" : "Conexión a base de datos incorrecta"}
                          </h3>
                          <div className={`mt-2 text-sm ${isCorrectDatabase ? "text-green-700" : "text-amber-700"}`}>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Base de datos: {connectionData?.database}</li>
                              <li>Hora del servidor: {connectionData?.time}</li>
                              <li>Versión: {connectionData?.version?.split(" ")[0]}</li>
                            </ul>

                            {!isCorrectDatabase && (
                              <div className="mt-4 p-3 bg-amber-100 rounded-md">
                                <p className="font-medium">
                                  Debes conectarte a la base de datos "neon-lightBlue-yacht"
                                </p>
                                <p className="mt-2">
                                  Actualiza la variable de entorno DATABASE_URL en tu archivo .env o en la configuración
                                  de Vercel.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {connectionStatus === "error" && (
                    <div className="rounded-md bg-red-50 p-4 border border-red-200">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <X className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Error de conexión</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{connectionData?.error || "No se pudo conectar a la base de datos"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {tables.length > 0 && !isCorrectDatabase && (
                    <div className="mt-4">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Tablas en base de datos incorrecta</AlertTitle>
                        <AlertDescription>
                          Se han detectado tablas en la base de datos incorrecta. Puedes limpiar estas tablas antes de
                          cambiar a la base de datos correcta.
                        </AlertDescription>
                      </Alert>

                      <div className="mt-4">
                        <Button variant="destructive" onClick={cleanupDatabase} disabled={cleaningStatus === "loading"}>
                          {cleaningStatus === "loading" ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Limpiando tablas...
                            </>
                          ) : (
                            "Limpiar tablas de la base de datos actual"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={testConnection} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Probando conexión...
                    </>
                  ) : (
                    "Probar Conexión"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tablas de la Base de Datos</CardTitle>
                <CardDescription>Lista de tablas disponibles en la base de datos</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : tables.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="overflow-auto">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                              Nombre de la Tabla
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {tables.map((table, index) => (
                            <tr key={index} className="hover:bg-muted/50">
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center">
                                  <Table className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {table}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron tablas o no se ha podido conectar a la base de datos
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={listTables} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando tablas...
                    </>
                  ) : (
                    "Actualizar Tablas"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="seed" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Datos de Prueba</CardTitle>
                <CardDescription>Genera datos de prueba para la aplicación</CardDescription>
              </CardHeader>
              <CardContent>
                {!isCorrectDatabase ? (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Base de datos incorrecta</AlertTitle>
                    <AlertDescription>
                      No puedes generar datos de prueba porque estás conectado a la base de datos incorrecta. Por favor,
                      actualiza la variable de entorno DATABASE_URL para que apunte a "neon-lightBlue-yacht".
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Socios</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Genera 10 socios de prueba con datos aleatorios.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateSeedData("socios")}
                        disabled={seedingStatus.socios === "loading" || !isCorrectDatabase}
                      >
                        {seedingStatus.socios === "loading" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando...
                          </>
                        ) : seedingStatus.socios === "success" ? (
                          <>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Generados
                          </>
                        ) : (
                          "Generar Socios"
                        )}
                      </Button>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Productos</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Genera 20 productos de prueba en diferentes categorías.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateSeedData("productos")}
                        disabled={seedingStatus.productos === "loading" || !isCorrectDatabase}
                      >
                        {seedingStatus.productos === "loading" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando...
                          </>
                        ) : seedingStatus.productos === "success" ? (
                          <>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Generados
                          </>
                        ) : (
                          "Generar Productos"
                        )}
                      </Button>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Ventas</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Genera 30 ventas de prueba con fechas de los últimos 3 meses.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateSeedData("ventas")}
                        disabled={seedingStatus.ventas === "loading" || !isCorrectDatabase}
                      >
                        {seedingStatus.ventas === "loading" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando...
                          </>
                        ) : seedingStatus.ventas === "success" ? (
                          <>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Generadas
                          </>
                        ) : (
                          "Generar Ventas"
                        )}
                      </Button>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Gastos</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Genera 15 gastos de prueba en diferentes categorías.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateSeedData("gastos")}
                        disabled={seedingStatus.gastos === "loading" || !isCorrectDatabase}
                      >
                        {seedingStatus.gastos === "loading" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando...
                          </>
                        ) : seedingStatus.gastos === "success" ? (
                          <>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Generados
                          </>
                        ) : (
                          "Generar Gastos"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="default"
                  onClick={() => generateSeedData("all")}
                  disabled={seedingStatus.all === "loading" || !isCorrectDatabase}
                >
                  {seedingStatus.all === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando todos los datos...
                    </>
                  ) : seedingStatus.all === "success" ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Todos los datos generados
                    </>
                  ) : (
                    "Generar Todos los Datos"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
