import axios from 'axios';

// Update API_URL to use the deployed backend URL if available
const API_URL = import.meta.env.VITE_API_URL || 'https://kencobackend.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Request with token:', config.url);
  } else {
    console.log('Request without token:', config.url);
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use((response) => {
  console.log(`API Response [${response.config.url}]:`, response.data);
  return response;
}, (error) => {
  console.error('API Error:', {
    url: error.config?.url,
    status: error.response?.status,
    data: error.response?.data,
    error: error.message
  });
  
  // Handle 401 unauthorized - redirect to login
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  return Promise.reject(error);
});

export const authApi = {
  login: async (email: string, password: string) => {
    console.log('Attempting login for:', email);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/api/auth/change-password', { 
      currentPassword, 
      newPassword 
    });
    return response;
  }
};

export const propertyApi = {
  getAllProperties: async (filters?: any) => {
    const response = await api.get('/api/properties', { params: filters });
    // Transform image URLs to include full API URL
    response.data = response.data.map((property: any) => ({
      ...property,
      image: property.image?.startsWith('http') 
        ? property.image 
        : `${API_URL}${property.image}`
    }));
    return response;
  },
  
  // Get landlord's properties with enhanced data
  getLandlordProperties: async (filters?: any) => {
    const response = await api.get('/api/landlord/properties', { params: filters });
    // Transform image URLs to include full API URL
    response.data = response.data.map((property: any) => ({
      ...property,
      image: property.image?.startsWith('http') 
        ? property.image 
        : `${API_URL}${property.image}`
    }));
    return response;
  },
  
  getPropertyById: async (id: string) => {
    const response = await api.get(`/api/properties/${id}`);
    // Transform image URLs
    if (response.data.images) {
      response.data.images = response.data.images.map((image: string) => 
        image.startsWith('http') ? image : `${API_URL}${image}`
      );
    }
    return response;
  },
  
  createProperty: async (formData: FormData) => {
    const response = await api.post('/api/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  },

  updateProperty: async (id: string, formData: FormData) => {
    const response = await api.put(`/api/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/api/properties/${id}`);
    return response;
  }
};

export const paymentApi = {
  // M-Pesa payment methods
  initiateMpesaPayment: async (paymentData: {
    amount: number;
    phone: string;
    description?: string;
  }) => {
    try {
      console.log('Initiating M-Pesa payment:', paymentData);
      const response = await api.post('/api/payments/mpesa/initiate', paymentData);
      return response;
    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      throw error;
    }
  },

  checkMpesaPaymentStatus: async (paymentId: string) => {
    try {
      const response = await api.get(`/api/payments/mpesa/status/${paymentId}`);
      return response;
    } catch (error) {
      console.error('Error checking M-Pesa payment status:', error);
      throw error;
    }
  },

  // Regular payment methods
  makePayment: async (paymentData: any) => {
    const response = await api.post('/api/payments', paymentData);
    return response;
  },
  
  // Get payment history (for tenants)
  getPaymentHistory: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      if (filters?.limit) params.append('limit', filters.limit);
      if (filters?.sort) params.append('sort', filters.sort);
      if (filters?.status) params.append('status', filters.status);
      
      const response = await api.get(`/api/payments?${params.toString()}`);
      
      // Transform response to ensure consistent data structure
      return {
        data: response.data.map((payment: any) => ({
          id: payment.id,
          payment_date: payment.payment_date,
          amount: Number(payment.amount),
          payment_status: payment.payment_status,
          payment_method: payment.payment_method || 'M-Pesa',
          reference_number: payment.reference_number || '-'
        }))
      };
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      throw error;
    }
  },

  // Get specific payment details
  getPaymentById: async (id: string) => {
    try {
      const response = await api.get(`/api/payments/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  },

  // Update payment status (for landlords)
  updatePaymentStatus: async (id: string, status: string, notes?: string) => {
    try {
      const response = await api.put(`/api/payments/${id}`, { 
        payment_status: status, 
        notes 
      });
      return response;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Landlord specific methods
  getLandlordPayments: async (filters?: {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      // Clean up filters to ensure no undefined values
      const cleanFilters: any = {};
      
      if (filters?.page && filters.page > 0) {
        cleanFilters.page = filters.page;
      }
      
      if (filters?.limit && filters.limit > 0) {
        cleanFilters.limit = filters.limit;
      }
      
      if (filters?.search && filters.search.trim()) {
        cleanFilters.search = filters.search.trim();
      }
      
      if (filters?.startDate && filters.startDate.trim()) {
        cleanFilters.startDate = filters.startDate.trim();
      }
      
      if (filters?.endDate && filters.endDate.trim()) {
        cleanFilters.endDate = filters.endDate.trim();
      }
      
      console.log('API: Sending landlord payments request with filters:', cleanFilters);
      
      const response = await api.get('/api/landlord/payments', { params: cleanFilters });
      return response;
    } catch (error) {
      console.error('Error fetching landlord payments:', error);
      throw error;
    }
  }
};

export const complaintApi = {
  submitComplaint: async (complaintData: {
    subject: string;
    description: string;
    category?: string;
  }) => {
    const response = await api.post('/api/complaints', complaintData);
    return response;
  },
  
  getComplaints: async (filters?: {
    status?: string[];
    limit?: number;
  }) => {
    try {
      const response = await api.get('/api/complaints', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      return { data: [] }; // Return empty array on error
    }
  },

  // Get complaints for landlord's properties
  getLandlordComplaints: async (filters?: {
    status?: string[];
    category?: string;
    limit?: number;
  }) => {
    try {
      const response = await api.get('/api/landlord/complaints', { params: filters });
      return response;
    } catch (error) {
      console.error('Error fetching landlord complaints:', error);
      return { data: [] }; // Return empty array on error
    }
  },

  updateComplaint: async (id: number, status: string) => {
    const response = await api.put(`/api/complaints/${id}`, { status });
    return response;
  }
};

export const tenantApi = {
  getTenantDetails: async (id: string = 'current') => {
    const response = await api.get(`/api/tenants/${id}`);
    return response;
  },
  
  getAllTenants: async () => {
    const response = await api.get('/api/landlord/tenants');
    return response;
  },
  
  // Get detailed tenant information (landlord only)
  getLandlordTenantDetails: async (id: string) => {
    const response = await api.get(`/api/landlord/tenants/${id}`);
    return response;
  },
  
  addTenant: async (tenantData: {
    name: string;
    email: string;
    phone?: string;
    property_id: number;
    rent_amount: number;
    lease_start: string;
    lease_end: string;
  }) => {
    const response = await api.post('/api/tenants', tenantData);
    return response;
  },
  
  deleteTenant: async (id: string) => {
    const response = await api.delete(`/api/tenants/${id}`);
    return response;
  },

  // Remove tenant (landlord only)
  removeTenant: async (id: string) => {
    const response = await api.delete(`/api/landlord/tenants/${id}`);
    return response;
  }
};

export const dashboardApi = {
  getDashboardStats: async () => {
    const response = await api.get('/api/dashboard/stats');
    return response;
  },
  
  getRecentPayments: async (limit = 5) => {
    const response = await api.get('/api/dashboard/recent-payments', {
      params: { limit }
    });
    return response;
  },
  
  getRecentComplaints: async (limit = 5) => {
    const response = await api.get('/api/dashboard/recent-complaints', {
      params: { limit }
    });
    return response;
  }
};

// Export the main api instance for custom requests
export default api;