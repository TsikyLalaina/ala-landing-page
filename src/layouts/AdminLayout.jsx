import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, loading, isOnboarded } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!isOnboarded) return <Navigate to="/onboarding" />;
  if (!isAdmin) return <Navigate to="/feed" />;
  return <Outlet />;
}
