import { FieldDefinition } from '../../../types/form.types'
import { useController, useFormContext } from 'react-hook-form'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import MultiSelectDropdown from './MultiSelectDropdown'

interface DynamicFieldProps {
  field: FieldDefinition
  error?: string
}

export default function DynamicField({ field, error }: DynamicFieldProps) {
  const { control, register } = useFormContext()
  const { field: controllerField, fieldState } = useController({
    name: field.id,
    control,
    rules: {
      required: field.required ? `${field.label} is required` : false,
      ...(field.type === 'number' && {
        valueAsNumber: true,
        validate: (value: number) => !isNaN(value) || `${field.label} must be a number`
      }),
      ...(field.type === 'select' && field.multiple && {
        validate: (value: any[]) => {
          if (field.required && (!value || value.length === 0)) {
            return `${field.label} is required`
          }
          return true
        }
      })
    }
  })

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            {...register(field.id)}
            type="text"
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        )
      case 'number':
        return (
          <Input
            {...register(field.id, { valueAsNumber: true })}
            type="number"
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        )
//   case 'select':
//     if (field.multiple) {
//       return (
//         <select
//           {...baseProps}
//           multiple
//           className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
//             error ? 'border-red-500' : ''
//           }`}
//         >
//           {field.options?.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//       )
//     }
      case 'select':
        if (field.multiple) {
          return (
            <MultiSelectDropdown
              options={field.options || []}
              value={controllerField.value || []}
              onChange={(newValue) => controllerField.onChange(newValue)}
              placeholder={`Select ${field.label}`}
            />
          )
        }
        return (
          <Select
            onValueChange={controllerField.onChange}
            value={controllerField.value || ''}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return <Input {...register(field.id)} type="text" />
    }
  }

  const displayError = error || fieldState.error?.message

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {displayError && <p className="text-sm text-red-500">{displayError}</p>}
    </div>
  )
}