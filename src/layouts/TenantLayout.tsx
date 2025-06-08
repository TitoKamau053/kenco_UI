import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  CreditCard, 
  History, 
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config/constants';

const TenantLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sample notifications - would come from API in real app
  const notifications = [
    { id: 1, message: 'Rent payment due in 3 days', time: '10 min ago', read: false },
    { id: 2, message: 'Maintenance request approved', time: 'Yesterday', read: true },
  ];

  const navItems = [
    { path: '/tenant/dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/tenant/pay', name: 'Make Payment', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/tenant/payments', name: 'Payment History', icon: <History className="w-5 h-5" /> },
    { path: '/tenant/complaints', name: 'Submit Complaint', icon: <AlertTriangle className="w-5 h-5" /> },
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
    <div className="min-h-screen bg-gray-100">
      {/* Top navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/tenant/dashboard" className="flex items-center">
                  <Building2 className="h-8 w-8 text-blue-900" />
                  <span className="ml-2 text-xl font-bold text-blue-900">{APP_NAME}</span>
                </Link>
              </div>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  className="relative p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={toggleNotifications}
                >
                  <Bell className="h-6 w-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-2 hover:bg-gray-50 border-b border-gray-100 ${notification.read ? '' : 'bg-blue-50'}`}
                            >
                              <p className="text-sm text-gray-700">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          ))
                        ) : (
                          <p className="px-4 py-2 text-sm text-gray-500">No new notifications</p>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <a href="#" className="text-xs text-blue-900 hover:text-blue-700">Mark all as read</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="flex items-center space-x-2">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  <span className="text-xs text-gray-500 capitalize">Tenant</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-medium">
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
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
          <div className="sm:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-blue-50 border-blue-900 text-blue-900'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
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
                className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                <div className="flex items-center text-red-600">
                  <LogOut className="w-5 h-5" />
                  <span className="ml-2">Logout</span>
                </div>
              </button>
            </div>
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <div className="flex">
        {/* Sidebar for tablet and desktop */}
        <div className="hidden sm:flex sm:flex-col w-64 bg-white shadow-md h-[calc(100vh-4rem)] sticky top-16">
          <div className="flex-grow flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link to="/" className="text-sm text-blue-900 hover:text-blue-700">
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

export default TenantLayout;