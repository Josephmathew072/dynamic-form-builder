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
import { CheckCircle, FileText, Sparkles } from 'lucide-react'

export default function PublicFormPage() {
    const { shareableId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { currentForm, loading } = useSelector((state: RootState) => state.forms)
    const [submitted, setSubmitted] = useState(false)

    const methods = useForm()
    const { handleSubmit, formState: { errors, isSubmitting }, reset } = methods

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <LoadingSpinner />
            </div>
        )
    }

    if (!currentForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <Card className="max-w-md w-full mx-4 shadow-xl border-0">
                    <CardHeader className="text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-10 w-10 text-red-500" />
                        </div>
                        <CardTitle className="text-2xl text-red-600">Form Not Found</CardTitle>
                        <CardDescription className="text-base mt-2">
                            The form you're looking for doesn't exist or has been removed.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                <Card className="max-w-md w-full mx-4 text-center shadow-xl border-0 animate-in zoom-in duration-500">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-green-600">Thank You!</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Your response has been submitted successfully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => {
                                setSubmitted(false)
                                reset()
                                if (shareableId) {
                                    dispatch(fetchFormByShareableId(shareableId))
                                }
                            }}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                        >
                            Submit Another Response
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12">
            <div className="container max-w-3xl mx-auto px-4">
                {/* <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Secure Form</span>
                    </div>
                </div> */}

                <Card className="shadow-2xl border-0 overflow-visible">
                    <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
                    <CardHeader className="bg-white border-b border-gray-100 pb-6">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            {currentForm.title}
                        </CardTitle>
                        {currentForm.description && (
                            <CardDescription className="text-base text-gray-600 mt-2">
                                {currentForm.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="pt-8 overflow-visible">
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 overflow-visible">
                                {currentForm.fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative overflow-visible animate-in slide-in-from-bottom-4 duration-500"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <DynamicField
                                            field={field}
                                            error={errors[field.id]?.message as string}
                                        />
                                    </div>
                                ))}
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg text-lg py-6 transition-all duration-300 transform hover:scale-[1.02]"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Submitting...
                                            </div>
                                        ) : (
                                            'Submit Response'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}