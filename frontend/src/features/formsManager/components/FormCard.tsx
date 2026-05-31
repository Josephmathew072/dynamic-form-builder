import { Form } from "../../../types/form.types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { TableProperties, BarChart3, Copy, ExternalLink, Edit, Trash2, Calendar, FileText } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../store/store"
import { deleteForm } from "../../../store/slices/formsSlice"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"

interface FormCardProps {
  form: Form
}

export default function FormCard({ form }: FormCardProps) {
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
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 group-hover:h-2 transition-all duration-300" />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {form.fields?.length ?? 0} fields
                </span>
              </div>
              <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                {form.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {form.description || "No description provided"}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(form.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/admin/forms/${form._id}/responses`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <TableProperties className="h-4 w-4" />
                  <span className="ml-1">Responses</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>View all form responses</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/admin/analytics?formId=${form._id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <BarChart3 className="h-4 w-4" />
                  <span className="ml-1">Analytics</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>View form analytics</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="h-4 w-4" />
                <span className="ml-1">{copied ? "Copied!" : "Share"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy shareable link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
                <span className="ml-1">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit form structure</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="h-4 w-4" />
                <span className="ml-1">{deleting ? "..." : "Delete"}</span>
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
            <TooltipContent>Open public form in new tab</TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}