import React, { useEffect, useState } from 'react';
import { Home, DollarSign, Calendar, AlertTriangle, Bed, Bath } from 'lucide-react';
import { tenantApi, paymentApi, complaintApi } from '../../services/api';

interface DashboardData {
  currentProperty: any;
  tenant: any;
  recentPayments: any[];
  activeComplaints: any[];
  stats?: any;
}

interface TenantResponse {
  data: {
    property: {
      id: number;
      title: string;
      address: string;
      bedrooms: number;
      bathrooms: number;
      area: number;
      image: string;
    };
    tenant: {
      name: string;
      email: string;
    };
    stats?: any;
  };
}

const TenantDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    currentProperty: null,
    tenant: null,
    recentPayments: [],
    activeComplaints: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching dashboard data...');
        
        // Fetch tenant details which includes current property
        let tenantData = null;
        let propertyData = null;
        let stats = null;
        
        try {
          console.log('Fetching tenant details...');
          const tenantResponse = await tenantApi.getTenantDetails('current');
          console.log('Tenant response:', tenantResponse);
          
          if (tenantResponse.data && tenantResponse.data.data) {
            const { tenant, property, stats: tenantStats } = tenantResponse.data.data;
            tenantData = tenant;
            propertyData = property;
            stats = tenantStats;
          }
        } catch (err) {
          console.error('Failed to fetch tenant details:', err);
          // Continue with other data fetching
        }
        
        // Fetch recent payments with better error handling
        let payments = [];
        try {
          console.log('Fetching payments...');
          const paymentsResponse = await paymentApi.getPaymentHistory({ 
            limit: 2, 
            sort: 'date:desc' 
          });
          console.log('Payments response:', paymentsResponse);
          payments = Array.isArray(paymentsResponse.data) ? paymentsResponse.data : [];
        } catch (err) {
          console.error('Failed to fetch payments:', err);
          // Set empty array as fallback
          payments = [];
        }
        
        // Fetch active complaints with better error handling
        let complaints = [];
        try {
          console.log('Fetching complaints...');
          const complaintsResponse = await complaintApi.getComplaints({ 
            status: ['open', 'in_progress'],
            limit: 5
          });
          console.log('Complaints response:', complaintsResponse);
          complaints = Array.isArray(complaintsResponse.data) ? complaintsResponse.data : [];
        } catch (err) {
          console.error('Failed to fetch complaints:', err);
          // Set empty array as fallback
          complaints = [];
        }

        setDashboardData({
          currentProperty: propertyData,
          tenant: tenantData,
          recentPayments: payments,
          activeComplaints: complaints,
          stats: stats
        });
        
        console.log('Dashboard data set successfully');
        
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           'Failed to load dashboard data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-300" />
          </div>
          
        </div>
      </div>
    );
  }

  const { currentProperty, tenant, recentPayments, activeComplaints, stats } = dashboardData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {tenant && (
          <div className="text-sm text-gray-600">
            Welcome back, {tenant.name}
          </div>
        )}
      </div>

      {/* Current Property Card */}
      {currentProperty ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{currentProperty.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{currentProperty.address}</p>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Bed className="h-4 w-4 mr-1" />
                  {currentProperty.bedrooms} Beds
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Bath className="h-4 w-4 mr-1" />
                  {currentProperty.bathrooms} Baths
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Home className="h-4 w-4 mr-1" />
                  {currentProperty.area} m²
                </div>
              </div>
            </div>
            <Home className="h-6 w-6 text-blue-900" />
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No property information available. Please contact your landlord.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Payments */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Payments</h3>
        {recentPayments && recentPayments.length > 0 ? (
          <div className="space-y-4">
            {recentPayments.map((payment, index) => (
              <div key={payment.id || index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      KES {typeof payment.amount === 'number' ? 
                           payment.amount.toLocaleString() : 
                           payment.amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.payment_date ? 
                       new Date(payment.payment_date).toLocaleDateString() :
                       'Date not available'}
                    </p>
                  </div>
                </div>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {payment.payment_status || payment.status || 'completed'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent payments</p>
        )}
      </div>

      {/* Active Complaints */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Complaints</h3>
        {activeComplaints && activeComplaints.length > 0 ? (
          <div className="space-y-4">
            {activeComplaints.map((complaint, index) => (
              <div key={complaint.id || index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{complaint.subject}</p>
                    <p className="text-xs text-gray-500">
                      {complaint.created_at ? 
                       new Date(complaint.created_at).toLocaleDateString() :
                       'Date not available'}
                    </p>
                  </div>
                </div>
                <span 
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    complaint.status === 'open'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {complaint.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No active complaints</p>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;