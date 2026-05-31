import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { fetchAnalytics } from '../../store/slices/analyticsSlice'
import { fetchForms } from '../../store/slices/formsSlice'
import KPICard from './components/KPICard'
import SelectDistributionChart from './components/SelectDistributionChart'
import NumericAvgChart from './components/NumericAvgChart'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

export default function AnalyticsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { forms, loading: formsLoading } = useSelector((state: RootState) => state.forms)
  const { analytics, loading: analyticsLoading } = useSelector((state: RootState) => state.analytics)
  const [selectedFormId, setSelectedFormId] = useState<string>('')
  const [searchParams] = useSearchParams()

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
    }
  }, [dispatch, selectedFormId])

  const handleFormChange = (formId: string) => {
    setSelectedFormId(formId)
  }

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visualize form submission insights and metrics
          </p>
        </div>
        
        <Select onValueChange={handleFormChange} value={selectedFormId}>
          <SelectTrigger className="w-[280px]">
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
      </div>

      {!selectedFormId ? (
        <EmptyState
          title="No Form Selected"
          description="Please select a form from the dropdown above to view analytics"
          icon="Chart"
        />
      ) : analyticsLoading ? (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      ) : analytics && analytics.totalSubmissions > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard
              title="Total Submissions"
              value={analytics.totalSubmissions}
              description={`Total responses for ${analytics.formTitle}`}
            />
            {numberFields.slice(0, 2).map((field) => (
              <KPICard
                key={field.label}
                title={`Avg ${field.label}`}
                value={field.average?.toFixed(1) || 'N/A'}
                description={`Average value across submissions`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectFields.map((field) => (
              <Card key={field.label} className="card-hover">
                <CardHeader>
                  <CardTitle>{field.label} Distribution</CardTitle>
                  <CardDescription>
                    Most selected: {field.mostSelected || 'None'} ({field.mostSelectedCount || 0} selections)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SelectDistributionChart data={field.distribution} title={field.label} />
                </CardContent>
              </Card>
            ))}

            {numberFields.map((field) => (
              <Card key={field.label} className="card-hover">
                <CardHeader>
                  <CardTitle>{field.label} Analytics</CardTitle>
                  <CardDescription>
                    {field.totalResponses} responses | Average: {field.average?.toFixed(2) || 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NumericAvgChart average={field.average || 0} maxValue={field.label.includes('Rating') ? 5 : 10} />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No Submissions Yet"
          description="This form has no responses. Share the form link to start collecting data."
          icon="Chart"
        />
      )}
    </div>
  )
}