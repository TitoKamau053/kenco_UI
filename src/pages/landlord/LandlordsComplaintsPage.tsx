import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, MessageCircle, Clock, CheckCircle, XCircle, Eye, Filter } from 'lucide-react';
import { complaintApi } from '../../services/api'; 

interface LandlordComplaint {
  id: number;
  tenant_id: number;
  property_id: number;
  subject: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  property_title?: string;
  tenant_name?: string;
  tenant?: string;
  property?: string;
}

const LandlordComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<LandlordComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<LandlordComplaint | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch landlord complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching landlord complaints...');
        
        // Use dashboard API which gets complaints for landlord's properties
        const response = await complaintApi.getLandlordComplaints();
        console.log('Landlord complaints response:', response.data);
        
        if (Array.isArray(response.data)) {
          setComplaints(response.data);
        } else {
          console.warn('Expected array but got:', typeof response.data);
          setComplaints([]);
        }
      } catch (err: any) {
        console.error('Error fetching landlord complaints:', err);
        setError(err.response?.data?.message || 'Failed to load complaints');
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = !searchTerm || 
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.property_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.tenant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.property?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Update complaint status
  const handleUpdateStatus = async (complaintId: number, newStatus: string) => {
    try {
      setUpdating(true);
      console.log('Updating complaint status:', { complaintId, newStatus });
      
      await complaintApi.updateComplaint(complaintId, newStatus);
      
      // Update local state
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, status: newStatus as any, updated_at: new Date().toISOString() }
            : complaint
        )
      );
      
      setSelectedComplaint(null);
      alert('Complaint status updated successfully!');
    } catch (err: any) {
      console.error('Error updating complaint status:', err);
      alert(err.response?.data?.message || 'Failed to update complaint status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'closed':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'open':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Open</span>;
      case 'in_progress':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>In Progress</span>;
      case 'resolved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Resolved</span>;
      case 'closed':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Closed</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const getPriorityFromCategory = (category: string) => {
    const highPriority = ['emergency', 'electrical', 'plumbing', 'security'];
    const mediumPriority = ['hvac', 'appliance', 'maintenance'];
    
    if (highPriority.includes(category.toLowerCase())) return 'high';
    if (mediumPriority.includes(category.toLowerCase())) return 'medium';
    return 'low';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getUniqueCategories = () => {
    const categories = complaints.map(c => c.category);
    return Array.from(new Set(categories)).sort();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading complaints...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Complaints</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-800 dark:text-red-300 underline hover:text-red-900 dark:hover:text-red-200"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Complaints</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and respond to tenant complaints • {filteredComplaints.length} complaints
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {complaints.filter(c => c.status === 'open').length} Open •{' '}
            {complaints.filter(c => c.status === 'in_progress').length} In Progress
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search complaints, tenants, or properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        >
          <option value="all">All Categories</option>
          {getUniqueCategories().map(category => (
            <option key={category} value={category} className="capitalize">
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search or filters.' 
              : 'No complaints have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => {
              const priority = getPriorityFromCategory(complaint.category);
              return (
                <div key={complaint.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(complaint.status)}
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{complaint.subject}</h3>
                        <div className="text-sm text-gray-500 space-x-2">
                          <span>Tenant: {complaint.tenant_name || complaint.tenant}</span>
                          <span>•</span>
                          <span>Property: {complaint.property_title || complaint.property}</span>
                          <span>•</span>
                          <span className="capitalize">Category: {complaint.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(complaint.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {priority} priority
                      </span>
                      <button 
                        onClick={() => setSelectedComplaint(complaint)}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-900 text-sm font-medium rounded text-blue-900 bg-white hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
                    <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                      <span>Submitted: {formatDate(complaint.created_at)}</span>
                      {complaint.updated_at !== complaint.created_at && (
                        <span>Updated: {formatDate(complaint.updated_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-medium text-gray-900">Complaint Details</h2>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Header Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900">{selectedComplaint.subject}</h3>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Tenant:</span> {selectedComplaint.tenant_name || selectedComplaint.tenant}</p>
                  <p><span className="font-medium">Property:</span> {selectedComplaint.property_title || selectedComplaint.property}</p>
                  <p><span className="font-medium">Category:</span> <span className="capitalize">{selectedComplaint.category}</span></p>
                  <p><span className="font-medium">Priority:</span> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                      getPriorityFromCategory(selectedComplaint.category) === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : getPriorityFromCategory(selectedComplaint.category) === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {getPriorityFromCategory(selectedComplaint.category)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedComplaint.description}</p>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                <div className="flex space-x-2">
                  {['open', 'in_progress', 'resolved', 'closed'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedComplaint.id, status)}
                      disabled={updating || selectedComplaint.status === status}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        selectedComplaint.status === status
                          ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-xs text-gray-500 border-t pt-4">
                <p>Submitted: {formatDate(selectedComplaint.created_at)}</p>
                {selectedComplaint.updated_at !== selectedComplaint.created_at && (
                  <p>Last Updated: {formatDate(selectedComplaint.updated_at)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordComplaintsPage;