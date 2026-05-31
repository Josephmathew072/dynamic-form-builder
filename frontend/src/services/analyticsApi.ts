import api from "./api"
import { Analytics, DashboardStats } from "../types/analytics.types"

export const analyticsApi = {
  getByFormId: (formId: string) => api.get<Analytics>(`/analytics/${formId}`),
  getDashboardStats: () => api.get<DashboardStats>('/analytics/dashboard/stats'),
}