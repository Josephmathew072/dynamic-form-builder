import { FieldDefinition } from "../types/form.types"

export const validateField = (field: FieldDefinition, value: any): string | null => {
  if (field.required && (value === undefined || value === null || value === "")) {
    return `${field.label} is required`
  }
  if (field.type === "number" && value !== undefined && value !== "" && isNaN(Number(value))) {
    return `${field.label} must be a number`
  }
  if (field.type === "select" && !field.multiple && value && !field.options?.includes(value)) {
    return `Invalid option for ${field.label}`
  }
  if (field.type === "select" && field.multiple && Array.isArray(value)) {
    for (const v of value) {
      if (!field.options?.includes(v)) return `Invalid option "${v}" for ${field.label}`
    }
  }
  return null
}