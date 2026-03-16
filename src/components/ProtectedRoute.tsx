import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../store/useAuthStore';
import { Result, Button } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermission, requiredRole }) => {
  const currentUser = useAuthStore((s) => s.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <Result
        status="403"
        title="Access Denied"
        subTitle="You don't have permission to access this page. Only Super Admins can manage this configuration."
        extra={
          <Button type="primary" href="/" style={{ borderRadius: 8, background: '#4f46e5' }}>
            Back to Dashboard
          </Button>
        }
      />
    );
  }

  // Permission check
  if (requiredPermission && !currentUser.permissions.includes('all') && !currentUser.permissions.includes(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
