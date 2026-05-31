import { FieldDefinition } from "../../../types/form.types"
import { Button } from "../../../components/ui/button"
import { Pencil, Trash2, GripVertical } from "lucide-react"

interface FieldListProps {
  fields: FieldDefinition[]
  onEdit: (field: FieldDefinition) => void
  onDelete: (id: string) => void
}

export default function FieldList({ fields, onEdit, onDelete }: FieldListProps) {
  if (fields.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No fields yet. Click "Add Field" to start.</p>
  }

  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            <div>
              <p className="font-medium">{field.label}</p>
              <p className="text-xs text-muted-foreground">{field.type}{field.required ? " · Required" : ""}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(field)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(field.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}