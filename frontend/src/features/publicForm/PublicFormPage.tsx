import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { fetchFormByShareableId, clearCurrentForm } from '../../store/slices/formsSlice'
import { submitResponse } from '../../store/slices/responsesSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import DynamicField from './components/DynamicField'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function PublicFormPage() {
    const { shareableId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { currentForm, loading } = useSelector((state: RootState) => state.forms)
    const [submitted, setSubmitted] = useState(false)

    const methods = useForm()
    const { handleSubmit, formState: { errors, isSubmitting } } = methods

    useEffect(() => {
        if (shareableId) {
            dispatch(fetchFormByShareableId(shareableId))
        }
        return () => {
            dispatch(clearCurrentForm())
        }
    }, [dispatch, shareableId])

    const onSubmit = async (data: any) => {
        if (!currentForm) return

        try {
            await dispatch(submitResponse({
                formId: currentForm._id,
                answers: data
            })).unwrap()
            setSubmitted(true)
        } catch (error) {
            console.error('Submission failed:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!currentForm) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md w-full mx-4">
                    <CardHeader>
                        <CardTitle className="text-red-600">Form Not Found</CardTitle>
                        <CardDescription>
                            The form you're looking for doesn't exist or has been removed.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <Card className="max-w-md w-full mx-4 text-center animate-fade-in">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle>Thank You!</CardTitle>
                        <CardDescription>
                            Your response has been submitted successfully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => {
                                setSubmitted(false)
                                methods.reset()
                                if (shareableId) {
                                    dispatch(fetchFormByShareableId(shareableId))
                                }
                            }}
                            className="btn-transition"
                        >
                            Submit Another Response
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="container max-w-2xl mx-auto px-4">
                <Card className="animate-slide-up">
                    <CardHeader>
                        <CardTitle className="text-2xl">{currentForm.title}</CardTitle>
                        {currentForm.description && (
                            <CardDescription>{currentForm.description}</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {currentForm.fields.map((field) => (
                                    <DynamicField
                                        key={field.id}
                                        field={field}
                                        error={errors[field.id]?.message as string}
                                    />
                                ))}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-transition"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Response'}
                                </Button>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}