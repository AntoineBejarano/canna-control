"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Cannabis } from "lucide-react"
import { ThemeToggleSimple } from "@/components/theme-toggle-simple"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ha ocurrido un error. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: "admin" | "employee") => {
    setIsLoading(true)
    setError("")

    try {
      let success
      if (role === "admin") {
        success = await login("juan.perez@example.com", "password123")
      } else {
        success = await login("empleado@ejemplo.com", "employee")
      }

      if (success) {
        router.push("/dashboard")
      } else {
        setError("Error al iniciar sesión de demostración. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ha ocurrido un error. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggleSimple />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Cannabis className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">CannaControl</h1>
          <p className="text-sm text-muted-foreground">Gestión integral para dispensarios de cannabis</p>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="demo">Demo</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar sesión</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Iniciar sesión
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Acceso de demostración</CardTitle>
                <CardDescription>Elige un rol para probar el sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium mb-2">Administrador</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <span className="font-medium">Email:</span> juan.perez@example.com
                      </p>
                      <p>
                        <span className="font-medium">Contraseña:</span> password123
                      </p>
                    </div>
                    <Button className="w-full mt-3" onClick={() => handleDemoLogin("admin")} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Acceder como Administrador
                    </Button>
                  </div>

                  <div className="rounded-lg border p-3">
                    <h3 className="font-medium mb-2">Empleado</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <span className="font-medium">Email:</span> empleado@ejemplo.com
                      </p>
                      <p>
                        <span className="font-medium">Contraseña:</span> employee
                      </p>
                    </div>
                    <Button
                      className="w-full mt-3"
                      variant="outline"
                      onClick={() => handleDemoLogin("employee")}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Acceder como Empleado
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Al iniciar sesión, aceptas nuestros{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Términos de servicio
          </a>{" "}
          y{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Política de privacidad
          </a>
          .
        </p>
      </div>
    </div>
  )
}
