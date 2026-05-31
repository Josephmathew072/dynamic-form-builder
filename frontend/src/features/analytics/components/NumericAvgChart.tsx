import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface NumericAvgChartProps {
  average: number
  maxValue: number
}

export default function NumericAvgChart({ average, maxValue }: NumericAvgChartProps) {
  const data = [
    { name: 'Average', value: average, max: maxValue }
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, maxValue]} />
        <YAxis type="category" dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]}>
          <Cell fill="#3B82F6" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}