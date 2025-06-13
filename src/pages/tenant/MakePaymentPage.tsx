import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Phone, DollarSign, CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { paymentApi } from '../../services/api';

interface MpesaPaymentForm {
  amount: number;
  phone: string;
  description?: string;
}

interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  reference?: string;
  date?: string;
}

const MakePaymentPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusCheckCount, setStatusCheckCount] = useState(0);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<MpesaPaymentForm>();

  const amount = watch('amount');
  const phone = watch('phone');

  // Poll payment status if we have a pending payment
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (paymentStatus?.status === 'pending' && statusCheckCount < 20) { // Stop after 20 checks (1 minute)
      interval = setInterval(async () => {
        try {
          setIsCheckingStatus(true);
          const response = await paymentApi.checkMpesaPaymentStatus(paymentStatus.paymentId);
          const updatedStatus = response.data;
          
          setPaymentStatus(updatedStatus);
          setStatusCheckCount(prev => prev + 1);
          
          if (updatedStatus.status === 'completed') {
            toast.success('🎉 Payment completed successfully!');
            clearInterval(interval);
          } else if (updatedStatus.status === 'failed') {
            toast.error('❌ Payment failed. Please try again.');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        } finally {
          setIsCheckingStatus(false);
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentStatus?.status, paymentStatus?.paymentId, statusCheckCount]);

  const formatPhone = (phone: string) => {
    // Remove any non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Convert to 254 format
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    // Check various formats
    if (cleaned.match(/^0[71]\d{8}$/)) return true; // 0712345678
    if (cleaned.match(/^254[71]\d{8}$/)) return true; // 254712345678
    if (cleaned.match(/^[71]\d{8}$/)) return true; // 712345678
    
    return false;
  };

  const onSubmit = async (data: MpesaPaymentForm) => {
    try {
      setIsLoading(true);
      setPaymentStatus(null);
      setStatusCheckCount(0);
      
      const formattedPhone = formatPhone(data.phone);
      
      const formattedData = {
        ...data,
        phone: formattedPhone,
        description: data.description || `Rent payment of KES ${data.amount}`
      };
      
      console.log('📱 Submitting payment to phone:', formattedPhone);
      console.log('💰 Payment details:', formattedData);
      
      const response = await paymentApi.initiateMpesaPayment(formattedData);
      console.log('✅ Payment response:', response.data);
      
      // Extract paymentId from the response
      const paymentId = response.data.data?.paymentId || response.data.paymentId;
      
      if (!paymentId) {
        console.error('❌ No payment ID received:', response.data);
        toast.error('Failed to initiate payment - no payment ID received');
        return;
      }
      
      // Show success message with phone number confirmation
      const maskedPhone = formattedPhone.substring(0, 6) + '***';
      toast.success(`📱 STK push sent to ${maskedPhone}! Check your phone for M-Pesa prompt.`);
      
      // Set initial status with the correct paymentId
      setPaymentStatus({
        paymentId: paymentId,
        status: 'pending',
        amount: data.amount
      });
      
      console.log('💾 Payment status set with ID:', paymentId);
      
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to initiate payment';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPayment = () => {
    setPaymentStatus(null);
    setStatusCheckCount(0);
    reset();
  };

  const manualStatusCheck = async () => {
    if (!paymentStatus?.paymentId) return;
    
    try {
      setIsCheckingStatus(true);
      const response = await paymentApi.checkMpesaPaymentStatus(paymentStatus.paymentId);
      const updatedStatus = response.data;
      
      setPaymentStatus(updatedStatus);
      
      if (updatedStatus.status === 'completed') {
        toast.success('🎉 Payment completed successfully!');
      } else if (updatedStatus.status === 'failed') {
        toast.error('❌ Payment failed.');
      } else {
        toast.info('💭 Payment still pending...');
      }
    } catch (error) {
      toast.error('Failed to check payment status');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400" />;
      case 'failed':
        return <XCircle className="h-12 w-12 text-red-500" />;
      case 'pending':
        return <Clock className="h-12 w-12 text-yellow-500 animate-pulse" />;
      default:
        return <AlertCircle className="h-12 w-12 text-gray-500" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Processing Payment...';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Your rent payment has been processed successfully. You should receive an M-Pesa confirmation SMS shortly.';
      case 'failed':
        return 'The payment could not be processed. This might be due to insufficient funds, incorrect PIN, or network issues.';
      case 'pending':
        return 'Please check your phone for the M-Pesa payment prompt and enter your PIN to complete the transaction.';
      default:
        return 'Unable to determine payment status.';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900';
      case 'failed':
        return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-800';
    }
  };

  const getButtonColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 hover:bg-green-700';
      case 'failed':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700 dark:bg-purple-700 dark:hover:bg-purple-800';
    }
  };

  // Show payment status if we have one
  if (paymentStatus) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleNewPayment}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payment Form
          </button>
        </div>

        <div className={`border rounded-lg p-8 ${getStatusColor(paymentStatus.status)}`}>
          <div className="text-center">
            {getStatusIcon(paymentStatus.status)}
            
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {getStatusMessage(paymentStatus.status)}
            </h2>
            
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              {getStatusDescription(paymentStatus.status)}
            </p>
            
            <div className="mt-6 bg-white rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Amount:</span>
                <span className="text-lg font-bold text-gray-900">
                  KES {paymentStatus.amount.toLocaleString()}
                </span>
              </div>
              
              {paymentStatus.reference && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Reference:</span>
                  <span className="text-sm text-gray-900 font-mono">
                    {paymentStatus.reference}
                  </span>
                </div>
              )}
              
              {paymentStatus.date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(paymentStatus.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>

            {paymentStatus.status === 'pending' && (
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500"></div>
                  <span className="text-sm text-gray-600">
                    {isCheckingStatus ? 'Checking status...' : 'Waiting for confirmation...'}
                  </span>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Next Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li>Check your phone for M-Pesa notification</li>
                        <li>Enter your M-Pesa PIN when prompted</li>
                        <li>Wait for confirmation SMS</li>
                        <li>This page will update automatically</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <button
                  onClick={manualStatusCheck}
                  disabled={isCheckingStatus}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center"
                >
                  {isCheckingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Check Status Manually
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {paymentStatus.status === 'completed' && (
                <button
                  onClick={handleNewPayment}
                  className={`w-full ${getButtonColor(paymentStatus.status)} text-white py-3 px-4 rounded-md transition-colors font-medium`}
                >
                  Make Another Payment
                </button>
              )}
              
              {paymentStatus.status === 'failed' && (
                <button
                  onClick={handleNewPayment}
                  className={`w-full ${getButtonColor(paymentStatus.status)} text-white py-3 px-4 rounded-md transition-colors font-medium`}
                >
                  Try Again
                </button>
              )}
              
              {paymentStatus.status === 'pending' && (
                <button
                  onClick={handleNewPayment}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel & Start Over
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show payment form
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
          <Phone className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">M-Pesa Payment</h1>
        <p className="text-gray-600">Pay your rent securely with M-Pesa</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (KES) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="1"
              max="500000"
              step="1"
              {...register('amount', { 
                required: 'Amount is required',
                min: { value: 1, message: 'Minimum amount is KES 1' },
                max: { value: 500000, message: 'Maximum amount is KES 500,000' }
              })}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-lg"
              placeholder="Enter amount"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
          {amount && amount > 0 && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <p className="text-gray-700">
                <span className="font-medium">You will pay:</span> KES {amount.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            M-Pesa Phone Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm font-medium">+254</span>
            </div>
            <input
              type="tel"
              {...register('phone', {
                required: 'Phone number is required',
                validate: (value) => 
                  validatePhoneNumber(value) || 'Please enter a valid Kenyan phone number'
              })}
              placeholder="712345678"
              className="block w-full pl-16 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-lg"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            <p>Accepted formats: 0712345678, 254712345678, or 712345678</p>
            <p>Must be registered with M-Pesa</p>
          </div>
          
          {/* Phone confirmation box */}
          {phone && validatePhoneNumber(phone) && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  <span className="font-medium">STK push will be sent to:</span> {formatPhone(phone)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Description (Optional)
          </label>
          <input
            type="text"
            {...register('description')}
            placeholder="e.g., Rent payment for December 2024"
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            maxLength={100}
          />
          <p className="mt-1 text-xs text-gray-500">
            This will appear in your M-Pesa transaction history
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">How M-Pesa Payment Works:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Click "Pay with M-Pesa" to initiate the payment</li>
                <li>An STK push will be sent to the phone number you entered</li>
                <li>Check your phone for the M-Pesa payment prompt</li>
                <li>Enter your M-Pesa PIN to authorize the payment</li>
                <li>You'll receive a confirmation SMS from M-Pesa</li>
                <li>The payment status will update automatically on this page</li>
              </ol>
              {phone && validatePhoneNumber(phone) && (
                <div className="mt-3 p-2 bg-blue-100 rounded border-l-4 border-blue-400">
                  <p className="text-xs font-medium">
                    📱 Payment prompt will be sent to: <span className="font-mono">{formatPhone(phone)}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !amount || !phone}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              <Phone className="h-5 w-5 mr-2" />
              Pay with M-Pesa
            </>
          )}
        </button>

        <div className="text-center pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Secure
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Instant
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Reliable
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Powered by Safaricom M-Pesa
          </p>
        </div>
      </form>
    </div>
  );
};

export default MakePaymentPage;