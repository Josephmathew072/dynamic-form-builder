import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TooltipProvider } from './components/ui/tooltip'
import LoginPage from './features/auth/LoginPage';
import CreateAdminPage from './features/auth/CreateAdminPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './features/admin/AdminDashboard';
import FormsManagerPage from './features/formsManager/FormsManagerPage';
import FormBuilderPage from './features/formBuilder/FormBuilderPage';
import ResponsesPage from './features/responsesViewer/ResponsesPage';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import PublicFormPage from './features/publicForm/PublicFormPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './features/landing/LandingPage';

function App() {
  return (
    <TooltipProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/form/:shareableId" element={<PublicFormPage />} />
        
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="forms" element={<FormsManagerPage />} />
          <Route path="forms/new" element={<FormBuilderPage />} />
          <Route path="forms/edit/:formId" element={<FormBuilderPage />} />
          <Route path="forms/:formId/responses" element={<ResponsesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="create-admin" element={
            <ProtectedRoute superAdminOnly>
              <CreateAdminPage />
            </ProtectedRoute>
          } />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;