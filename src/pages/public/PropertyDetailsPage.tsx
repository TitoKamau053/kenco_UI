import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bed, Bath, Home, Tag, MapPin, Phone, Mail } from 'lucide-react';
import { PROPERTY_STATUS } from '../../config/constants';
import { propertyApi } from '../../services/api';

interface Landlord {
  name: string;
  phone: string;
  email: string;
}

interface Property {
  id: string;
  title: string;
  address: string;
  status: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  amenities: string[];
  price: number;
  landlord: Landlord;
}

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await propertyApi.getPropertyById(id!);
        setProperty(response.data);
      } catch (err) {
        setError('Failed to load property details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Property not found</h2>
          <p className="mt-2 text-gray-600">{error || "The property you're looking for doesn't exist or has been removed."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Property Title and Status */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <p className="mt-2 flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {property.address}
            </p>
          </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
            {property.images.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
              type="button"
            >
              <img
              src={image}
              alt={`Property thumbnail ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              />
            </button>
            ))}
        </div>        
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Key Features */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Bed className="h-6 w-6 mx-auto text-blue-900" />
                <p className="mt-2 text-sm text-gray-600">Bedrooms</p>
                <p className="text-lg font-semibold text-gray-900">{property.bedrooms}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Bath className="h-6 w-6 mx-auto text-blue-900" />
                <p className="mt-2 text-sm text-gray-600">Bathrooms</p>
                <p className="text-lg font-semibold text-gray-900">{property.bathrooms}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Home className="h-6 w-6 mx-auto text-blue-900" />
                <p className="mt-2 text-sm text-gray-600">Area</p>
                <p className="text-lg font-semibold text-gray-900">{property.area} m²</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity: string, index: number) => (
                <div key={index} className="flex items-center">
                  <Tag className="h-5 w-5 text-blue-900 mr-2" />
                  <span className="text-gray-600">{amenity}</span>
                </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Price Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-900">KES {property.price}</p>
              <p className="text-gray-600">per month</p>
            </div>
            <button className="mt-4 w-full bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors">
              Request Viewing
            </button>
          </div>

          {/* Landlord Contact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Landlord</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-900 font-semibold">
                    {property.landlord.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{property.landlord.name}</p>
                  <p className="text-sm text-gray-500">Property Manager</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                <span>{property.landlord.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2" />
                <span>{property.landlord.email}</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full bg-white border border-blue-900 text-blue-900 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;