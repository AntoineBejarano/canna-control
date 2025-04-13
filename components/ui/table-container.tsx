import type React from "react"
import { cn } from "@/lib/utils"

interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string
}

export function TableContainer({ children, className, maxHeight = "500px", ...props }: TableContainerProps) {
  return (
    <div className={cn("w-full overflow-auto border rounded-md", className)} style={{ maxHeight }} {...props}>
      {children}
    </div>
  )
}
