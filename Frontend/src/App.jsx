import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Navbar from './components/Navbar.jsx';
import BottomNav from './components/BottomNav.jsx';
import CustomerHome from './components/CustomerHome.jsx';
import SellerHome from './components/SellerHome.jsx';
import Search from './components/Search.jsx';
import SearchedProducts from './components/SearchedProducts.jsx';
import Cart from './components/Cart';
import Chatbot from './components/Chatbot.jsx';
import AnomalyDetection from './components/AnomalyDetection.jsx';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RedirectIfAuthenticated = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    const role = user.user_metadata?.role || 'customer';
    return <Navigate to={role === 'seller' ? '/seller' : '/women'} replace />;
  }
  return children;
};

const AppContent = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  }

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(prev =>
      quantity === 0
        ? prev.filter(item => item.id !== id)
        : prev.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleChatToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col min-h-screen">
        <Navbar 
          cartItemsCount={cartItems.length} 
          onChatToggle={handleChatToggle} 
        />
        <main className="flex-grow pt-16 pb-24 md:pb-16">
          <Routes>
            <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
            <Route path="/signup" element={<RedirectIfAuthenticated><Signup /></RedirectIfAuthenticated>} />
            <Route path="/seller" element={<ProtectedRoute><SellerHome /></ProtectedRoute>} />
            <Route path="/women" element={<ProtectedRoute><CustomerHome /></ProtectedRoute>} />
            <Route path="/men" element={<ProtectedRoute><CustomerHome /></ProtectedRoute>} />
            <Route path="/kids" element={<ProtectedRoute><CustomerHome /></ProtectedRoute>} />
            <Route path="/baby" element={<ProtectedRoute><CustomerHome /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} /></ProtectedRoute>} />
            <Route path="/search-results" element={<ProtectedRoute><SearchedProducts addToCart={addToCart} /></ProtectedRoute>} />
            <Route path="/anomaly-detection" element={<ProtectedRoute><AnomalyDetection /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        {!isAuthPage && <Search isOpen={isSearchOpen} onClose={handleSearchClose} />}
        {!isAuthPage && <BottomNav onSearchOpen={handleSearchOpen} />}
        {!isAuthPage && <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />}
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </AuthProvider>
);

export default App;