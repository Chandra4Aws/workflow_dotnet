import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { WorkflowProvider } from './context/WorkflowContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Workflows from './pages/Workflows'
import WorkflowBuilder from './pages/WorkflowBuilder'
import TemplateList from './pages/TemplateList'
import SubmitWorkflow from './pages/SubmitWorkflow'
import TaskDetails from './pages/TaskDetails'
import Approvals from './pages/Approvals'
import Users from './pages/Users'
import Groups from './pages/Groups'
import Reports from './pages/Reports'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkflowProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workflows" element={<Workflows />} />
                <Route path="/workflows/templates" element={<TemplateList />} />
                <Route path="/workflows/new" element={<WorkflowBuilder />} />
                <Route path="/workflows/edit/:id" element={<WorkflowBuilder />} />
                <Route path="/workflows/submit/:templateId" element={<SubmitWorkflow />} />
                <Route path="/workflows/:id" element={<TaskDetails />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/users" element={<Users />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WorkflowProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
