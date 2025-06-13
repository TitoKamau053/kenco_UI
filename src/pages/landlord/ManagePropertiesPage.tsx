import React, { useState, useEffect } from 'react';
import { Plus, Search, Home, MapPin, Bed, Bath, DollarSign, Edit, Trash2 } from 'lucide-react';
import { PROPERTY_STATUS } from '../../config/constants';
import { propertyApi } from '../../services/api';
import PropertyModal from '../../components/landlord/PropertyModal';
import { Modal, message, Popconfirm } from 'antd';

const ManagePropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.getAllProperties();
      setProperties(response.data);
    } catch (error) {
      message.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (values: any, isEdit = false) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'images') {
          values[key].forEach((file: File) => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, values[key]);
        }
      });

      if (isEdit && selectedProperty) {
        await propertyApi.updateProperty(selectedProperty.id, formData);
        message.success('Property updated successfully');
      } else {
        await propertyApi.createProperty(formData);
        message.success('Property added successfully');
      }
      
      setModalVisible(false);
      setSelectedProperty(null);
      fetchProperties();
    } catch (error) {
      message.error('Failed to save property');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await propertyApi.deleteProperty(id);
      message.success('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      message.error('Failed to delete property');
    }
  };

  const handleManageProperty = (propertyId: string) => {
    // Navigate to property management page
    window.location.href = `/landlord/properties/${propertyId}/manage`;
  };

  const filteredProperties = properties.filter((property: any) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Properties</h1>
        <button
          onClick={() => {
            setSelectedProperty(null);
            setModalVisible(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 dark:bg-purple-700 dark:hover:bg-purple-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div>Loading...</div>
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((property: any) => (
            <div key={property.id} className="bg-white overflow-hidden shadow-md rounded-lg">
              <div className="relative h-48">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    property.status === PROPERTY_STATUS.AVAILABLE
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.address}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        setModalVisible(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <Popconfirm
                      title="Delete Property"
                      description="Are you sure you want to delete this property?"
                      onConfirm={() => handleDelete(property.id)}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ danger: true }}
                    >
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </Popconfirm>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms} beds
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms} baths
                  </div>
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {property.area} sqft
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-lg font-bold text-blue-900">
                    <DollarSign className="h-5 w-5" />
                    {property.price}
                    <span className="text-sm font-normal text-gray-500">/mo</span>
                  </div>
                  <button 
                    onClick={() => handleManageProperty(property.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-blue-900 text-sm font-medium rounded text-blue-900 bg-white hover:bg-blue-50"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full py-12 text-gray-500">
            No properties found
          </div>
        )}
      </div>

      <PropertyModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedProperty(null);
        }}
        onSubmit={handleAddEdit}
        property={selectedProperty}
      />
    </div>
  );
};

export default ManagePropertiesPage;
