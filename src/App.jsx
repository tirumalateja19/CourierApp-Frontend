import { BrowserRouter, Routes, Route } from "react-router";
import AuthGate from "./components/AuthGate";
import Landing from "./components/Landing";
import AdminLogin from "./admin/AdminLogin";
import PartnerLogin from "./partner/PartnerLogin";
import Layout from "./components/Layout";
import AdminDashboard from "./admin/AdminDashboard";
import PartnerDashboard from "./partner/PartnerDashboard";
import ChangePassword from "./auth/ChangePassword";
import CreatePartner from "./admin/CreatePartner";
import Partners from "./admin/Partners";
import CreateJob from "./admin/CreateJob";
import { Toaster } from "react-hot-toast";
import PartnerJobDetail from "./partner/PartnerJobDetail";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<AuthGate guestOnly />}>
          <Route path="/" element={<Landing />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
        </Route>

        <Route element={<AuthGate requiredRole="admin" />}>
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/partners" element={<Partners />}></Route>
            <Route
              path="/admin/jobs/create-job"
              element={<CreateJob />}
            ></Route>
            <Route
              path="/admin/jobs/create-partner"
              element={<CreatePartner />}
            ></Route>
          </Route>
        </Route>

        <Route element={<AuthGate requiredRole="partner" />}>
          <Route element={<Layout />}>
            <Route path="/partner/dashboard" element={<PartnerDashboard />} />
            <Route
              path="/partner/jobs/:id"
              element={<PartnerJobDetail />}
            ></Route>
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
