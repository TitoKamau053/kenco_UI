// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// App constants
export const APP_NAME = 'KENCO';
export const APP_DESCRIPTION = 'Rental Management System';

// Payment constants
export const PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Credit Card' },
  { id: 'bank_transfer', name: 'Bank Transfer' },
  { id: 'mpesa', name: 'M-Pesa' },
  { id: 'cash', name: 'Cash' }
];

// Status constants
export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance'
};

export const COMPLAINT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};