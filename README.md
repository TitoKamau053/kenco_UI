# Kenco Rental Management System - Frontend

## Overview
A modern web application for managing rental properties, built with React, TypeScript, and Ant Design. The system provides interfaces for property management, tenant management, payment processing, and maintenance requests.

## Prerequisites
- Node.js >= 18.0.0
- NPM or Yarn package manager
- Modern web browser

## Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: Ant Design
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **CSS Framework**: Tailwind CSS

## Getting Started

### Environment Setup
1. Clone the repository
2. Create a `.env` file in the project root with:
```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOAD_URL=http://localhost:5000/uploads
```

### Installation & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

## Project Structure
```
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── contexts/        # React contexts
├── hooks/          # Custom hooks
├── layouts/        # Layout components
├── pages/          # Page components
├── services/       # API services
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Features

### Property Management
- Property listing and search
- Property details with image gallery
- Add/edit property information
- Upload property images

### Tenant Management
- Tenant registration
- Lease management
- Tenant details and history

### Payment Processing
- M-Pesa integration
- Payment history
- Payment status tracking
- Receipt generation

### Maintenance Requests
- Submit maintenance requests
- Track request status
- Communication history

## Component Documentation

### Key Components
- `AuthLayout` - Authentication wrapper
- `DashboardLayout` - Main application layout
- `PropertyCard` - Property display component
- `PaymentForm` - Payment processing form
- `ComplaintForm` - Maintenance request form

### Hooks
- `useAuth` - Authentication state management
- `useProperties` - Property data management
- `usePayments` - Payment processing
- `useComplaints` - Complaint management

## State Management
The application uses React Context API for state management with the following contexts:
- `AuthContext` - User authentication state
- `PropertyContext` - Property management state
- `PaymentContext` - Payment processing state

## API Integration
All API calls are centralized in the `services` directory with separate modules for:
- Authentication
- Properties
- Tenants
- Payments
- Complaints

## Styling
- Tailwind CSS for utility-first styling
- Ant Design components for UI elements
- Custom CSS modules for component-specific styles

## Testing
- Unit tests with Vitest
- Component testing with React Testing Library
- End-to-end testing setup available

## Error Handling
- Global error boundary
- Form validation with React Hook Form
- API error handling with axios interceptors
- User-friendly error messages

## Performance Optimization
- Code splitting with React.lazy
- Image optimization
- Memoization with useMemo and useCallback
- Debounced search inputs

## Security
- JWT token management
- Protected routes
- XSS protection
- CSRF protection

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Development Guidelines
- Follow TypeScript best practices
- Use functional components
- Implement proper error handling
- Write unit tests for new features
- Follow the existing code style

## License
This project is licensed under the MIT License.

!!NOTE:
THE PAYMENT IN THIS APPLICATION IS USING MPESA DARAJA API SANDBOX SO NO REAL TRANSACTION ARE MADE
