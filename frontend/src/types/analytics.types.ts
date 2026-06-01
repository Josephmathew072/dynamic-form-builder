export interface SelectFieldStats {
  type: "select"
  label: string
  distribution: Record<string, number>
  mostSelected: string | null
  mostSelectedCount: number
}

export interface NumberFieldStats {
  type: "number"
  label: string
  average: number | null
  totalResponses: number
}

export type FieldStats = SelectFieldStats | NumberFieldStats

export interface Analytics {
  totalSubmissions: number
  fieldStats: Record<string, FieldStats>
  formId: string
  formTitle: string
}

export interface DashboardStats {
  totalForms: number
  totalResponses: number
  activeForms: number
  responseTrend: number
  trendDirection: 'up' | 'down' | 'stable'
  trendMessage: string
  trendDetails: string
  currentMonthResponses: number
  lastMonthResponses: number
  currentMonthName: string
  lastMonthName: string
  recentForms: Array<{
    id: string
    title: string
    fields: number
    createdAt: string
  }>
  recentActivity: Array<{
    id: string
    action: string
    form: string
    time: string
  }>
}