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
import { FileText, Database, Download, Filter } from "lucide-react"
import { Button } from "../../components/ui/button"

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
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  if (!currentForm) {
    return <EmptyState title="Form Not Found" description="The requested form does not exist." />
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 via-purple-50/30 to-pink-50/20 -mx-6 -mt-6 px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Form Responses
              </h1>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{currentForm.title}</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">{responses.length} total responses</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 shadow-sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2 shadow-sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Form Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Currently Viewing</p>
            <p className="text-lg font-semibold text-gray-900">{currentForm.title}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm">
            <Database className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">{responses.length} Response{responses.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Responses Table Card */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Submitted Responses
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {responses.length === 0 ? (
            <div className="py-12">
              <EmptyState 
                title="No Responses Yet" 
                description="Share the form link to start collecting responses. The link is available in the Forms Manager." 
                icon="Form" 
              />
            </div>
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