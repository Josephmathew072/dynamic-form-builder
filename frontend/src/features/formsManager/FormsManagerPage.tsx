import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { fetchForms } from "../../store/slices/formsSlice"
import FormCard from "./components/FormCard"
import LoadingSpinner from "../../components/shared/LoadingSpinner"
import EmptyState from "../../components/shared/EmptyState"
import { Button } from "../../components/ui/button"
import { Link } from "react-router-dom"
import { PlusCircle } from "lucide-react"

export default function FormsManagerPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { forms, loading } = useSelector((state: RootState) => state.forms)

  useEffect(() => {
    dispatch(fetchForms())
  }, [dispatch])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms Manager</h1>
          <p className="text-muted-foreground mt-1">Manage your forms and share them with users</p>
        </div>
        <Link to="/admin/forms/new">
          <Button className="btn-transition">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </Link>
      </div>

      {forms.length === 0 ? (
        <EmptyState title="No Forms Yet" description="Create your first dynamic form using the form builder." icon="Form" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form, index) => (
            <FormCard key={form._id || `form-${index}`} form={form} />
          ))}
        </div>
      )}
    </div>
  )
}