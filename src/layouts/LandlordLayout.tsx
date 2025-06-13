import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  Home, 
  CreditCard, 
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Bell,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config/constants';
import ThemeToggle from '../components/shared/ThemeToggle';

const LandlordLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sample notifications - would come from API in real app
  const notifications = [
    { id: 1, message: 'New rent payment received', time: '10 min ago', read: false },
    { id: 2, message: 'New complaint submitted', time: '2 hours ago', read: false },
    { id: 3, message: 'Property inspection scheduled', time: 'Yesterday', read: true },
  ];

  const navItems = [
    { path: '/landlord/dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/landlord/tenants', name: 'Manage Tenants', icon: <Users className="w-5 h-5" /> },
    { path: '/landlord/properties', name: 'Properties', icon: <Home className="w-5 h-5" /> },
    { path: '/landlord/payments', name: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/landlord/complaints', name: 'Complaints', icon: <AlertTriangle className="w-5 h-5" /> },
    { path: '/landlord/reports', name: 'Reports', icon: <FileText className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Top navigation */}
      <nav className="bg-[var(--card)] shadow-sm border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/landlord/dashboard" className="flex items-center">
                  <Building2 className="h-8 w-8 text-primary-700" />
                  <span className="ml-2 text-xl font-bold text-primary-700">{APP_NAME}</span>
                </Link>
              </div>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {/* Theme toggle */}
              <ThemeToggle variant="icon" />
              
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  className="relative p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] focus:outline-none"
                  onClick={toggleNotifications}
                >
                  <Bell className="h-6 w-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-[var(--card)] border border-[var(--border)] ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-[var(--border)]">
                        <h3 className="text-sm font-medium text-[var(--foreground)]">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-2 hover:bg-[var(--accent)] border-b border-[var(--border)] ${notification.read ? '' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                            >
                              <p className="text-sm text-[var(--foreground)]">{notification.message}</p>
                              <p className="text-xs text-[var(--muted-foreground)] mt-1">{notification.time}</p>
                            </div>
                          ))
                        ) : (
                          <p className="px-4 py-2 text-sm text-[var(--muted-foreground)]">No new notifications</p>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-[var(--border)]">
                        <a href="#" className="text-xs text-primary-700 hover:text-primary-800 dark:hover:text-primary-300">Mark all as read</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="flex items-center space-x-2">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-[var(--foreground)]">{user?.name}</span>
                  <span className="text-xs text-[var(--muted-foreground)] capitalize">Landlord</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <ThemeToggle variant="icon" className="mr-2" />
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] focus:outline-none"
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
          <div className="sm:hidden bg-[var(--card)] border-b border-[var(--border)]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-700 text-primary-700'
                      : 'border-transparent text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </div>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-[var(--foreground)] hover:bg-[var(--accent)] hover:border-gray-300"
              >
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <LogOut className="w-5 h-5" />
                  <span className="ml-2">Logout</span>
                </div>
              </button>
            </div>
            
            <div className="pt-4 pb-3 border-t border-[var(--border)]">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-[var(--foreground)]">{user?.name}</div>
                  <div className="text-sm font-medium text-[var(--muted-foreground)]">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <div className="flex">
        {/* Sidebar for tablet and desktop */}
        <div className="hidden sm:flex sm:flex-col w-64 bg-[var(--card)] shadow-md h-[calc(100vh-4rem)] sticky top-16 border-r border-[var(--border)]">
          <div className="flex-grow flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700'
                      : 'text-[var(--foreground)] hover:bg-[var(--accent)]'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-[var(--border)] p-4">
            <Link to="/" className="text-sm text-primary-700 hover:text-primary-800 dark:hover:text-primary-300">
              Visit Public Site
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LandlordLayout;