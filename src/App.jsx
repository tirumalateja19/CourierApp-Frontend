import { BrowserRouter, Routes, Route } from "react-router";
import AuthGate from "./components/AuthGate";
import Landing from "./components/Landing";
import AdminLogin from "./admin/AdminLogin";
import PartnerLogin from "./partner/PartnerLogin";
import Layout from "./components/Layout";
import AdminDashboard from "./admin/AdminDashboard";
import PartnerDashboard from "./partner/PartnerDashboard";
import ChangePassword from "./auth/ChangePassword";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGate guestOnly />}>
          <Route path="/" element={<Landing />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
        </Route>

        <Route element={<AuthGate requiredRole="admin" />}>
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route element={<AuthGate requiredRole="partner" />}>
          <Route element={<Layout />}>
            <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          </Route>
        </Route>

        <Route element={<AuthGate />}>
          <Route element={<Layout />}>
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
