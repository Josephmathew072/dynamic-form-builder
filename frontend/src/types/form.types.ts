export interface FieldDefinition {
  id: string
  type: "text" | "number" | "select"
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
  multiple?: boolean
}

export interface Form {
  _id: string
  title: string
  description?: string
  fields: FieldDefinition[]
  shareableId: string
  createdAt: string
}

export interface Response {
  _id: string
  formId: string
  answers: Record<string, any>
  submittedAt: string
}