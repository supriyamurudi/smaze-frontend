import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  isAuthenticated,
  allowedRoles = [],
  userRole,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
