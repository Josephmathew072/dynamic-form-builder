import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  description: string
  icon?: LucideIcon
  gradient?: string
}

export default function KPICard({ title, value, description, icon: Icon, gradient = "from-primary to-purple-600" }: KPICardProps) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg card-hover">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} shadow-md`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        )}
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}