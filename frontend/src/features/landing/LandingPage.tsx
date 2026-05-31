import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { FileText, LayoutDashboard, Share2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dynamic Form Builder
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Create, share, and analyze forms with ease. Fully dynamic form builder with analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="card-hover">
            <CardHeader>
              <LayoutDashboard className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Manage forms, view responses, and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin">
                <Button className="w-full btn-transition">Go to Admin</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Form Builder</CardTitle>
              <CardDescription>Create custom forms with text, number, and select fields</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/forms/new">
                <Button variant="outline" className="w-full btn-transition">Create New Form</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <Share2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Public Forms</CardTitle>
              <CardDescription>Share forms via unique links and collect responses</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/forms">
                <Button variant="outline" className="w-full btn-transition">View All Forms</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Built with React, TypeScript, Express, MongoDB</p>
          <p className="mt-1">Dynamic form builder – fully customizable schemas</p>
        </div>
      </div>
    </div>
  )
}