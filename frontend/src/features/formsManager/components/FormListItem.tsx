import { Form } from "../../../types/form.types"
import { Button } from "../../../components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Eye, TableProperties, BarChart3, Copy, ExternalLink, Edit, Trash2, Calendar, FileText } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../store/store"
import { deleteForm } from "../../../store/slices/formsSlice"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"

interface FormListItemProps {
  form: Form
}

export default function FormListItem({ form }: FormListItemProps) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  
  const publicUrl = `${window.location.origin}/form/${form.shareableId}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${form.title}"? This will also delete all responses.`)) {
      setDeleting(true)
      try {
        await dispatch(deleteForm(form._id)).unwrap()
      } catch (error) {
        alert("Failed to delete form")
      } finally {
        setDeleting(false)
      }
    }
  }

  const handleEdit = () => {
    navigate(`/admin/forms/edit/${form._id}`)
  }

  return (
    <TooltipProvider>
      <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <h3 className="font-semibold text-lg truncate">{form.title}</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
              {form.fields?.length ?? 0} fields
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {form.description || "No description"}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(form.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/admin/forms/${form._id}/responses`}>
                <Button variant="outline" size="sm">
                  <TableProperties className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Responses</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>View form responses</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/admin/analytics?formId=${form._id}`}>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Analytics</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>View analytics dashboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy shareable link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit form</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">{deleting ? "..." : "Delete"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete form permanently</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/form/${form.shareableId}`} target="_blank">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Open public form</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}