import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";
import { Loader2 } from "lucide-react";

const AuthGate = ({ requiredRole, guestOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center py-10">
        <Loader2 size={42} className="animate-spin text-black" />
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
    return <Navigate to="/" state={{ preselectRole: requiredRole }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const ownDashboard =
      user.role === "admin" ? "/admin/dashboard" : "/partner/dashboard";
    return <Navigate to={ownDashboard} replace />;
  }

  return <Outlet />;
};

export default AuthGate;
