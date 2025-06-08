import React, { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { complaintApi } from '../../services/api';
import { toast } from 'react-toastify';

interface ComplaintFormData {
  subject: string;
  category: string;
  description: string;
}

const SubmitComplaintPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComplaintFormData>();

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setIsSubmitting(true);
      
      // Ensure category is included in the submission
      const complaintData = {
        subject: data.subject,
        description: data.description,
        category: data.category || 'other' // Provide default fallback
      };
      
      console.log('Submitting complaint data:', complaintData);
      
      await complaintApi.submitComplaint(complaintData);
      toast.success('Complaint submitted successfully!');
      reset();
    } catch (error: any) {
      console.error('Complaint submission error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to submit complaint';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Submit a Complaint</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              {...register('subject', { required: 'Subject is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Brief description of the issue"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              defaultValue=""
            >
              <option value="">Select a category</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="appliance">Appliance</option>
              <option value="structural">Structural</option>
              <option value="security">Security</option>
              <option value="hvac">HVAC</option>
              <option value="maintenance">General Maintenance</option>
              <option value="noise">Noise Complaint</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters' }
              })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Please provide detailed information about the issue"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaintPage;