import { Form } from "../../../types/form.types"
import { Response } from "../../../types/response.types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Button } from "../../../components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface DynamicTableProps {
  form: Form
  responses: Response[]
  onEdit: (response: Response) => void
  onDelete: (responseId: string) => void
}

export default function DynamicTable({ form, responses, onEdit, onDelete }: DynamicTableProps) {
  const fieldIds = form.fields.map(f => f.id)
  const fieldLabels = form.fields.reduce((acc, f) => ({ ...acc, [f.id]: f.label }), {} as Record<string, string>)

  const formatValue = (value: any) => {
    if (Array.isArray(value)) return value.join(", ")
    if (typeof value === "object") return JSON.stringify(value)
    return String(value ?? "-")
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            {fieldIds.map(fieldId => (
              <TableHead key={fieldId}>{fieldLabels[fieldId]}</TableHead>
            ))}
            <TableHead>Submitted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((response, idx) => (
            <TableRow key={response._id}>
              <TableCell>{idx + 1}</TableCell>
              {fieldIds.map(fieldId => (
                <TableCell key={fieldId}>{formatValue(response.answers[fieldId])}</TableCell>
              ))}
              <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(response)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(response._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}