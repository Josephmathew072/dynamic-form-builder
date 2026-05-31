import api from './api'
import { Form } from '../types/form.types'

// console.log("API BASE URL:", api.defaults.baseURL);
export const formApi = {
  getAll: () => api.get<Form[]>('/forms'),
  getById: (id: string) => api.get<Form>(`/forms/${id}`),
  getByShareableId: (shareableId: string) => api.get<Form>(`/forms/share/${shareableId}`),
  create: (data: Partial<Form>) => api.post<Form>('/forms', data),
  update: (id: string, data: Partial<Form>) => api.put<Form>(`/forms/${id}`, data),
  delete: (id: string) => api.delete(`/forms/${id}`),
}