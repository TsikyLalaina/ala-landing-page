import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedLayout() {
  const { user, loading, isOnboarded } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!isOnboarded) return <Navigate to="/onboarding" />;
  return <Outlet />;
}
