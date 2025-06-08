import React, { useState, useEffect } from 'react';
import { Download, DollarSign, Search, Check, X, AlertCircle, Loader2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { paymentApi } from '../../services/api'; 

interface LandlordPayment {
  id: number;
  tenant_name: string;
  property_title: string;
  property_address?: string;
  amount: number;
  payment_date: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  reference_number?: string;
  notes?: string;
}

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

interface PaymentsResponse {
  payments: LandlordPayment[];
  pagination: PaginationData;
  totalRevenue: number;
}

const LandlordPaymentsPage: React.FC = () => {
  const [paymentsData, setPaymentsData] = useState<PaymentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const limit = 10; // Items per page

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build filters object, ensuring no undefined values
        const filters: any = {
          page: currentPage,
          limit
        };
        
        if (searchTerm && searchTerm.trim()) {
          filters.search = searchTerm.trim();
        }
        
        if (startDate && startDate.trim()) {
          filters.startDate = startDate.trim();
        }
        
        if (endDate && endDate.trim()) {
          filters.endDate = endDate.trim();
        }

        console.log('Fetching landlord payments with filters:', filters);
        
        const response = await paymentApi.getLandlordPayments(filters);
        console.log('Landlord payments response:', response.data);
        
        // Ensure response has expected structure
        if (response.data && typeof response.data === 'object') {
          setPaymentsData(response.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching landlord payments:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load payments');
        setPaymentsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [currentPage, searchTerm, startDate, endDate]);

  // Filter payments by status in frontend (since backend doesn't have status filter)
  const filteredPayments = paymentsData?.payments.filter(payment => {
    if (statusFilter === 'all') return true;
    return payment.payment_status === statusFilter;
  }) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDateFilter = () => {
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <Check className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <X className="h-3 w-3 mr-1" />
            Failed
          </span>
        );
      case 'refunded':
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            <AlertCircle className="h-3 w-3 mr-1" />
            Refunded
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status}
          </span>
        );
    }
  };

  const formatAmount = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const exportToCSV = () => {
    if (!paymentsData?.payments.length) return;
    
    const csvData = filteredPayments.map(payment => ({
      'Date': payment.payment_date,
      'Tenant': payment.tenant_name,
      'Property': payment.property_title,
      'Amount': payment.amount,
      'Status': payment.payment_status,
      'Method': payment.payment_method,
      'Reference': payment.reference_number || 'N/A'
    }));

    const csvString = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landlord-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading payments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Payments</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-800 underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pagination = paymentsData?.pagination;
  const totalRevenue = paymentsData?.totalRevenue || 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Total Revenue: {formatAmount(totalRevenue)} • {pagination?.total || 0} total payments
          </p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={!filteredPayments.length}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5 mr-2" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSearch}>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by tenant, property, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Start Date */}
          <div>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start date"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <input
              type="date"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End date"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <button
              onClick={handleDateFilter}
              className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 text-sm"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
            >
              Clear All
            </button>
          </div>
          <span className="text-sm text-gray-500">
            Showing {filteredPayments.length} of {pagination?.total || 0} payments
          </span>
        </div>
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || startDate || endDate || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.' 
              : 'Payments from your tenants will appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.tenant_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-48" title={payment.property_title}>
                        {payment.property_title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        {formatAmount(payment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.payment_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {payment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {payment.reference_number || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{((currentPage - 1) * limit) + 1}</span>
                    {' '} to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * limit, pagination.total)}
                    </span>
                    {' '} of{' '}
                    <span className="font-medium">{pagination.total}</span>
                    {' '} results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNumber = currentPage <= 3 
                        ? i + 1 
                        : currentPage >= pagination.pages - 2 
                        ? pagination.pages - 4 + i 
                        : currentPage - 2 + i;
                      
                      if (pageNumber < 1 || pageNumber > pagination.pages) return null;
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                      disabled={currentPage === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LandlordPaymentsPage;