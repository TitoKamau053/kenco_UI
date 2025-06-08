import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';


interface PropertyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any, isEdit: boolean) => Promise<void>;
  property?: any;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  visible,
  onClose,
  onSubmit,
  property
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (visible && property) {
      form.setFieldsValue({
        ...property,
        images: undefined // Handle images separately
      });
      // Convert existing images to file list format
      if (property.images) {
        setFileList(property.images.map((url: string, index: number) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url,
        })));
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [visible, property, form]);

  const handleSubmit = async (values: any) => {
    try {
      // Add files to form data
      values.images = fileList.map(file => file.originFileObj).filter(Boolean);
      await onSubmit(values, !!property);
      form.resetFields();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  return (
    <Modal
      title={property ? "Edit Property" : "Add New Property"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Property Title"
          rules={[{ required: true, message: 'Please enter property title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter property description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter property address' }]}
        >
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="price"
            label="Monthly Rent (KES)"
            rules={[{ required: true, message: 'Please enter rent amount' }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              formatter={value => `KES ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\D/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="property_type"
            label="Property Type"
            rules={[{ required: true, message: 'Please select property type' }]}
          >
            <Select>
              <Select.Option value="apartment">Apartment</Select.Option>
              <Select.Option value="house">House</Select.Option>
              <Select.Option value="commercial">Commercial</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            name="bedrooms"
            label="Bedrooms"
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item
            name="bathrooms"
            label="Bathrooms"
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber className="w-full" min={0} step={0.5} />
          </Form.Item>

          <Form.Item
            name="area"
            label="Area (sq ft)"
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>
        </div>

        <Form.Item
          label="Property Images"
          required
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            multiple
          >
            {fileList.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end">
          <Button onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="bg-blue-900">
            {property ? 'Update' : 'Add'} Property
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PropertyModal;

