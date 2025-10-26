import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';

// Auth hook to monitor login state
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { isAuthenticated, loading };
}

// Protected route wrapper for v6+
function PrivateRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Log out button must be inside Router context for useNavigate to work!
import { useNavigate } from 'react-router-dom';
function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      style={{
        position: 'absolute',
        right: 20,
        top: 20,
        padding: '8px 16px',
        zIndex: 1000
      }}
      onClick={handleLogout}
    >
      Log out
    </button>
  );
}

// Main App (LogoutButton is now inside Router context)
function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      {isAuthenticated && <LogoutButton />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Inventory />
            </PrivateRoute>
          }
        />
        {/* Add more protected routes below */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
