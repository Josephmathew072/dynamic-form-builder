import { Form } from "../../../types/form.types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Eye, TableProperties, BarChart3, Copy, ExternalLink, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../store/store"
import { deleteForm } from "../../../store/slices/formsSlice"

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
    <Card className="card-hover relative">
      <CardHeader>
        <CardTitle className="truncate pr-16">{form.title}</CardTitle>
        <CardDescription>{form.description || "No description"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {form.fields?.length ?? 0} field{(form.fields?.length ?? 0) !== 1 ? "s" : ""}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Created: {new Date(form.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Link to={`/admin/forms/${form._id}/responses`}>
          <Button variant="outline" size="sm">
            <TableProperties className="h-4 w-4 mr-1" />
            Responses
          </Button>
        </Link>
        <Link to={`/admin/analytics?formId=${form._id}`}>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={copyLink}>
          {copied ? "Copied!" : <><Copy className="h-4 w-4 mr-1" /> Share</>}
        </Button>
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
          <Trash2 className="h-4 w-4 mr-1" />
          {deleting ? "..." : "Delete"}
        </Button>
        <Link to={`/form/${form.shareableId}`} target="_blank">
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}