import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import ForgotPassword from "./pages/forgot-password";
import MriPage from "./pages/check-mri";
import ManageUsersPage from "./pages/manage-user";
import ManageOrgsPage from "./pages/manage-organization";
import ManagePage from "./pages/manage-account";
import DashboardLayout from "./components/layout/dashboard";
import HelpPage from "./pages/help";
import ManageDataPage from "./pages/manage-mri";
import withAuthProtection from "./components/hoc/withAuthProtection";
import HomeRedirect from "./components/home-redirect";

function AppRoutes() {
  const protectedRoutes = [
    { path: "", component: MriPage },
    { path: "mri", component: MriPage },
    { path: "users", component: ManageUsersPage },
    { path: "organizations", component: ManageOrgsPage },
    { path: "manage", component: ManagePage },
    { path: "help", component: HelpPage },
    { path: "data", component: ManageDataPage },
  ];

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        {protectedRoutes.map(({ path, component }) => {
          const Protected = withAuthProtection(component);
          return (
            <Route
              key={path}
              path={path}
              element={React.createElement(Protected)}
            />
          );
        })}
      </Route>
      {/* fallback route (optional) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
