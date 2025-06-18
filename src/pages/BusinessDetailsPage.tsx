import React, { useState, useEffect } from 'react';
import {
  useGetBusinessDetailsQuery,
  useCreateBusinessDetailsMutation,
  useUpdateBusinessDetailsMutation,
} from '../api/apiSlice';
import type { BusinessDetails } from '../types/BusinessDetails';
import toast from 'react-hot-toast';

const BusinessDetailsPage: React.FC = () => {
  const { data: business, isLoading, error } = useGetBusinessDetailsQuery();
  const [createBusinessDetails, { isLoading: isCreating }] = useCreateBusinessDetailsMutation();
  const [updateBusinessDetails, { isLoading: isUpdating }] = useUpdateBusinessDetailsMutation();
  const [formData, setFormData] = useState<Partial<BusinessDetails>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name,
        pin: business.pin,
        address: business.address,
        phone: business.phone,
        email: business.email,
      });
    }
  }, [business]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value || null });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, String(value));
        }
      });
      if (logoFile) data.append('logo', logoFile);

      if (business) {
        await updateBusinessDetails(data).unwrap();
        toast.success('Business details updated successfully!');
      } else {
        await createBusinessDetails(data).unwrap();
        toast.success('Business details created successfully!');
      }
      setLogoFile(null);
    } catch (err: any) {
      const errorMessage = err?.data?.error || 'Failed to save business details.';
      toast.error(errorMessage);
      console.error('Failed to save business details:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <p className="text-rose-600">Error: {(error as any)?.data?.error || 'Failed to load business details.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Business Details</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">PIN</label>
              <input
                type="text"
                name="pin"
                value={formData.pin || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">Address</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              {business?.logo && !logoFile && (
                <img src={business.logo} alt="Business Logo" className="w-32 h-32 object-contain mt-2" />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className={`mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg ${
              isCreating || isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
            }`}
          >
            {isCreating ? 'Creating...' : isUpdating ? 'Updating...' : business ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessDetailsPage;