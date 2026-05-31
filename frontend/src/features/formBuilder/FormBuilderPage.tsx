import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { createForm, updateForm, fetchFormById } from "../../store/slices/formsSlice";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import FieldList from "./components/FieldList";
import FieldEditor from "./components/FieldEditor";
import { FieldDefinition } from "../../types/form.types";
import { PlusCircle, Eye, Edit3, Save, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { Textarea } from "../../components/ui/textarea";

export default function FormBuilderPage() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentForm, loading } = useSelector((state: RootState) => state.forms);
  const isEditMode = !!formId;
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [editingField, setEditingField] = useState<FieldDefinition | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && formId) {
      dispatch(fetchFormById(formId));
    }
  }, [dispatch, formId, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentForm) {
      setTitle(currentForm.title);
      setDescription(currentForm.description || "");
      setFields(currentForm.fields);
    }
  }, [currentForm, isEditMode]);

  const addField = () => {
    const newField: FieldDefinition = {
      id: `field_${Date.now()}`,
      type: "text",
      label: "New Field",
      required: false,
      placeholder: "",
      options: [],
      multiple: false,
    };
    setFields([...fields, newField]);
    setEditingField(newField);
    setPreviewMode(false);
  };

  const updateField = (updatedField: FieldDefinition) => {
    setFields(fields.map(f => f.id === updatedField.id ? updatedField : f));
    setEditingField(null);
  };

  const deleteField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId));
    if (editingField?.id === fieldId) setEditingField(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a form title");
      return;
    }
    if (fields.length === 0) {
      alert("Please add at least one field");
      return;
    }
    setSaving(true);
    try {
      if (isEditMode && formId) {
        await dispatch(updateForm({ id: formId, data: { title, description, fields } })).unwrap();
      } else {
        await dispatch(createForm({ title, description, fields })).unwrap();
      }
      navigate("/admin/forms");
    } catch (error) {
      alert("Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setPreviewMode(false);
  };

const renderPreviewField = (field: FieldDefinition) => {
  switch (field.type) {
    case "text":
      return <Input placeholder={field.placeholder || "Text input"} disabled className="bg-gray-50" />
    case "textarea":
      return <Textarea placeholder={field.placeholder || "Long text input"} disabled className="bg-gray-50" rows={3} />
    case "number":
      return <Input type="number" placeholder={field.placeholder || "Number"} disabled className="bg-gray-50" />
    case "date":
      return <Input type="date" disabled className="bg-gray-50" />
    case "select":
      if (field.multiple) {
        return (
          <div className="border rounded-md p-2 bg-gray-50 text-gray-400 text-sm">
            Multi-select: {field.options?.slice(0, 3).join(", ")}{field.options && field.options.length > 3 ? "..." : ""}
          </div>
        )
      }
      return (
        <select disabled className="w-full border rounded-md p-2 bg-gray-50 text-gray-400">
          <option>Select {field.label}</option>
          {field.options?.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      )
    case "radio":
      return (
        <div className="space-y-1">
          {field.options?.map(opt => (
            <div key={opt} className="flex items-center gap-2">
              <input type="radio" disabled checked={false} />
              <span className="text-sm text-gray-500">{opt}</span>
            </div>
          ))}
        </div>
      )
    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <input type="checkbox" disabled checked={field.defaultValue as boolean || false} />
          <span className="text-sm text-gray-500">{field.placeholder || "Checkbox"}</span>
        </div>
      )
    default:
      return <Input disabled />
  }
}

  if (loading && isEditMode) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/forms")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Edit Form" : "Create New Form"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? "Modify form fields and settings" : "Build a custom dynamic form"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!previewMode && fields.length > 0 && (
            <Button variant="outline" onClick={() => setPreviewMode(true)} className="btn-transition">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
          {previewMode && (
            <Button variant="outline" onClick={handleEdit} className="btn-transition">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Form
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving} className="btn-transition">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Form"}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">{title || "Untitled Form"}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderPreviewField(field)}
                  <p className="text-xs text-muted-foreground">Type: {field.type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Form Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Job Application"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Fields</CardTitle>
                <Button variant="outline" size="sm" onClick={addField} className="btn-transition">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent>
                <FieldList fields={fields} onEdit={setEditingField} onDelete={deleteField} />
              </CardContent>
            </Card>
          </div>

          <div>
            {editingField && (
              <FieldEditor field={editingField} onSave={updateField} onCancel={() => setEditingField(null)} />
            )}
            {!editingField && fields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Form Structure</CardTitle>
                  <CardDescription>Click on any field to edit its properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {fields.map((field) => (
                      <div
                        key={field.id}
                        onClick={() => setEditingField(field)}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                      >
                        <div className="font-medium">{field.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {field.type} • {field.required ? "Required" : "Optional"}
                          {field.type === "select" && field.multiple && " • Multiple allowed"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {!editingField && fields.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">
                    No fields added. Click "Add Field" to start building your form.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}