import React, { useState } from 'react';
import { Tabs, DatePicker, Button, Table, Card, Spin, message, Alert, Typography } from 'antd';
import { 
  Download, 
  DollarSign, 
  Home, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  Filter,
  RefreshCcw
} from 'lucide-react';
import { paymentApi, propertyApi, complaintApi } from '../../services/api';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setReportData([]);
    setError(null);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const startDate = dateRange[0] ? dateRange[0].toISOString().split('T')[0] : '';
      const endDate = dateRange[1] ? dateRange[1].toISOString().split('T')[0] : '';
      
      let response;
      
      switch (activeTab) {
        case 'payments':
          response = await paymentApi.getPaymentsReport({ startDate, endDate });
          message.success('Payment report generated successfully');
          break;
        case 'properties':
          response = await propertyApi.getPropertiesReport({ startDate, endDate });
          message.success('Property report generated successfully');
          break;
        case 'complaints':
          response = await complaintApi.getComplaintsReport({ startDate, endDate });
          message.success('Complaints report generated successfully');
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      if (response.data && Array.isArray(response.data)) {
        setReportData(response.data);
        if (response.data.length === 0) {
          message.info('No data available for the selected criteria');
        }
      } else {
        setReportData([]);
        message.info('No data returned from server');
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      setError(error.response?.data?.message || 'Failed to generate report. Please try again.');
      message.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const refreshReportData = async () => {
    setRefreshing(true);
    await generateReport();
    setRefreshing(false);
  };

  const downloadReport = () => {
    if (!reportData.length) {
      message.warning('No data to download');
      return;
    }
    
    let csvContent = '';
    // Get headers from first object keys
    const headers = Object.keys(reportData[0]);
    csvContent += headers.join(',') + '\n';
    
    // Add each row
    reportData.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        // Handle special cases like dates, numbers, strings with commas
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        if (value instanceof Date) return value.toISOString();
        return value;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    const reportTypeMap = {
      'payments': 'Payment_Report',
      'properties': 'Property_Report',
      'complaints': 'Complaint_Report'
    };
    const reportType = reportTypeMap[activeTab as keyof typeof reportTypeMap] || activeTab;
    const today = new Date().toISOString().split('T')[0];
    
    link.setAttribute('download', `${reportType}_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(`${reportType} downloaded successfully`);
  };

  const renderPaymentsColumns = () => [
    {
      title: 'Date',
      dataIndex: 'payment_date',
      key: 'date',
      render: (text: string) => new Date(text).toLocaleDateString()
    },
    {
      title: 'Tenant',
      dataIndex: 'tenant_name',
      key: 'tenant'
    },
    {
      title: 'Property',
      dataIndex: 'property_title',
      key: 'property'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `KES ${amount.toLocaleString()}`
    },
    {
      title: 'Status',
      dataIndex: 'payment_status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'completed' ? 'bg-green-100 text-green-800' :
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      title: 'Method',
      dataIndex: 'payment_method',
      key: 'method'
    }
  ];

  const renderPropertiesColumns = () => [
    {
      title: 'Property Name',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'available' ? 'bg-green-100 text-green-800' :
          status === 'occupied' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      title: 'Rent',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `KES ${price.toLocaleString()}`
    },
    {
      title: 'Bedrooms',
      dataIndex: 'bedrooms',
      key: 'bedrooms'
    },
    {
      title: 'Bathrooms',
      dataIndex: 'bathrooms',
      key: 'bathrooms'
    },
    {
      title: 'Tenant Count',
      dataIndex: 'tenant_count',
      key: 'tenant_count',
      render: (count: number) => count || 0
    }
  ];

  const renderComplaintsColumns = () => [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      render: (text: string) => new Date(text).toLocaleDateString()
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: 'Property',
      dataIndex: 'property_title',
      key: 'property'
    },
    {
      title: 'Tenant',
      dataIndex: 'tenant_name',
      key: 'tenant'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'open' ? 'bg-red-100 text-red-800' :
          status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          status === 'resolved' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <span className="capitalize">{category}</span>
      )
    }
  ];

  const getColumns = () => {
    switch (activeTab) {
      case 'payments':
        return renderPaymentsColumns();
      case 'properties':
        return renderPropertiesColumns();
      case 'complaints':
        return renderComplaintsColumns();
      default:
        return [];
    }
  };

  const getReportTitle = () => {
    switch (activeTab) {
      case 'payments':
        return 'Payment Reports';
      case 'properties':
        return 'Property Reports';
      case 'complaints':
        return 'Complaint Reports';
      default:
        return 'Reports';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getReportTitle()}</h1>
          <p className="text-sm text-gray-500">
            Generate and download reports for your properties and tenants
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<RefreshCcw className="h-4 w-4 mr-2" />}
            onClick={refreshReportData}
            disabled={loading || refreshing || !reportData.length}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Refresh Data
          </Button>
          <Button
            type="primary"
            icon={<Download className="h-4 w-4 mr-2" />}
            onClick={downloadReport}
            disabled={!reportData.length || loading}
            className="bg-blue-900 hover:bg-blue-800"
          >
            Download Report
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane
            tab={
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Payment Reports
              </span>
            }
            key="payments"
          />
          <TabPane
            tab={
              <span className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Property Reports
              </span>
            }
            key="properties"
          />
          <TabPane
            tab={
              <span className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Complaint Reports
              </span>
            }
            key="complaints"
          />
        </Tabs>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Date Range:</span>
            </div>
            
            <RangePicker onChange={handleDateRangeChange} className="flex-grow" />
            
            <Button
              type="default"
              icon={<Filter className="h-4 w-4 mr-2" />}
              onClick={generateReport}
              loading={loading}
              className="ml-2"
            >
              Generate Report
            </Button>
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mt-4"
              closable
              onClose={() => setError(null)}
            />
          )}

          <div className="mt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Spin size="large" />
                <p className="mt-2 text-sm text-gray-500">Generating report...</p>
              </div>
            ) : reportData.length > 0 ? (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <Title level={5}>{getReportTitle()} - {reportData.length} records</Title>
                </div>
                <Table 
                  dataSource={reportData} 
                  columns={getColumns()} 
                  rowKey={(record) => record.id || Math.random().toString()} 
                  pagination={{ pageSize: 10 }}
                  className="mt-4"
                  scroll={{ x: 'max-content' }}
                />
              </>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-600">
                  No report data available. Please select a date range and generate a report.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
