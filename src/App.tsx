import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ClientTable from './pages/ClientTable';
import EstateTable from './pages/EstateTable';
import ProjectTable from './pages/ProjectTable';
import InvoiceTable from './pages/InvoiceTable';
import ClientDetailsPage from './pages/ClientDetailsPage';
import EstateDetailPage from './pages/EstateDetailPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import { useAuth } from './context/AuthContext';
import './App.css';
import ReceiptPage from "@/pages/ReceiptPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay, replace with actual loading check if needed
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/clients" element={user ? <ClientTable /> : <Navigate to="/login" />} />
      <Route path="/clients/:id" element={user ? <ClientDetailsPage /> : <Navigate to="/login" />} />
      <Route path="/estates" element={user ? <EstateTable /> : <Navigate to="/login" />} />
      <Route path="/estates/:id" element={user ? <EstateDetailPage /> : <Navigate to="/login" />} />
      <Route path="/projects" element={user ? <ProjectTable /> : <Navigate to="/login" />} />
      <Route path="/projects/:id" element={user ? <ProjectDetailsPage /> : <Navigate to="/login" />} />
      <Route path="/invoices" element={user ? <InvoiceTable /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/receipts/:id" element={<ReceiptPage />} />
    </Routes>
  );
}

export default App;
