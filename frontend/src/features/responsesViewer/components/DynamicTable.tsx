import { Form } from "../../../types/form.types"
import { Response } from "../../../types/response.types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Button } from "../../../components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"

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
    if (value === undefined || value === null) return "-"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    return String(value)
  }

  const getValuePreview = (value: any) => {
    const formatted = formatValue(value)
    if (formatted.length > 50) return formatted.slice(0, 47) + "..."
    return formatted
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-white border-b-2">
              <TableHead className="font-semibold text-primary w-12">#</TableHead>
              {fieldIds.map(fieldId => (
                <TableHead key={fieldId} className="font-semibold text-primary whitespace-nowrap">
                  {fieldLabels[fieldId]}
                </TableHead>
              ))}
              <TableHead className="font-semibold text-primary whitespace-nowrap">Submitted At</TableHead>
              <TableHead className="font-semibold text-primary text-center w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, idx) => (
              <TableRow 
                key={response._id} 
                className="hover:bg-accent/30 transition-colors group border-b"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {idx + 1}
                </TableCell>
                {fieldIds.map(fieldId => (
                  <TableCell key={fieldId} className="max-w-xs">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help text-sm">
                          {getValuePreview(response.answers[fieldId])}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p className="text-xs">{formatValue(response.answers[fieldId])}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                ))}
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(response.submittedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEdit(response)}
                          className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit response</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDelete(response._id)}
                          className="hover:bg-red-100 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete response</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Footer with pagination info */}
      <div className="px-6 py-4 border-t bg-gray-50/50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{responses.length}</span> of {responses.length} responses
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live data</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}