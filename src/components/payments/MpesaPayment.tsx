import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone } from 'lucide-react';

interface MpesaPaymentData {
  phone: string;
  amount: number;
}

const MpesaPayment: React.FC<{
  amount: number;
  onSubmit: (data: MpesaPaymentData) => Promise<void>;
}> = ({ amount, onSubmit }) => {
  const [processing, setProcessing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<MpesaPaymentData>();

  const handlePayment = async (data: MpesaPaymentData) => {
    setProcessing(true);
    try {
      await onSubmit(data);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-green-100 p-3 rounded-full">
          <Phone className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <h3 className="text-lg font-medium text-center mb-4">M-Pesa Payment</h3>
      
      <form onSubmit={handleSubmit(handlePayment)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              +254
            </span>
            <input
              type="tel"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{9}$/,
                  message: 'Enter a valid Kenyan phone number (e.g., 712345678)'
                }
              })}
              className="block w-full pl-16 pr-4 py-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="712345678"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
          <input
            type="number"
            value={amount}
            disabled
            title="Payment amount in Kenyan Shillings"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-600 disabled:bg-green-300 dark:disabled:bg-green-900/50"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default MpesaPayment;
