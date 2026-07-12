import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth";

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }
  if (user) {
    console.log("user object:", user);
    const dashboard =
      user.role === "admin" ? "/admin/dashboard" : "/partner/dashboard";
    return <Navigate to={dashboard} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
