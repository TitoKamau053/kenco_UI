import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X, Plus } from 'lucide-react';

interface PropertyFormData {
  title: string;
  description: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: 'apartment' | 'house' | 'commercial';
  images: File[];
  amenities: string[];
}

const PropertyForm: React.FC<{ onSubmit: (data: FormData) => Promise<void> }> = ({ onSubmit }) => {
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<PropertyFormData>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: PropertyFormData) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images') {
          formData.append(key, value.toString());
        }
      });
      
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      await onSubmit(formData);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* ...existing input fields for other properties... */}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Property Images</label>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  title="Remove image"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full -mt-2 -mr-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label htmlFor="property-images" className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
              <input
                id="property-images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
                title="Upload property images"
                aria-label="Upload property images"
              />
              <Plus className="h-8 w-8 text-gray-400" />
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
      >
        {uploading ? 'Uploading...' : 'Add Property'}
      </button>
    </form>
  );
};

export default PropertyForm;
