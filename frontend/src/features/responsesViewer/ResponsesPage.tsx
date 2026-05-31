import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { fetchResponses, updateResponse, deleteResponse } from "../../store/slices/responsesSlice"
import { fetchFormById } from "../../store/slices/formsSlice"
import DynamicTable from "./components/DynamicTable"
import EditResponseModal from "./components/EditResponseModal"
import LoadingSpinner from "../../components/shared/LoadingSpinner"
import EmptyState from "../../components/shared/EmptyState"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Response } from "../../types/response.types"

export default function ResponsesPage() {
  const { formId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { currentForm, loading: formLoading } = useSelector((state: RootState) => state.forms)
  const { responses, loading: responsesLoading } = useSelector((state: RootState) => state.responses)
  const [editingResponse, setEditingResponse] = useState<Response | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (formId) {
      dispatch(fetchFormById(formId))
      dispatch(fetchResponses(formId))
    }
  }, [dispatch, formId])

  const handleEdit = (response: Response) => {
    setEditingResponse(response)
    setModalOpen(true)
  }

  const handleDelete = async (responseId: string) => {
    if (confirm("Are you sure you want to delete this response?")) {
      await dispatch(deleteResponse(responseId))
    }
  }

  const handleSaveEdit = async (answers: Record<string, any>) => {
    if (editingResponse) {
      await dispatch(updateResponse({ id: editingResponse._id, answers }))
      if (formId) {
        dispatch(fetchResponses(formId))
      }
    }
  }

  if (formLoading || responsesLoading) {
    return <LoadingSpinner />
  }

  if (!currentForm) {
    return <EmptyState title="Form Not Found" description="The requested form does not exist." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{currentForm.title}</h1>
        <p className="text-muted-foreground mt-1">Manage submitted responses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Responses ({responses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {responses.length === 0 ? (
            <EmptyState title="No Responses Yet" description="Share the form link to collect responses." icon="Form" />
          ) : (
            <DynamicTable 
              form={currentForm} 
              responses={responses} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <EditResponseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        response={editingResponse}
        form={currentForm}
        onSave={handleSaveEdit}
      />
    </div>
  )
}