import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import AuthModal from './AuthModal';

interface NavbarProps {
  onNavigate?: (page: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      if (onNavigate) onNavigate('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => onNavigate?.('home')}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FA</span>
                </div>
                <span className="font-bold text-xl hidden sm:block">
                  Futuristic AI Solutions
                </span>
                <span className="font-bold text-xl sm:hidden">Futuristic AI</span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => onNavigate?.('home')}
                className="hover:text-cyan-400 transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => onNavigate?.('support')}
                className="hover:text-cyan-400 transition-colors"
              >
                Support
              </button>
              {user ? (
                <>
                  <button
                    onClick={() => onNavigate?.('dashboard')}
                    className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => onNavigate?.('profile')}
                    className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <UserCircle size={18} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-red-900/40 text-red-400 border border-slate-700 hover:border-red-500/50 rounded-lg transition-all"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => {
                    onNavigate?.('home');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-cyan-400 transition-colors"
                >
                  Products
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('support');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-cyan-400 transition-colors"
                >
                  Support
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        onNavigate?.('dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors"
                    >
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate?.('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors"
                    >
                      <UserCircle size={18} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <User size={18} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
