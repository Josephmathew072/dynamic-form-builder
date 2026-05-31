import api from "./api"
import { Response, ResponseInput } from "../types/response.types"

export const responseApi = {
  submit: (data: ResponseInput) => api.post<Response>('/responses', data),
  getByFormId: (formId: string) => api.get<Response[]>(`/responses/form/${formId}`),
  update: (id: string, answers: Record<string, any>) => api.put<Response>(`/responses/${id}`, { answers }),
  delete: (id: string) => api.delete(`/responses/${id}`),
}