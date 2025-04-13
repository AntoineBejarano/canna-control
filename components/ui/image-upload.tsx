"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // En una aplicación real, aquí subirías el archivo a un servicio de almacenamiento
    // y obtendrías una URL. Para esta demo, usaremos URL.createObjectURL
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    onChange(objectUrl)

    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = ""
  }

  const handleRemoveImage = () => {
    setPreview("/placeholder.svg?height=200&width=400")
    onChange("/placeholder.svg?height=200&width=400")
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative w-full h-48 border rounded-md overflow-hidden cursor-pointer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {preview ? (
          <>
            <Image src={preview || "/placeholder.svg"} alt="Vista previa" fill className="object-cover" />
            {isHovering && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Haz clic para subir una imagen</p>
          </div>
        )}
      </div>

      {preview && preview !== "/placeholder.svg?height=200&width=400" && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            handleRemoveImage()
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  )
}
