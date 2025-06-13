import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home, CreditCard, ShieldCheck, Users } from 'lucide-react';
import { APP_NAME } from '../../config/constants';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-blue-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Modern apartment building"
          />
          <div className="absolute inset-0 bg-blue-900 opacity-75" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {APP_NAME}
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            The leading property management platform in Kenya. 
            Manage rentals, process M-Pesa payments, and communicate efficiently.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {/* <Link
              to="/properties"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-900 bg-white hover:bg-gray-50"
            >
              Browse Properties
            </Link> */}
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-900 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">
              Everything you need to manage rentals
            </p>
            <p className="mt-4 max-w-2xl text-xl text-[var(--muted-foreground)] mx-auto">
              Our platform streamlines the rental process for both landlords and tenants.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-[var(--card)] rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-900 rounded-md shadow-lg">
                        <Home className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-[var(--foreground)] tracking-tight">Property Management</h3>
                    <p className="mt-5 text-base text-[var(--muted-foreground)]">
                      Easily manage your properties, track occupancy, and handle M-Pesa rent payments seamlessly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-[var(--card)] rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-900 rounded-md shadow-lg">
                        <CreditCard className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-[var(--foreground)] tracking-tight">Rent Collection</h3>
                    <p className="mt-5 text-base text-[var(--muted-foreground)]">
                      Streamline rent collection with automated reminders, M-Pesa integration, and instant receipt generation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-[var(--card)] rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-900 rounded-md shadow-lg">
                        <ShieldCheck className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-[var(--foreground)] tracking-tight">Maintenance Tracking</h3>
                    <p className="mt-5 text-base text-[var(--muted-foreground)]">
                      Submit and track maintenance requests with ease, ensuring quick resolution of issues.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-[var(--card)] rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-900 rounded-md shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-[var(--foreground)] tracking-tight">Tenant Management</h3>
                    <p className="mt-5 text-base text-[var(--muted-foreground)]">
                      Keep track of tenant information, leases, and communications in one centralized location.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-[var(--card)] rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-900 rounded-md shadow-lg">
                        <Building2 className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-[var(--foreground)] tracking-tight">Property Listings</h3>
                    <p className="mt-5 text-base text-[var(--muted-foreground)]">
                      Showcase your available properties with detailed listings and attract potential tenants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to simplify your rental management?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Join thousands of landlords and tenants who use {APP_NAME} to make property management seamless.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;