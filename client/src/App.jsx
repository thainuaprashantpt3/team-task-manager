// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import ProtectedRoute from './routes/ProtectedRoute';
// import Layout from './components/layout/Layout';

// // Auth
// import Login    from './pages/Auth/Login';
// import Signup   from './pages/Auth/Signup';

// // Admin
// import AdminDashboard from './pages/Admin/Dashboard';
// import Members        from './pages/Admin/Members';
// import Reports        from './pages/Admin/Reports';

// // Member
// import MemberDashboard from './pages/Member/Dashboard';
// import MemberProjects  from './pages/Member/Projects';
// import MyTasks         from './pages/Member/MyTasks';

// // Shared
// import Projects       from './pages/Projects/Projects';
// import ProjectDetail  from './pages/Projects/ProjectDetail';
// import Tasks          from './pages/Tasks/Tasks';

// // Routes to correct dashboard based on role
// function DashboardRouter() {
//   const { isAdmin } = useAuth();
//   return isAdmin ? <AdminDashboard /> : <MemberDashboard />;
// }

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* ── Public ──────────────────────────────────── */}
//       <Route path="/login"    element={<Login />} />
//       <Route path="/register" element={<Signup />} />

//       {/* ── Authenticated (any role) ────────────────── */}
//       <Route element={<ProtectedRoute />}>
//         <Route element={<Layout />}>

//           {/* Dashboard — role-aware */}
//           <Route path="/dashboard" element={<DashboardRouter />} />

//           {/* Projects — shared */}
//           <Route path="/projects"     element={<Projects />} />
//           <Route path="/projects/:id" element={<ProjectDetail />} />

//           {/* Tasks — shared (filtered by role in backend) */}
//           <Route path="/tasks" element={<Tasks />} />

//           {/* Member-specific pages */}
//           <Route path="/member/projects" element={<MemberProjects />} />
//           <Route path="/member/tasks"    element={<MyTasks />} />

//           {/* ── Admin only ──────────────────────────── */}
//           <Route element={<ProtectedRoute role="admin" />}>
//             <Route path="/admin/members" element={<Members />} />
//             <Route path="/admin/reports" element={<Reports />} />
//           </Route>

//         </Route>
//       </Route>

//       {/* ── Catch-all ───────────────────────────────── */}
//       <Route path="/"  element={<Navigate to="/dashboard" replace />} />
//       <Route path="*"  element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             style: {
//               fontSize: '13px',
//               borderRadius: '10px',
//               fontFamily: 'Inter, sans-serif',
//             },
//             success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
//             error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
//           }}
//         />
//         <AppRoutes />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }







import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/layout/Layout';

import TeamLogs from './pages/Admin/TeamLogs';

import Login   from './pages/Auth/Login';
import Signup  from './pages/Auth/Signup';
import AdminLogin   from './pages/Auth/AdminLogin';
import AdminSignup  from './pages/Auth/AdminSignup';

import AdminDashboard  from './pages/Admin/Dashboard';
import Members         from './pages/Admin/Members';
import Reports         from './pages/Admin/Reports';

import MemberDashboard from './pages/Member/Dashboard';
import MemberProjects  from './pages/Member/Projects';
import MyTasks         from './pages/Member/MyTasks';

import Projects      from './pages/Projects/Projects';
import ProjectDetail from './pages/Projects/ProjectDetail';
import Tasks         from './pages/Tasks/Tasks';

function DashboardRouter() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <MemberDashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Signup />} />

      {/* ── Secret admin routes ──────────────────────────── */}
      <Route path="/admin-1"          element={<AdminLogin />} />
      <Route path="/admin-1/register" element={<AdminSignup />} />

          {/* ── Authenticated routes ─────────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard"       element={<DashboardRouter />} />
          <Route path="/projects"        element={<Projects />} />
          <Route path="/projects/:id"    element={<ProjectDetail />} />
          <Route path="/tasks"           element={<Tasks />} />
          <Route path="/member/projects" element={<MemberProjects />} />
          <Route path="/member/tasks"    element={<MyTasks />} />

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/members" element={<Members />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/team-logs" element={<TeamLogs />} />
          </Route>
        </Route>
      </Route>

      <Route path="/"  element={<Navigate to="/dashboard" replace />} />
      <Route path="*"  element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontSize: '13px',
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}