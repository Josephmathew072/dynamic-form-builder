import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'

interface KPICardProps {
  title: string
  value: string | number
  description: string
}

export default function KPICard({ title, value, description }: KPICardProps) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl font-bold">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}