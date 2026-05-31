import { useState } from "react"
import { FieldDefinition } from "../../../types/form.types"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Switch } from "../../../components/ui/switch"
import { Textarea } from "../../../components/ui/textarea"

interface FieldEditorProps {
  field: FieldDefinition
  onSave: (field: FieldDefinition) => void
  onCancel: () => void
}

const fieldTypes = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date Picker" },
  { value: "select", label: "Dropdown Select" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox (Yes/No)" },
]

export default function FieldEditor({ field, onSave, onCancel }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<FieldDefinition>({ ...field })
  const [optionsInput, setOptionsInput] = useState(field.options?.join(", ") || "")

  const handleTypeChange = (type: "text" | "number" | "select" | "radio" | "textarea" | "date" | "checkbox") => {
    const updated = { ...editedField, type }
    if (type !== "select" && type !== "radio") {
      updated.options = []
      updated.multiple = false
    }
    if (type === "checkbox") {
      updated.defaultValue = false
    }
    setEditedField(updated)
  }

  const handleOptionsChange = (input: string) => {
    setOptionsInput(input)
    const options = input.split(",").map(s => s.trim()).filter(Boolean)
    setEditedField({ ...editedField, options })
  }

  const handleAddOption = () => {
    setEditedField({ 
      ...editedField, 
      options: [...(editedField.options || []), ''] 
    })
  }

  const handleUpdateOption = (idx: number, value: string) => {
    const newOpts = [...(editedField.options || [])]
    newOpts[idx] = value
    setEditedField({ ...editedField, options: newOpts })
  }

  const handleRemoveOption = (idx: number) => {
    const newOpts = editedField.options?.filter((_, i) => i !== idx)
    setEditedField({ ...editedField, options: newOpts })
  }

  const handleSave = () => {
    if (!editedField.label.trim()) return
    onSave(editedField)
  }

  const needsOptions = editedField.type === "select" || editedField.type === "radio"
  const needsMultiple = editedField.type === "select"
  const needsPlaceholder = editedField.type !== "checkbox" && editedField.type !== "radio"
  const needsDefaultValue = editedField.type === "checkbox"

  return (
        <Card className="sticky top-6 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-50/50 border-b">
            <CardTitle className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-purple-600 rounded-full" />
            Edit Field
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
        {/* Field Label */}
        <div>
          <Label htmlFor="label">Label *</Label>
          <Input 
            id="label" 
            value={editedField.label} 
            onChange={(e) => setEditedField({ ...editedField, label: e.target.value })} 
            placeholder="Enter field label"
          />
        </div>

        {/* Field Type */}
        <div>
          <Label htmlFor="type">Field Type</Label>
          <Select value={editedField.type} onValueChange={handleTypeChange as any}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Options for Select and Radio */}
        {needsOptions && (
          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-2">
              {editedField.options?.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input 
                    value={opt} 
                    onChange={(e) => handleUpdateOption(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(idx)}>
                    ✕
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddOption} type="button">
                + Add Option
              </Button>
            </div>
          </div>
        )}

        {/* Multiple Selection (only for select) */}
        {needsMultiple && (
          <div className="flex items-center space-x-2">
            <Switch 
              id="multiple" 
              checked={editedField.multiple} 
              onCheckedChange={(checked) => setEditedField({ ...editedField, multiple: checked })} 
            />
            <Label htmlFor="multiple">Allow multiple selection</Label>
          </div>
        )}

        {/* Placeholder */}
        {needsPlaceholder && (
          <div>
            <Label htmlFor="placeholder">Placeholder (optional)</Label>
            <Input 
              id="placeholder" 
              value={editedField.placeholder || ""} 
              onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })} 
            />
          </div>
        )}

        {/* Default Value for Checkbox */}
        {needsDefaultValue && (
          <div className="flex items-center space-x-2">
            <Switch 
              id="defaultValue" 
              checked={editedField.defaultValue as boolean || false} 
              onCheckedChange={(checked) => setEditedField({ ...editedField, defaultValue: checked })} 
            />
            <Label htmlFor="defaultValue">Checked by default</Label>
          </div>
        )}

        {/* Required Field */}
        <div className="flex items-center space-x-2">
          <Switch 
            id="required" 
            checked={editedField.required} 
            onCheckedChange={(checked) => setEditedField({ ...editedField, required: checked })} 
          />
          <Label htmlFor="required">Required field</Label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Field</Button>
        </div>
      </CardContent>
    </Card>
  )
}