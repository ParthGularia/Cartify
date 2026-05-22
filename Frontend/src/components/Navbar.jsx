import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { ShoppingCart, Menu, X, Bot, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';

const Navbar = ({ cartItemsCount, onChatToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Close any open UI elements
    setShowProfileModal(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const username = user?.user_metadata?.firstName || user?.email?.split('@')[0] || 'User';
  const initial = username.charAt(0).toUpperCase();

  // Disable website scroll on component mount
  useEffect(() => {
    document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl md:text-2xl font-bold tracking-wider text-gray-800 no-underline hover:text-black">
                Cartify
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex space-x-20">
                <NavLink
                  to="/women"
                  className={({ isActive }) =>
                    `px-3 py-2 text-lg font-bold pointer-events-none ${isActive ? 'text-black border-b-2 border-black' : 'text-gray-800 hover:text-black'
                    }`
                  }
                >
                  Women
                </NavLink>
                <NavLink
                  to="/men"
                  className={({ isActive }) =>
                    `px-3 py-2 text-lg font-bold pointer-events-none ${isActive ? 'text-black border-b-2 border-black' : 'text-gray-800 hover:text-black'
                    }`
                  }
                >
                  Men
                </NavLink>
                <NavLink
                  to="/kids"
                  className={({ isActive }) =>
                    `px-3 py-2 text-lg font-bold pointer-events-none ${isActive ? 'text-black border-b-2 border-black' : 'text-gray-800 hover:text-black'
                    }`
                  }
                >
                  Kids
                </NavLink>
                <NavLink
                  to="/baby"
                  className={({ isActive }) =>
                    `px-3 py-2 text-lg font-bold pointer-events-none ${isActive ? 'text-black border-b-2 border-black' : 'text-gray-800 hover:text-black'
                    }`
                  }
                >
                  Baby
                </NavLink>
              </div>
            </div>

            {/* User Profile, Cart and Menu Icons */}
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-3 mr-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm cursor-pointer" onClick={() => setShowProfileModal(true)}>
                    {initial}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{username}</span>
                  {role && role === 'seller' && (
                    <NavLink to="/seller" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      My Shop
                    </NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-600 hover:text-red-800 ml-2 cursor-pointer flex items-center"
                  >
                    Logout
                  </button>
                </div>
              )}

              {user && role !== 'seller' && (
                <NavLink
                  to="/cart"
                  className="text-gray-800 hover:text-black p-2 relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </NavLink>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden ml-2 p-2 text-white hover:text-gray-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/80 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <NavLink
                  to="/women"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium pointer-events-none ${isActive ? 'text-white bg-black/50' : 'text-gray-300 hover:text-white hover:bg-black/30'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Women
                </NavLink>
                <NavLink
                  to="/men"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium pointer-events-none ${isActive ? 'text-white bg-black/50' : 'text-gray-300 hover:text-white hover:bg-black/30'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Men
                </NavLink>
                <NavLink
                  to="/kids"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium pointer-events-none ${isActive ? 'text-white bg-black/50' : 'text-gray-300 hover:text-white hover:bg-black/30'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kids
                </NavLink>
                <NavLink
                  to="/baby"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium pointer-events-none ${isActive ? 'text-white bg-black/50' : 'text-gray-300 hover:text-white hover:bg-black/30'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Baby
                </NavLink>
                {user && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center px-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
                        {initial}
                      </div>
                      <span className="ml-3 text-base font-medium text-white">{username}</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-black/30"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowProfileModal(true);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-black/30"
                    >
                      View Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Floating Chatbot Button */}
      <button
        onClick={onChatToggle}
        className="fixed bottom-6 right-6 text-white hover:text-gray-200 p-4 rounded-full bg-black/80 shadow-lg z-50 group cursor-pointer"
        aria-label="Open chat"
      >
        <Bot className="w-6 h-6" />
        <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-[spin_3s_linear_infinite]"></div>
      </button>

      {/* Profile Modal */}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
};

export default Navbar;