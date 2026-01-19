import { Card, CardContent } from "@/components/ui/card"

interface ProductSpecsProps {
  specifications: Record<string, any>
}

export function ProductSpecs({ specifications }: ProductSpecsProps) {
  // Group specs by category for better organization
  const specCategories: Record<string, Record<string, any>> = {}

  Object.entries(specifications).forEach(([key, value]) => {
    // Determine category based on key
    let category = "Tổng quan"

    if (key.toLowerCase().includes("cpu") || key.toLowerCase().includes("processor")) {
      category = "Hiệu năng"
    } else if (
      key.toLowerCase().includes("ram") ||
      key.toLowerCase().includes("storage") ||
      key.toLowerCase().includes("ssd")
    ) {
      category = "Bộ nhớ"
    } else if (
      key.toLowerCase().includes("display") ||
      key.toLowerCase().includes("screen") ||
      key.toLowerCase().includes("màn hình")
    ) {
      category = "Màn hình"
    } else if (key.toLowerCase().includes("battery") || key.toLowerCase().includes("pin")) {
      category = "Pin & Sạc"
    } else if (key.toLowerCase().includes("camera")) {
      category = "Camera"
    } else if (key.toLowerCase().includes("os") || key.toLowerCase().includes("system")) {
      category = "Hệ điều hành"
    }

    if (!specCategories[category]) {
      specCategories[category] = {}
    }
    specCategories[category][key] = value
  })

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Object.entries(specCategories).map(([category, categorySpecs]) => (
        <Card key={category} className="overflow-hidden">
          <div className="bg-blue-950/30 px-6 py-4">
            <h3 className="font-semibold text-blue-400">{category}</h3>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {Object.entries(categorySpecs).map(([key, value], index) => (
                <div key={index} className="grid grid-cols-2 gap-4 px-6 py-4">
                  <div className="font-medium text-muted-foreground">{formatSpecKey(key)}</div>
                  <div className="font-medium">{formatSpecValue(value)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function formatSpecKey(key: string): string {
  // Convert camelCase or snake_case to Title Case
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function formatSpecValue(value: any): string {
  if (typeof value === "boolean") {
    return value ? "Có" : "Không"
  }
  if (Array.isArray(value)) {
    return value.join(", ")
  }
  return String(value)
}
