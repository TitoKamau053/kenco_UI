const mockUsers = [
  {
    id: 1,
    name: "James Mwangi",
    email: "jamesmwangi@gmail.com",
    password: "password123", // Added for testing
    role: "landlord"
  },
  {
    id: 2,
    name: "Sarah Wanjiku",
    email: "sarahwanjiku@gmail.com",
    password: "password123", // Added for testing
    role: "tenant"
  }
];

const mockProperties = [
  {
    id: 1,
    title: "Modern Apartment in Westlands",
    description: "Luxurious 2-bedroom apartment with city views",
    address: "123 Westlands Road, Nairobi",
    price: 45000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    status: "available",
    landlordId: 1,
    image: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
    amenities: ["WiFi", "Parking", "Security", "Water Storage"]
  },
  {
    id: 2,
    title: "Family House in Karen",
    description: "Spacious 4-bedroom house with garden",
    address: "456 Karen Road, Nairobi",
    price: 120000,
    bedrooms: 4,
    bathrooms: 3.5,
    area: 3500,
    status: "occupied",
    landlordId: 1,
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    amenities: ["Garden", "Servant Quarter", "Swimming Pool", "Security"]
  }
];

const mockPayments = [
  {
    id: 1,
    tenantId: 2,
    propertyId: 2,
    amount: 120000,
    date: "2024-03-01",
    method: "mpesa",
    status: "completed",
    reference: "MPESA-123456789"
  },
  {
    id: 2,
    tenantId: 2,
    propertyId: 2,
    amount: 120000,
    date: "2024-02-01",
    method: "mpesa",
    status: "completed",
    reference: "MPESA-987654321"
  }
];

const mockComplaints = [
  {
    id: 1,
    tenantId: 2,
    propertyId: 2,
    subject: "Water Supply Issue",
    description: "Low water pressure in the kitchen",
    status: "in_progress",
    priority: "high",
    submitted: "2024-03-15T10:30:00Z",
    category: "plumbing"
  },
  {
    id: 2,
    tenantId: 2,
    propertyId: 2,
    subject: "Security Light Not Working",
    description: "The compound security light needs replacement",
    status: "open",
    priority: "medium",
    submitted: "2024-03-14T15:45:00Z",
    category: "electrical"
  }
];

const mockTenants = [
  {
    id: 1,
    userId: 2,
    propertyId: 2,
    rentAmount: 120000,
    leaseStart: "2023-12-01",
    leaseEnd: "2024-11-30",
    depositAmount: 120000
  }
];

export const mockData = {
  users: mockUsers,
  properties: mockProperties,
  payments: mockPayments,
  complaints: mockComplaints,
  tenants: mockTenants
};
