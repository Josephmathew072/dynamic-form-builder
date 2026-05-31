// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store/store';

// export default function ProtectedRoute({ children, adminOnly = false, superAdminOnly = false }: { children: JSX.Element; adminOnly?: boolean; superAdminOnly?: boolean }) {
//   const { user, token } = useSelector((state: RootState) => state.auth);
//   if (!token || !user) return <Navigate to="/login" replace />;
//   if (adminOnly && user.role !== 'admin' && user.role !== 'superadmin') return <Navigate to="/" replace />;
//   if (superAdminOnly && user.role !== 'superadmin') return <Navigate to="/admin" replace />;
//   return children;
// }

export default function ProtectedRoute({ children }: { children: JSX.Element; adminOnly?: boolean; superAdminOnly?: boolean }) {
  // Bypass all auth checks – always allow access
  return children;
}