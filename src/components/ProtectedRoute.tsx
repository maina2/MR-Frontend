import { useAuth } from '../store/authContext';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
