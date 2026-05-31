export interface ResponseInput {
  formId: string
  answers: Record<string, any>
}

export interface Response extends ResponseInput {
  _id: string
  submittedAt: string
}