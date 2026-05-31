import { useEffect, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { Form, Response } from "../../../types/form.types"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import MultiSelectDropdown from "../../publicForm/components/MultiSelectDropdown"

interface EditResponseModalProps {
    open: boolean
    onClose: () => void
    response: Response | null
    form: Form | null
    onSave: (answers: Record<string, any>) => Promise<void>
}

export default function EditResponseModal({ open, onClose, response, form, onSave }: EditResponseModalProps) {
    const [saving, setSaving] = useState(false)
    const methods = useForm()
    const { register, handleSubmit, setValue, watch, control } = methods

    useEffect(() => {
        if (response && form) {
            form.fields.forEach(field => {
                setValue(
                    field.id,
                    response.answers?.[field.id] ??
                    (field.multiple ? [] : "")
                )
            })
        }
    }, [response, form, setValue])

    const onSubmit = async (data: any) => {
        setSaving(true)
        try {
            await onSave(data)
            onClose()
        } catch (error) {
            console.error("Failed to update response:", error)
        } finally {
            setSaving(false)
        }
    }

    if (!form || !response) return null

    const renderField = (field: any) => {
        switch (field.type) {
            case "text":
                return <Input {...register(field.id)} placeholder={field.placeholder} />
            case "number":
                return <Input {...register(field.id, { valueAsNumber: true })} type="number" placeholder={field.placeholder} />
            case "select":
                if (field.multiple) {
                    return (
                        <MultiSelectDropdown
                            options={field.options || []}
                            value={watch(field.id) || []}
                            onChange={(newValue) => setValue(field.id, newValue)}
                            placeholder={`Select ${field.label}`}
                        />
                    )
                }
                return (
                    <Select onValueChange={(val) => setValue(field.id, val)} value={watch(field.id)}>
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((opt: string) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            default:
                return <Input {...register(field.id)} />
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Response for {form.title}</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {form.fields.map((field) => (
                            <div key={field.id} className="space-y-2">
                                <Label>
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </Label>
                                {renderField(field)}
                            </div>
                        ))}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}