import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/feed" />;
  return <Outlet />;
}
