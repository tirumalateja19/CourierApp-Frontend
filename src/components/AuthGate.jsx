import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";

const AuthGate = ({ requiredRole, guestOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (guestOnly) {
    if (user) {
      const dashboard =
        user.role === "admin" ? "/admin/dashboard" : "/partner/dashboard";
      return <Navigate to={dashboard} replace />;
    }
    return <Outlet />;
  }

  if (!user) {
    const loginPath =
      requiredRole === "admin" ? "/admin/login" : "/partner/login";
    return <Navigate to={loginPath} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const ownDashboard =
      user.role === "admin" ? "/admin/dashboard" : "/partner/dashboard";
    return <Navigate to={ownDashboard} replace />;
  }

  return <Outlet />;
};

export default AuthGate;
