import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Budgets from './pages/Budgets';
import Landing from "./pages/Landing";
import PublicRoute from "./components/PublicRoute";
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: 'var(--color-app-surface)',
                color: 'var(--color-app-text)',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/dashboard"
                element={
                  <Dashboard />
                } />
              <Route
                path="/add-expense"
                element={
                  <AddExpense />
                } />
              <Route
                path="/history"
                element={
                  <History />
                } />
              <Route
                path="/budgets"
                element={
                  <Budgets />
                } />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
