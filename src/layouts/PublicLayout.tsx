import React from 'react';
import { Outlet } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config/constants';

const PublicLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    return user.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-blue-900" />
                <span className="ml-2 text-xl font-bold text-blue-900">{APP_NAME}</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                  Home
                </Link>
                <Link to="/properties" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                  Properties
                </Link>
              </nav>
            </div>

            {/* Right side buttons */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800">
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Sign In
                  </Link>
                  <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/properties" 
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Properties
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="block pl-3 pr-4 py-2 border-l-4 border-blue-900 text-base font-medium text-blue-900 bg-blue-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;