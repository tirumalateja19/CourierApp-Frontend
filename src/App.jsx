import { BrowserRouter, Routes, Route } from "react-router";
import PartnerLogin from "./partner/PartnerLogin";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import PartnerDashboard from "./partner/PartnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./components/Landing";
import GuestRoute from "./components/GuestRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute/>}>
          <Route path="/" element={<Landing />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="partner" />}>
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
