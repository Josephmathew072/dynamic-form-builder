import { FieldDefinition } from '../../../types/form.types'
import { useController, useFormContext } from 'react-hook-form'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group'
import { Switch } from '../../../components/ui/switch'
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
    defaultValue: field.type === 'checkbox' ? (field.defaultValue || false) : '',
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

      case 'textarea':
        return (
          <Textarea
            {...register(field.id)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
            rows={4}
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

      case 'date':
        return (
          <Input
            {...register(field.id)}
            type="date"
            className={error ? 'border-red-500' : ''}
          />
        )

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

      case 'radio':
        return (
          <RadioGroup
            onValueChange={controllerField.onChange}
            value={controllerField.value || ''}
            className="flex flex-col space-y-2"
          >
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.id}
              checked={controllerField.value || false}
              onCheckedChange={controllerField.onChange}
            />
            <Label htmlFor={field.id}>
              {field.placeholder || 'Yes'}
            </Label>
          </div>
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