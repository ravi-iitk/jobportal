import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Skeleton from '../ui/Skeleton';
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8"><Skeleton lines={6}/></div>;
  return user ? children : <Navigate to="/login" replace />;
}
