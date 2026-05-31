import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { fetchDashboardStats } from "../../store/slices/dashboardSlice"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import {
    PlusCircle,
    ClipboardList,
    BarChart3,
    TrendingUp,
    Users,
    FileText,
    ArrowRight,
    Calendar,
    Activity,
    Zap,
    Layers,
    Loader2
} from "lucide-react"

export default function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>()
    const { stats, loading } = useSelector((state: RootState) => state.dashboard)

    useEffect(() => {
        dispatch(fetchDashboardStats())
    }, [dispatch])

    const quickStats = [
        {
            title: "Total Forms",
            value: stats?.totalForms || 0,
            icon: Layers,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            textColor: "text-blue-600",
        },
        {
            title: "Total Responses",
            value: stats?.totalResponses || 0,
            icon: Users,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            textColor: "text-purple-600",
        },
        {
            title: "Active Forms",
            value: stats?.activeForms || 0,
            icon: Activity,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            textColor: "text-green-600",
        },
        {
            title: "Response Trend",
            value: `${stats?.responseTrend || 0}%`,
            icon: TrendingUp,
            gradient: "from-orange-500 to-red-500",
            bgGradient: "from-orange-50 to-red-50",
            textColor: "text-orange-600",
        },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading dashboard data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Here's what's happening with your forms today.
                    </p>
                </div>
                <div className="absolute right-0 top-0 opacity-10">
                    <FileText className="h-64 w-64" />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                    <Card
                        key={stat.title}
                        className="relative overflow-hidden border-0 shadow-lg card-hover animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
                        <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`rounded-lg bg-gradient-to-r ${stat.gradient} p-2 shadow-lg`}>
                                <stat.icon className={`h-4 w-4 text-white`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="flex items-baseline justify-between">
                                <div className="text-3xl font-bold">{stat.value}</div>
                                {stat.title === "Response Trend" && stats?.responseTrend && (
                                    <div className={`flex items-center gap-1 text-xs font-medium ${stats.responseTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        <TrendingUp className="h-3 w-3" />
                                        {stats.responseTrend >= 0 ? '+' : ''}{stats.responseTrend}%
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {stat.title === "Total Forms" && "Forms created"}
                                {stat.title === "Total Responses" && "Total submissions received"}
                                {stat.title === "Active Forms" && "Forms with responses"}
                                {stat.title === "Response Trend" && "vs last month"}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-1 shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription>Common tasks to manage your forms</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Link to="/admin/forms/new" className="w-full">
                            <Button className="w-full btn-transition bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create New Form
                            </Button>
                        </Link>

                        <Link to="/admin/forms" className="w-full">
                            <Button variant="outline" className="w-full btn-transition border-2">
                                <ClipboardList className="h-4 w-4 mr-2" />
                                Manage Forms
                            </Button>
                        </Link>

                        <Link to="/admin/analytics" className="w-full">
                            <Button variant="outline" className="w-full btn-transition border-2">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Analytics
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Forms */}
                <Card className="lg:col-span-2 shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Recent Forms
                        </CardTitle>
                        <CardDescription>Your most recently created forms</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats?.recentForms && stats.recentForms.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentForms.map((form, index) => (
                                    <Link
                                        key={form.id}
                                        to={`/admin/forms/${form.id}/responses`}
                                        className="block group"
                                    >
                                        <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-all duration-200 hover:border-primary/20 group-hover:translate-x-1">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium group-hover:text-primary transition-colors">
                                                        {form.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {form.fields} fields • Created {new Date(form.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No forms created yet</p>
                                <Link to="/admin/forms/new">
                                    <Button variant="link" className="mt-2">
                                        Create your first form →
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <Card className="shadow-lg border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>Latest responses and updates</CardDescription>
                </CardHeader>
                <CardContent>
                    {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                        <div className="space-y-4">
                            {stats.recentActivity.map((activity, index) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors animate-slide-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        <div>
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">Form: {activity.form}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(activity.time).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No recent activity</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">
                        <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">Pro Tip</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                            Use the analytics dashboard to track form performance and identify areas for improvement.
                            {stats && stats.totalForms > 0 && (
                                <span>
                                    You have {stats.totalForms} form
                                    {stats.totalForms !== 1 ? "s" : ""} with{" "}
                                    {stats.totalResponses} total response
                                    {stats.totalResponses !== 1 ? "s" : ""}.
                                </span>
                            )}
                        </p>
                        <Link to="/admin/analytics">
                            <Button variant="link" className="mt-2 p-0">
                                View Analytics Dashboard →
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}