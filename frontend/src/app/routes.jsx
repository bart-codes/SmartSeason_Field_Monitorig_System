import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './RootLayout';
import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import AgentDirectory from './pages/AgentDirectory';
import NotFound from './pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate replace to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="fields" element={<Fields />} />
        <Route path="agents" element={<AgentDirectory />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
