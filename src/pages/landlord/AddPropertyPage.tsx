import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropertyForm from '../../components/forms/PropertyForm';
import { propertyApi } from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AddPropertyPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      await propertyApi.createProperty(formData);
      toast.success('Property added successfully');
      navigate('/landlord/properties');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add property');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Property</h1>
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddPropertyPage;
