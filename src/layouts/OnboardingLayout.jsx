import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function OnboardingLayout() {
  const { user, isOnboarded, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (isOnboarded) return <Navigate to="/feed" />;
  return <Outlet />;
}
