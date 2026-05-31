import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { fetchAnalytics } from '../../store/slices/analyticsSlice'
import { fetchForms } from '../../store/slices/formsSlice'
import { fetchResponses } from '../../store/slices/responsesSlice'
import KPICard from './components/KPICard'
import SelectDistributionChart from './components/SelectDistributionChart'
import NumericAvgChart from './components/NumericAvgChart'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { BarChart3, TrendingUp, Users, FileText, Sparkles, Calendar, Download, FileDown, FileSpreadsheet, Presentation } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { ExportService, ChartImage } from '../../services/exportService'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'

export default function AnalyticsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { forms, loading: formsLoading } = useSelector((state: RootState) => state.forms)
  const { analytics, loading: analyticsLoading } = useSelector((state: RootState) => state.analytics)
  const { responses } = useSelector((state: RootState) => state.responses)
  const [selectedFormId, setSelectedFormId] = useState<string>('')
  const [searchParams] = useSearchParams()
  const [exporting, setExporting] = useState(false)
  
  // Refs for chart elements
  const chartRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    const formId = searchParams.get('formId')    
    if (formId) {
      setSelectedFormId(formId)
    }
  }, [searchParams])

  useEffect(() => {
    dispatch(fetchForms())
  }, [dispatch])

  useEffect(() => {
    if (selectedFormId) {
      dispatch(fetchAnalytics(selectedFormId))
      dispatch(fetchResponses(selectedFormId))
    }
  }, [dispatch, selectedFormId])

  const handleFormChange = (formId: string) => {
    setSelectedFormId(formId)
  }

  const handleExport = async (format: 'pdf' | 'docx' | 'pptx' | 'csv') => {
    if (!analytics) return;
    
    setExporting(true);
    try {
      const selectFields = analytics ? Object.values(analytics.fieldStats).filter(stat => stat.type === 'select') : [];
      const numberFields = analytics ? Object.values(analytics.fieldStats).filter(stat => stat.type === 'number') : [];
      
      // Collect chart elements
      const charts: ChartImage[] = [];
      
      // Get select field chart elements
      selectFields.forEach((field, idx) => {
        const element = chartRefs.current.get(`select-chart-${idx}`);
        if (element) {
          charts.push({
            id: `select-${idx}`,
            title: `${field.label} Distribution`,
            element
          });
        }
      });
      
      // Get numeric field chart elements
      numberFields.forEach((field, idx) => {
        const element = chartRefs.current.get(`numeric-chart-${idx}`);
        if (element) {
          charts.push({
            id: `numeric-${idx}`,
            title: `${field.label} Analytics`,
            element
          });
        }
      });
      
      const stats = {
        totalSubmissions: analytics.totalSubmissions,
        numberFields,
        selectFields
      };
      
      switch (format) {
        case 'pdf':
          await ExportService.exportAsPDF(analytics.formTitle, charts, stats);
          break;
        case 'docx':
          await ExportService.exportAsDOCX(analytics.formTitle, charts, stats);
          break;
        case 'pptx':
          await ExportService.exportAsPPTX(analytics.formTitle, charts, stats);
          break;
        case 'csv':
          ExportService.exportAsCSV(analytics.formTitle, responses);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const selectedForm = forms.find(f => f._id === selectedFormId)

  if (formsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  const selectFields = analytics ? Object.values(analytics.fieldStats).filter(stat => stat.type === 'select') : []
  const numberFields = analytics ? Object.values(analytics.fieldStats).filter(stat => stat.type === 'number') : []

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-primary/5 via-purple-50/30 to-pink-50/20 -mx-6 -mt-6 px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Visualize form submission insights and track performance metrics
            </p>
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <Select onValueChange={handleFormChange} value={selectedFormId}>
              <SelectTrigger className="w-full lg:w-[320px] bg-white shadow-sm border-0">
                <SelectValue placeholder="Select a form to analyze" />
              </SelectTrigger>
              <SelectContent>
                {forms.map((form) => (
                  <SelectItem key={form._id} value={form._id}>
                    {form.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {analytics && analytics.totalSubmissions > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 shadow-sm" disabled={exporting}>
                    <Download className="h-4 w-4" />
                    {exporting ? 'Exporting...' : 'Export Report'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2 cursor-pointer">
                    <FileDown className="h-4 w-4 text-red-500" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('docx')} className="gap-2 cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                    Export as DOCX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pptx')} className="gap-2 cursor-pointer">
                    <Presentation className="h-4 w-4 text-green-500" />
                    Export as PPTX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2 cursor-pointer">
                    <FileText className="h-4 w-4 text-yellow-500" />
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {!selectedFormId ? (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <EmptyState
            title="No Form Selected"
            description="Please select a form from the dropdown above to view analytics"
            icon="Chart"
          />
        </div>
      ) : analyticsLoading ? (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      ) : analytics && analytics.totalSubmissions > 0 ? (
        <>
          {/* Form Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Currently Analyzing</p>
                <p className="text-lg font-semibold text-gray-900">{analytics.formTitle}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '0ms' }}>
              <KPICard
                title="Total Submissions"
                value={analytics.totalSubmissions}
                description={`Total responses for ${analytics.formTitle}`}
                icon={Users}
                gradient="from-blue-500 to-cyan-500"
              />
            </div>
            {numberFields.slice(0, 3).map((field, idx) => (
              <div 
                key={field.label} 
                className="animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <KPICard
                  title={`Average ${field.label}`}
                  value={field.average?.toFixed(1) || 'N/A'}
                  description={`Based on ${field.totalResponses} submission${field.totalResponses !== 1 ? 's' : ''}`}
                  icon={TrendingUp}
                  gradient="from-purple-500 to-pink-500"
                />
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Detailed Insights</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectFields.map((field, idx) => (
                <Card 
                  key={field.label} 
                  className="shadow-lg border-0 overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold">{field.label}</CardTitle>
                        <CardDescription className="mt-1">
                          Distribution of responses across options
                        </CardDescription>
                      </div>
                      {field.mostSelected && (
                        <div className="px-3 py-1 bg-green-100 rounded-full">
                          <span className="text-xs font-medium text-green-600">
                            Top: {field.mostSelected}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div ref={(el) => el && chartRefs.current.set(`select-chart-${idx}`, el)}>
                      <SelectDistributionChart data={field.distribution} title={field.label} />
                    </div>
                    <div className="mt-4 pt-3 border-t text-center">
                      <p className="text-sm text-muted-foreground">
                        Most selected: <span className="font-semibold text-foreground">{field.mostSelected || 'None'}</span>
                        {' '}({field.mostSelectedCount || 0} selections)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {numberFields.map((field, idx) => (
                <Card 
                  key={field.label} 
                  className="shadow-lg border-0 overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${(selectFields.length + idx) * 100}ms` }}
                >
                  <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                    <div>
                      <CardTitle className="text-lg font-semibold">{field.label}</CardTitle>
                      <CardDescription className="mt-1">
                        Statistical analysis of numeric responses
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div ref={(el) => el && chartRefs.current.set(`numeric-chart-${idx}`, el)}>
                      <NumericAvgChart 
                        average={field.average || 0} 
                        maxValue={field.label.includes('Rating') ? 5 : 10} 
                      />
                    </div>
                    <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Average Value</p>
                        <p className="text-xl font-bold text-primary">{field.average?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Responses</p>
                        <p className="text-xl font-semibold">{field.totalResponses}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          {analytics && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Analytics Summary</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This form has received <span className="font-semibold text-foreground">{analytics.totalSubmissions}</span> total submissions.
                    {selectFields.length > 0 && ` The most popular option across ${selectFields.length} select field${selectFields.length !== 1 ? 's' : ''} shows clear user preferences.`}
                    {numberFields.length > 0 && ` Numeric responses average ${numberFields.map(f => f.average?.toFixed(1)).join(', ')} across ${numberFields.length} field${numberFields.length !== 1 ? 's' : ''}.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <EmptyState
            title="No Submissions Yet"
            description="This form has no responses. Share the form link to start collecting data."
            icon="Chart"
          />
        </div>
      )}
    </div>
  )
}