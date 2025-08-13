import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import CreateTransactionPage from './pages/CreateTransactionPage';
import RoomsPage from './pages/RoomsPage';
import CreateRoomPage from './pages/CreateRoomPage';
import DisputesPage from './pages/DisputesPage';
import CreateDisputePage from './pages/CreateDisputePage';
import ProfilePage from './pages/ProfilePage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';



// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TransactionsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions/create"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateRoomPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TransactionDetailPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <RoomsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms/create"
                element={
                  <ProtectedRoute roles={['seller']}>
                    <Layout>
                      <CreateRoomPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/disputes"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DisputesPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/disputes/create"
                element={
                  <ProtectedRoute roles={['buyer']}>
                    <Layout>
                      <CreateDisputePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
