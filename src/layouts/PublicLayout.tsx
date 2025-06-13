import React from 'react';
import { Outlet } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config/constants';
import ThemeToggle from '../components/shared/ThemeToggle';

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
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="bg-[var(--card)] shadow-sm border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-primary-700" />
                <span className="ml-2 text-xl font-bold text-primary-700">{APP_NAME}</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-[var(--foreground)] hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300">
                  Home
                </Link>
                {/* <Link to="/properties" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"> */}
                {/*   Properties */}
                {/* </Link> */}
              </nav>
            </div>

            {/* Right side buttons */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {/* Theme toggle */}
              <ThemeToggle variant="minimal" />

              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800">
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="inline-flex items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-md text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--accent)]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="inline-flex items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-md text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--accent)]">
                    Sign In
                  </Link>
                  <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <ThemeToggle variant="icon" className="mr-2" />
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
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
          <div className="sm:hidden bg-[var(--card)]" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-[var(--foreground)] hover:bg-[var(--accent)] hover:border-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {/* <Link  */}
              {/*   to="/properties"  */}
              {/*   className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
              {/*   onClick={() => setMobileMenuOpen(false)} */}
              {/* > */}
              {/*   Properties */}
              {/* </Link> */}
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="block pl-3 pr-4 py-2 border-l-4 border-primary-700 text-base font-medium text-primary-700 bg-primary-50 dark:bg-primary-900/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-[var(--foreground)] hover:bg-[var(--accent)] hover:border-gray-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-[var(--foreground)] hover:bg-[var(--accent)] hover:border-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-[var(--foreground)] hover:bg-[var(--accent)] hover:border-gray-300"
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
      <footer className="bg-[var(--card)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;