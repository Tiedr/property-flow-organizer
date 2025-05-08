
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
import Clients from "./pages/Clients";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Fix: Make sure App is defined as a function component properly
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              {/* Updated routing to fix the 404 issue */}
              <Route path="/" element={<Navigate to="/estates" />} />
              <Route path="/estates" element={
                <AuthGuard>
                  <EstateTable />
                </AuthGuard>
              } />
              <Route path="/estates/:id" element={
                <AuthGuard>
                  <EstateDetailPage />
                </AuthGuard>
              } />
              <Route path="/clients" element={
                <AuthGuard>
                  <Clients />
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
              <Route path="/dashboard" element={<Navigate to="/estates" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
