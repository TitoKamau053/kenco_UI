import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, CreditCard, AlertTriangle, TrendingUp, DollarSign, Building2, CheckCircle } from 'lucide-react';
import { dashboardApi } from '../../services/api';

interface DashboardStats {
  totalProperties: number;
  occupiedProperties: number;
  totalTenants: number;
  pendingComplaints: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  occupancyRate: number;
}

interface Payment {
  id: number;
  tenant: string;
  amount: number;
  date: string;
  status: string;
}

interface Complaint {
  id: number;
  tenant: string;
  subject: string;
  date: string;
  status: string;
}

const LandlordDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard data in parallel
        const [statsResponse, paymentsResponse, complaintsResponse] = await Promise.all([
          dashboardApi.getDashboardStats(),
          dashboardApi.getRecentPayments(),
          dashboardApi.getRecentComplaints()
        ]);

        setStats(statsResponse.data);
        setRecentPayments(paymentsResponse.data);
        setRecentComplaints(complaintsResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your properties.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Properties */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats?.totalProperties || 0}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <span className="sr-only"> properties</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/landlord/properties" className="font-medium text-blue-900 hover:text-blue-800">
                View all properties
              </Link>
            </div>
          </div>
        </div>

        {/* Total Tenants */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tenants</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats?.totalTenants || 0}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/landlord/tenants" className="font-medium text-blue-900 hover:text-blue-800">
                Manage tenants
              </Link>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">KES {stats?.monthlyRevenue.toLocaleString() || 0}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="sr-only"> Increased by </span>
                      8.1%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/landlord/payments" className="font-medium text-blue-900 hover:text-blue-800">
                View payments
              </Link>
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Occupancy Rate</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats?.occupancyRate}%</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <span className="sr-only"> occupancy rate</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/landlord/properties" className="font-medium text-blue-900 hover:text-blue-800">
                View details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Payments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Payments</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {recentPayments.map((payment) => (
                  <li key={payment.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CreditCard className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{payment.tenant}</p>
                          <p className="text-sm text-gray-500">{payment.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-semibold text-gray-900">KES {payment.amount.toLocaleString()}</p>
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/landlord/payments" className="font-medium text-blue-900 hover:text-blue-800">
                  View all payments <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Complaints</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {recentComplaints.map((complaint) => (
                  <li key={complaint.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{complaint.subject}</p>
                          <p className="text-sm text-gray-500">{complaint.tenant} - {complaint.date}</p>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          complaint.status === 'open' 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/landlord/complaints" className="font-medium text-blue-900 hover:text-blue-800">
                  View all complaints <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;