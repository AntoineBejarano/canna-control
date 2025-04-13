"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product } from "@/contexts/product-context"

interface ProductGramSelectorProps {
  product: Product
  onAddToSale: (product: Product, grams: number) => void
}

export function ProductGramSelector({ product, onAddToSale }: ProductGramSelectorProps) {
  const [customGrams, setCustomGrams] = useState<string>("")

  const presetGrams = [1, 3.5, 7, 14, 28]

  const handleCustomGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomGrams(e.target.value)
  }

  const handleAddCustomGrams = () => {
    const grams = Number.parseFloat(customGrams)
    if (!isNaN(grams) && grams > 0) {
      onAddToSale(product, grams)
      setCustomGrams("")
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {presetGrams.slice(0, 3).map((grams) => (
          <Button key={grams} size="sm" variant="outline" onClick={() => onAddToSale(product, grams)}>
            {grams}g
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {presetGrams.slice(3).map((grams) => (
          <Button key={grams} size="sm" variant="outline" onClick={() => onAddToSale(product, grams)}>
            {grams}g
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Input
          type="number"
          placeholder="Gramos"
          className="h-8"
          min="0.1"
          step="0.1"
          value={customGrams}
          onChange={handleCustomGramsChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddCustomGrams()
            }
          }}
        />
        <Button size="sm" onClick={handleAddCustomGrams}>
          Añadir
        </Button>
      </div>
    </div>
  )
}
