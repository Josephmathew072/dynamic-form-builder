import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'

interface NumericAvgChartProps {
  average: number
  maxValue: number
}

export default function NumericAvgChart({ average, maxValue }: NumericAvgChartProps) {
  const data = [
    { name: 'Average Score', value: average, max: maxValue }
  ]

  const getColor = (value: number, max: number) => {
    const percentage = value / max
    if (percentage >= 0.8) return '#10B981'
    if (percentage >= 0.6) return '#F59E0B'
    if (percentage >= 0.4) return '#F97316'
    return '#EF4444'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / maxValue) * 100).toFixed(1)
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border">
          <p className="text-sm font-semibold">{payload[0].payload.name}</p>
          <p className="text-xs text-muted-foreground">
            Value: {payload[0].value.toFixed(2)} / {maxValue}
          </p>
          <p className="text-xs text-muted-foreground">
            Percentage: {percentage}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={{ stroke: '#D1D5DB' }}
        />
        <YAxis 
          domain={[0, maxValue]} 
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={{ stroke: '#D1D5DB' }}
          label={{ 
            value: 'Value', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#6B7280', fontSize: 12 }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine 
          y={maxValue / 2} 
          stroke="#9CA3AF" 
          strokeDasharray="3 3" 
          label={{ value: 'Midpoint', position: 'right', fill: '#9CA3AF', fontSize: 10 }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.value, maxValue)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}