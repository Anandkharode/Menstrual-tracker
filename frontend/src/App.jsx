// frontend/src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// ── Guards ────────────────────────────────────────────────────────────────────

/** If user is logged in and tries to visit /login or /signup, push to dashboard */
function PublicRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (token) {
    // replace=true removes /login from history so Back button won't return there
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

/** If user is NOT logged in and tries to visit /dashboard, push to login */
function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ── Router ────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* / → redirect to /login (or /dashboard if already logged in) */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes — redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Protected route — chatbot only lives here */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Catch-all → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
