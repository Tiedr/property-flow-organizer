
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EstateTable from "./pages/EstateTable";
import EstateDetailPage from "./pages/EstateDetailPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import UserManagement from "./pages/UserManagement";
import PromoteAdmin from "./pages/PromoteAdmin";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

// Add this component to handle the admin account creation redirect
const AdminAccountSetupRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // If we're on the auth page, redirect to admin setup
    if (location.pathname === "/auth") {
      navigate("/reset-password");
    }
  }, [location.pathname, navigate]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdminAccountSetupRedirect />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <AuthGuard>
                <EstateTable />
              </AuthGuard>
            } />
            <Route path="/estates/:id" element={
              <AuthGuard>
                <EstateDetailPage />
              </AuthGuard>
            } />
            <Route path="/users" element={
              <AuthGuard requireAdmin={true}>
                <UserManagement />
              </AuthGuard>
            } />
            <Route path="/promote-admin" element={
              <PromoteAdmin />
            } />
            <Route path="/reset-password" element={
              <ResetPassword />
            } />
            {/* Add a redirect from /admin-setup for convenience */}
            <Route path="/admin-setup" element={<Navigate to="/reset-password" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
