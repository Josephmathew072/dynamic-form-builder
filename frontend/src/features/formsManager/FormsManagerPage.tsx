import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { fetchForms } from "../../store/slices/formsSlice"
import FormCard from "./components/FormCard"
import FormListItem from "./components/FormListItem"
import LoadingSpinner from "../../components/shared/LoadingSpinner"
import EmptyState from "../../components/shared/EmptyState"
import { Button } from "../../components/ui/button"
import { Link } from "react-router-dom"
import { PlusCircle, LayoutGrid, List, Search } from "lucide-react"
import { Input } from "../../components/ui/input"

export default function FormsManagerPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { forms, loading } = useSelector((state: RootState) => state.forms)
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    return (localStorage.getItem("formViewMode") as "grid" | "list") || "grid"
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchForms())
  }, [dispatch])

  const filteredForms = forms.filter(form => 
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode)
    localStorage.setItem("formViewMode", mode)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {viewMode === "grid" ? (
              <LayoutGrid className="h-8 w-8 text-primary" />
            ) : (
              <List className="h-8 w-8 text-primary" />
            )}
            <h1 className="text-3xl font-bold tracking-tight">Forms Manager</h1>
          </div>
          <p className="text-muted-foreground">Create, manage, and share your dynamic forms</p>
        </div>
        <Link to="/admin/forms/new">
          <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Form
          </Button>
        </Link>
      </div>

      {forms.length === 0 ? (
        <EmptyState 
          title="No Forms Yet" 
          description="Create your first dynamic form using the form builder. Start collecting responses today!" 
          icon="Form" 
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewModeChange("grid")}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewModeChange("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>
              <p className="text-sm text-muted-foreground ml-2">
                Showing <span className="font-semibold text-foreground">{filteredForms.length}</span> of {forms.length} form{forms.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No forms match your search</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form, index) => (
                <div 
                  key={form._id}
                  className="animate-in fade-in duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FormCard form={form} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredForms.map((form, index) => (
                <div 
                  key={form._id}
                  className="animate-in fade-in duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <FormListItem form={form} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}