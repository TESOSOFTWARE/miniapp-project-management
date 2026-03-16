import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import Settings from './pages/Settings';
import Overview from './pages/Overview';
import ProjectDashboard from './pages/ProjectDashboard';
import ResourceDashboard from './pages/ResourceDashboard';
import Team from './pages/Team';
import Login from './pages/Login';
import AdminManagement from './pages/AdminManagement';
import ProjectDetail from './pages/ProjectDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { useDashboardStore } from './store/useDashboardStore';
import { useAuthStore } from './store/useAuthStore';

const App: React.FC = () => {
  const { sheetId } = useDashboardStore();
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />

        {/* Protected routes */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="/" element={sheetId ? <ProjectDashboard /> : <Navigate to="/settings" />} />
          <Route path="/project/:projectIndex" element={sheetId ? <ProjectDetail /> : <Navigate to="/settings" />} />
          <Route path="/overview" element={sheetId ? <Overview /> : <Navigate to="/settings" />} />
          <Route path="/resource" element={sheetId ? <ResourceDashboard /> : <Navigate to="/settings" />} />
          <Route path="/team" element={sheetId ? <Team /> : <Navigate to="/settings" />} />
          <Route path="/settings" element={
            <ProtectedRoute requiredRole="SUPER_ADMIN">
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredPermission="manage_admins">
              <AdminManagement />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
