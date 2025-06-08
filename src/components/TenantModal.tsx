import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Select, DatePicker } from 'antd';
import { propertyApi } from '../services/api';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

interface TenantModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTenant: (tenantData: any) => Promise<boolean>;
}

const TenantModal: React.FC<TenantModalProps> = ({ visible, onClose, onAddTenant }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchProperties();
    }
  }, [visible]);

  const fetchProperties = async () => {
    try {
      const response = await propertyApi.getAllProperties({ status: 'available' });
      setProperties(response.data);
    } catch (error) {
      message.error('Failed to fetch properties');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const success = await onAddTenant({
        ...values,
        lease_start: values.lease_period[0].format('YYYY-MM-DD'),
        lease_end: values.lease_period[1].format('YYYY-MM-DD'),
      });
      
      if (success) {
        form.resetFields();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Tenant"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Tenant Name"
          rules={[{ required: true, message: 'Please enter tenant name' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="property_id"
          label="Property"
          rules={[{ required: true, message: 'Please select a property' }]}
        >
          <Select>
            {properties.map((property: any) => (
              <Select.Option key={property.id} value={property.id}>
                {property.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="rent_amount"
          label="Monthly Rent"
          rules={[{ required: true, message: 'Please enter rent amount' }]}
        >
          <Input type="number" prefix="KES" />
        </Form.Item>

        <Form.Item
          name="lease_period"
          label="Lease Period"
          rules={[{ required: true, message: 'Please select lease period' }]}
        >
          <DatePicker.RangePicker className="w-full" />
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end">
          <Button onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Tenant
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TenantModal;
