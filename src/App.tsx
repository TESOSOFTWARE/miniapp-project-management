import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import Settings from './pages/Settings';
import Overview from './pages/Overview';
import ProjectDashboard from './pages/ProjectDashboard';
import ResourceDashboard from './pages/ResourceDashboard';
import Team from './pages/Team';
import { useDashboardStore } from './store/useDashboardStore';

const App: React.FC = () => {
  const { sheetId } = useDashboardStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={sheetId ? <ProjectDashboard /> : <Navigate to="/settings" />} />
          <Route path="/overview" element={sheetId ? <Overview /> : <Navigate to="/settings" />} />
          <Route path="/resource" element={sheetId ? <ResourceDashboard /> : <Navigate to="/settings" />} />
          <Route path="/team" element={sheetId ? <Team /> : <Navigate to="/settings" />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
