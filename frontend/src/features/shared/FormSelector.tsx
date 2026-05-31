import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { fetchForms } from "../../store/slices/formsSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

interface FormSelectorProps {
  value: string
  onChange: (formId: string) => void
  placeholder?: string
}

export default function FormSelector({ value, onChange, placeholder = "Select a form" }: FormSelectorProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { forms, loading } = useSelector((state: RootState) => state.forms)

  useEffect(() => {
    dispatch(fetchForms())
  }, [dispatch])

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {forms.map((form) => (
          <SelectItem key={form._id} value={form._id}>
            {form.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}