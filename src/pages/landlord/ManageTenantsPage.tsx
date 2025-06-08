import React, { useState, useEffect } from 'react';
import { Button, Table, Space, message } from 'antd';
import TenantModal from '../../components/landlord/TenantModal';
import { tenantApi } from '../../services/api';

const ManageTenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await tenantApi.getAllTenants();
      // Access the data array from the success response
      setTenants(response.data || []);
    } catch (error) {
      message.error('Failed to fetch tenants');
      console.error('Error fetching tenants:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleAddTenant = async (values: any) => {
    try {
      await tenantApi.addTenant(values);
      message.success('Tenant added successfully');
      fetchTenants();
      return true;
    } catch (error) {
      message.error('Failed to add tenant');
      console.error('Error adding tenant:', error);
      return false;
    }
  };

  const handleDeleteTenant = async (id: string) => {
    try {
      await tenantApi.deleteTenant(id);
      message.success('Tenant deleted successfully');
      fetchTenants();
    } catch (error) {
      message.error('Failed to delete tenant');
      console.error('Error deleting tenant:', error);
    }
  };

  // Update columns mapping to match the API response structure
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    // {
    //   title: 'Phone',
    //   dataIndex: 'phone',
    //   key: 'phone',
    // },
    {
      title: 'Property',
      dataIndex: ['property', 'title'],
      key: 'property',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="link"
            onClick={() => message.info('Edit functionality coming soon')}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger
            onClick={() => handleDeleteTenant(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Tenants</h1>
        <Button 
          type="primary"
          onClick={() => setModalVisible(true)}
          className="bg-blue-900 hover:bg-blue-800"
        >
          + Add Tenant
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={tenants} 
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tenants`
        }}
        className="bg-white rounded-lg shadow"
      />
      
      <TenantModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTenant={handleAddTenant}
      />
    </div>
  );
};

export default ManageTenantsPage;
