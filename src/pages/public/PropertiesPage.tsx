import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Home, Tag, Search } from 'lucide-react';
import { PROPERTY_STATUS } from '../../config/constants';
import { propertyApi } from '../../services/api';

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: string;
  image: string;
  featuredAmenities: string[];
}

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    onlyAvailable: true
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertyApi.getAllProperties({
          ...filters,
          search: searchTerm
        });
        setProperties(response.data);
      } catch (err) {
        setError('Failed to load properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProperties, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const defaultImage = 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
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
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price</label>
            <input
              type="number"
              name="minPrice"
              id="minPrice"
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              id="maxPrice"
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <select
              name="bedrooms"
              id="bedrooms"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.bedrooms}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <select
              name="bathrooms"
              id="bathrooms"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.bathrooms}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>
          <div className="flex items-center mt-6">
            <input
              id="onlyAvailable"
              name="onlyAvailable"
              type="checkbox"
              className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-gray-300 rounded"
              checked={filters.onlyAvailable}
              onChange={handleFilterChange}
            />
            <label htmlFor="onlyAvailable" className="ml-2 block text-sm text-gray-900">
              Available only
            </label>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link 
              key={property.id}
              to={`/properties/${property.id}`}
              className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={property.image || defaultImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImage;
                  }}
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
                <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{property.address}</p>
                
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
                    {property.area} m²
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-lg font-bold text-blue-900">KES {property.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;