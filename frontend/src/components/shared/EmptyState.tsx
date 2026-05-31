import { FileQuestion, BarChart3, ClipboardList } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface EmptyStateProps {
  title: string
  description: string
  icon?: "File" | "Chart" | "Form"
}

const icons = {
  File: FileQuestion,
  Chart: BarChart3,        // Changed from ChartNoAxesCombined
  Form: ClipboardList,
}

export default function EmptyState({ title, description, icon = "File" }: EmptyStateProps) {
  const Icon = icons[icon]
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  )
}