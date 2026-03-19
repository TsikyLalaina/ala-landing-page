import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function PublicLayout() {
  const { user, isOnboarded, loading } = useAuth();
  if (loading) return <Outlet />;
  
  if (user) {
    if (!isOnboarded) return <Navigate to="/onboarding" />;
    return <Navigate to="/feed" />;
  }
  return <Outlet />;
}
