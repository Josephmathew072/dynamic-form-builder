import { useState } from "react"
import { FieldDefinition } from "../../../types/form.types"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Switch } from "../../../components/ui/switch"

interface FieldEditorProps {
  field: FieldDefinition
  onSave: (field: FieldDefinition) => void
  onCancel: () => void
}

export default function FieldEditor({ field, onSave, onCancel }: FieldEditorProps) {
  const [editedField, setEditedField] = useState<FieldDefinition>({ ...field })
  const [optionsInput, setOptionsInput] = useState(field.options?.join(", ") || "")

  const handleTypeChange = (type: "text" | "number" | "select") => {
    const updated = { ...editedField, type }
    if (type !== "select") {
      updated.options = []
      updated.multiple = false
    }
    setEditedField(updated)
  }

  const handleOptionsChange = (input: string) => {
    setOptionsInput(input)
    const options = input.split(",").map(s => s.trim()).filter(Boolean)
    setEditedField({ ...editedField, options })
  }

  const handleSave = () => {
    if (!editedField.label.trim()) return
    onSave(editedField)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Field</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={editedField.label} onChange={(e) => setEditedField({ ...editedField, label: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="type">Field Type</Label>
          <Select value={editedField.type} onValueChange={handleTypeChange as any}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="select">Select</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* {editedField.type === "select" && (
          <>
            <div>
              <Label htmlFor="options">Options (comma separated)</Label>
              <Input id="options" value={optionsInput} onChange={(e) => handleOptionsChange(e.target.value)} placeholder="Option 1, Option 2, Option 3" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="multiple" checked={editedField.multiple} onCheckedChange={(checked) => setEditedField({ ...editedField, multiple: checked })} />
              <Label htmlFor="multiple">Allow multiple selection</Label>
            </div>
          </>
        )} */}
        {editedField.type === "select" && (
            <>
                <Label>Options</Label>
                <div className="space-y-2">
                {editedField.options?.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                    <Input value={opt} onChange={(e) => {
                        const newOpts = [...(editedField.options || [])];
                        newOpts[idx] = e.target.value;
                        setEditedField({ ...editedField, options: newOpts });
                    }} />
                    <Button variant="ghost" size="icon" onClick={() => {
                        const newOpts = editedField.options?.filter((_, i) => i !== idx);
                        setEditedField({ ...editedField, options: newOpts });
                    }}>✕</Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setEditedField({ ...editedField, options: [...(editedField.options || []), ''] })}>
                    + Add Option
                </Button>
                </div>
                <div className="flex items-center space-x-2">
                <Switch id="multiple" checked={editedField.multiple} onCheckedChange={(checked) => setEditedField({ ...editedField, multiple: checked })} />
                <Label htmlFor="multiple">Allow multiple selection</Label>
                </div>
            </>
        )}
        <div>
          <Label htmlFor="placeholder">Placeholder (optional)</Label>
          <Input id="placeholder" value={editedField.placeholder || ""} onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="required" checked={editedField.required} onCheckedChange={(checked) => setEditedField({ ...editedField, required: checked })} />
          <Label htmlFor="required">Required field</Label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </CardContent>
    </Card>
  )
}