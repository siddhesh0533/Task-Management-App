import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import Tasks      from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Reports    from './pages/Reports';
import ReportForm from './pages/ReportForm';
import NotFound   from './pages/NotFound';

/* Authenticated shell with sidebar */
const AppShell = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <main className="min-h-screen overflow-y-auto">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#18181f',
              color: '#e8e8f0',
              border: '1px solid #2c2c38',
              borderRadius: '8px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#18181f' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#18181f' } },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected — any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppShell><Dashboard /></AppShell>} />
            <Route path="/tasks" element={<AppShell><Tasks /></AppShell>} />
            <Route path="/tasks/:id" element={<AppShell><TaskDetail /></AppShell>} />
          </Route>

          {/* Manager only */}
          <Route element={<ProtectedRoute role="manager" />}>
            <Route path="/reports" element={<AppShell><Reports /></AppShell>} />
          </Route>

          {/* Employee only */}
          <Route element={<ProtectedRoute role="employee" />}>
            <Route path="/reports/new" element={<AppShell><ReportForm /></AppShell>} />
            <Route path="/my-reports"  element={<AppShell><Reports /></AppShell>} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*"    element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
