import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              {/* Catch all unknown routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
