"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Interfaces para los datos de configuración
interface GeneralSettings {
  name: string
  email: string
  phone: string
  language: string
  timezone: string
}

interface BusinessSettings {
  businessName: string
  businessType: string
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  businessDescription: string
  businessHours: string
  licenseNumber: string
  licenseIssueDate: string
  licenseExpiryDate: string
  licenseAuthority: string
}

interface NotificationSettings {
  emailNewSales: boolean
  emailLowInventory: boolean
  emailWeeklyReports: boolean
  emailSystemUpdates: boolean
  appNewCustomers: boolean
  appReviews: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
}

export default function SettingsPage() {
  const { toast } = useToast()
  const { user, updateUserInfo, updateDispensaryInfo } = useAuth()
  const router = useRouter()

  // Estados para cada sección de configuración
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    name: "",
    email: "",
    phone: "",
    language: "es",
    timezone: "europe-madrid",
  })

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: "",
    businessType: "both",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    businessDescription: "",
    businessHours: "",
    licenseNumber: "",
    licenseIssueDate: "",
    licenseExpiryDate: "",
    licenseAuthority: "",
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNewSales: true,
    emailLowInventory: true,
    emailWeeklyReports: true,
    emailSystemUpdates: false,
    appNewCustomers: true,
    appReviews: true,
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
  })

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    // Cargar datos del usuario actual
    if (user) {
      setGeneralSettings({
        name: user.name || "",
        email: user.email || "",
        phone: user.dispensary?.phone || "",
        language: "es",
        timezone: "europe-madrid",
      })

      setBusinessSettings({
        businessName: user.dispensary?.name || "",
        businessType: user.dispensary?.type || "both",
        businessAddress: user.dispensary?.address || "",
        businessCity: "",
        businessState: "",
        businessZip: "",
        businessDescription: "",
        businessHours: "Lun-Vie: 9:00 AM - 9:00 PM, Sáb-Dom: 10:00 AM - 8:00 PM",
        licenseNumber: "CAN-12345-REC",
        licenseIssueDate: "2024-01-15",
        licenseExpiryDate: "2026-01-14",
        licenseAuthority: "Departamento de Salud Pública",
      })
    }

    // Cargar configuración guardada de localStorage
    const savedGeneralSettings = localStorage.getItem("generalSettings")
    const savedBusinessSettings = localStorage.getItem("businessSettings")
    const savedNotificationSettings = localStorage.getItem("notificationSettings")
    const savedSecuritySettings = localStorage.getItem("securitySettings")

    if (savedGeneralSettings) {
      setGeneralSettings(JSON.parse(savedGeneralSettings))
    }

    if (savedBusinessSettings) {
      setBusinessSettings(JSON.parse(savedBusinessSettings))
    }

    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings))
    }

    if (savedSecuritySettings) {
      setSecuritySettings(JSON.parse(savedSecuritySettings))
    }
  }, [user])

  // Manejadores para actualizar los estados
  const handleGeneralChange = (field: keyof GeneralSettings, value: string) => {
    setGeneralSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleBusinessChange = (field: keyof BusinessSettings, value: string) => {
    setBusinessSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: keyof SecuritySettings, value: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: value }))
  }

  // Funciones para guardar cambios
  const saveGeneralSettings = () => {
    localStorage.setItem("generalSettings", JSON.stringify(generalSettings))

    // Actualizar la información del usuario en el contexto de autenticación
    updateUserInfo({
      name: generalSettings.name,
      email: generalSettings.email,
    })

    // Actualizar la información del dispensario en el contexto de autenticación
    updateDispensaryInfo({
      phone: generalSettings.phone,
    })

    toast({
      title: "Configuración guardada",
      description: "La información general ha sido actualizada correctamente.",
    })

    // Redirigir al dashboard para reflejar los cambios
    router.push("/dashboard")
  }

  const saveBusinessSettings = () => {
    localStorage.setItem("businessSettings", JSON.stringify(businessSettings))

    // Actualizar la información del dispensario en el contexto de autenticación
    updateDispensaryInfo({
      name: businessSettings.businessName,
      type: businessSettings.businessType,
      address: businessSettings.businessAddress,
    })

    toast({
      title: "Información guardada",
      description: "La información del negocio ha sido actualizada correctamente.",
    })

    // Redirigir al dashboard para reflejar los cambios
    router.push("/dashboard")
  }

  const saveNotificationSettings = () => {
    localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))
    toast({
      title: "Preferencias guardadas",
      description: "Las preferencias de notificaciones han sido actualizadas.",
    })
  }

  const saveSecuritySettings = () => {
    localStorage.setItem("securitySettings", JSON.stringify(securitySettings))
    toast({
      title: "Configuración guardada",
      description: "La configuración de seguridad ha sido actualizada.",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Negocio</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="billing">Facturación</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información general</CardTitle>
              <CardDescription>Actualiza la información básica de tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={generalSettings.name}
                    onChange={(e) => handleGeneralChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => handleGeneralChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={generalSettings.phone}
                    onChange={(e) => handleGeneralChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => handleGeneralChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Selecciona un idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Zona horaria</Label>
                <Select
                  value={generalSettings.timezone}
                  onValueChange={(value) => handleGeneralChange("timezone", value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Selecciona una zona horaria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="europe-madrid">Europa/Madrid (GMT+1)</SelectItem>
                    <SelectItem value="america-new_york">América/Nueva York (GMT-5)</SelectItem>
                    <SelectItem value="america-los_angeles">América/Los Ángeles (GMT-8)</SelectItem>
                    <SelectItem value="asia-tokyo">Asia/Tokio (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveGeneralSettings}>Guardar cambios</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
              <CardDescription>Personaliza tu experiencia en la plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Modo oscuro</Label>
                  <p className="text-sm text-muted-foreground">Activa el modo oscuro para reducir la fatiga visual.</p>
                </div>
                <ThemeToggle />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notificaciones en el navegador</Label>
                  <p className="text-sm text-muted-foreground">Recibe notificaciones en tiempo real en tu navegador.</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Guardar preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del negocio</CardTitle>
              <CardDescription>Actualiza la información de tu dispensario.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Nombre del dispensario</Label>
                <Input
                  id="business-name"
                  value={businessSettings.businessName}
                  onChange={(e) => handleBusinessChange("businessName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-type">Tipo de dispensario</Label>
                <Select
                  value={businessSettings.businessType}
                  onValueChange={(value) => handleBusinessChange("businessType", value)}
                >
                  <SelectTrigger id="business-type">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Médico</SelectItem>
                    <SelectItem value="recreational">Recreativo</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-address">Dirección</Label>
                <Input
                  id="business-address"
                  value={businessSettings.businessAddress}
                  onChange={(e) => handleBusinessChange("businessAddress", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-city">Ciudad</Label>
                  <Input
                    id="business-city"
                    value={businessSettings.businessCity}
                    onChange={(e) => handleBusinessChange("businessCity", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-state">Provincia</Label>
                  <Input
                    id="business-state"
                    value={businessSettings.businessState}
                    onChange={(e) => handleBusinessChange("businessState", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-zip">Código postal</Label>
                  <Input
                    id="business-zip"
                    value={businessSettings.businessZip}
                    onChange={(e) => handleBusinessChange("businessZip", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-description">Descripción</Label>
                <Textarea
                  id="business-description"
                  rows={4}
                  value={businessSettings.businessDescription}
                  onChange={(e) => handleBusinessChange("businessDescription", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-hours">Horario de atención</Label>
                <Input
                  id="business-hours"
                  value={businessSettings.businessHours}
                  onChange={(e) => handleBusinessChange("businessHours", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveBusinessSettings}>Guardar información</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Licencias y permisos</CardTitle>
              <CardDescription>Gestiona tus licencias y permisos legales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="license-number">Número de licencia</Label>
                <Input
                  id="license-number"
                  value={businessSettings.licenseNumber}
                  onChange={(e) => handleBusinessChange("licenseNumber", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license-issue-date">Fecha de emisión</Label>
                  <Input
                    id="license-issue-date"
                    type="date"
                    value={businessSettings.licenseIssueDate}
                    onChange={(e) => handleBusinessChange("licenseIssueDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license-expiry-date">Fecha de vencimiento</Label>
                  <Input
                    id="license-expiry-date"
                    type="date"
                    value={businessSettings.licenseExpiryDate}
                    onChange={(e) => handleBusinessChange("licenseExpiryDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license-authority">Autoridad emisora</Label>
                <Input
                  id="license-authority"
                  value={businessSettings.licenseAuthority}
                  onChange={(e) => handleBusinessChange("licenseAuthority", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveBusinessSettings}>Actualizar licencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo quieres recibir notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificaciones por correo electrónico</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevas ventas</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones cuando se realice una nueva venta.
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNewSales}
                    onCheckedChange={(checked) => handleNotificationChange("emailNewSales", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Inventario bajo</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe alertas cuando el inventario esté por debajo del umbral mínimo.
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailLowInventory}
                    onCheckedChange={(checked) => handleNotificationChange("emailLowInventory", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Informes semanales</Label>
                    <p className="text-sm text-muted-foreground">Recibe un resumen semanal de ventas y rendimiento.</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailWeeklyReports}
                    onCheckedChange={(checked) => handleNotificationChange("emailWeeklyReports", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Actualizaciones del sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones sobre actualizaciones y nuevas funciones.
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailSystemUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("emailSystemUpdates", checked)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Notificaciones en la aplicación</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevos clientes</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones cuando se registre un nuevo cliente.
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.appNewCustomers}
                    onCheckedChange={(checked) => handleNotificationChange("appNewCustomers", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comentarios y reseñas</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones sobre nuevos comentarios y reseñas.
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.appReviews}
                    onCheckedChange={(checked) => handleNotificationChange("appReviews", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveNotificationSettings}>Guardar preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad de la cuenta</CardTitle>
              <CardDescription>Actualiza tu contraseña y configura la autenticación de dos factores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Actualizar contraseña</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Autenticación de dos factores</CardTitle>
              <CardDescription>Añade una capa adicional de seguridad a tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticación de dos factores</Label>
                  <p className="text-sm text-muted-foreground">
                    Protege tu cuenta con un código adicional enviado a tu teléfono.
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={saveSecuritySettings}>
                Configurar
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sesiones activas</CardTitle>
              <CardDescription>Gestiona tus sesiones activas en diferentes dispositivos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Chrome en Windows</p>
                    <p className="text-sm text-muted-foreground">Madrid, España • Activo ahora</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Este dispositivo
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Safari en iPhone</p>
                    <p className="text-sm text-muted-foreground">Barcelona, España • Hace 2 horas</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Cerrar sesión
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Firefox en MacBook</p>
                    <p className="text-sm text-muted-foreground">Valencia, España • Hace 5 días</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="destructive">Cerrar todas las sesiones</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan actual</CardTitle>
              <CardDescription>Información sobre tu plan de suscripción actual.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Plan Profesional</h3>
                    <p className="text-sm text-muted-foreground">Facturación mensual</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      €49.99<span className="text-sm font-normal text-muted-foreground">/mes</span>
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <p className="text-sm">Incluye:</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 mr-2 text-green-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Gestión de inventario ilimitada
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 mr-2 text-green-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Hasta 5 usuarios
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 mr-2 text-green-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Análisis avanzados
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 mr-2 text-green-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Soporte prioritario
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">
                  Tu próxima factura será de €49.99 el 15 de abril de 2025.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button variant="outline">Cambiar plan</Button>
              <Button variant="destructive">Cancelar suscripción</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
