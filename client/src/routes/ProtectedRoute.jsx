import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
// role = 'admin' | 'member' | undefined (any authenticated user)
export default function ProtectedRoute({ role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}