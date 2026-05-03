import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Navbar from './components/Navbar';

// Public pages — Navbar shown but no login required
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

// Protected pages — login required
function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <Navbar />
      {children}
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: 14 }
        }} />
        <Routes>
          {/* Public routes — no login needed */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
          <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />

          {/* Protected routes — login required */}
          <Route path="/cart" element={<ProtectedLayout><Cart /></ProtectedLayout>} />
          <Route path="/checkout" element={<ProtectedLayout><Checkout /></ProtectedLayout>} />
          <Route path="/orders" element={<ProtectedLayout><Orders /></ProtectedLayout>} />
          <Route path="/orders/:id" element={<ProtectedLayout><OrderDetail /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
          <Route path="/wallet" element={<ProtectedLayout><Wallet /></ProtectedLayout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;