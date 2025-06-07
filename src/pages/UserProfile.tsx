import React, { useState } from 'react';
import { useGetUserQuery, useUpdateUserMutation } from '../api/apiSlice';
import type { User } from '../types/User';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const { data: user, isLoading, error, refetch } = useGetUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const [formData, setFormData] = useState<Partial<User>>({});

  const handleUpdate = async () => {
    try {
      await updateUser(formData).unwrap();
      toast.success('Profile updated successfully!');
      refetch(); // Refresh data after successful update
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile.');
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-rose-600 font-semibold">Error loading profile</p>
          <p className="text-slate-500 mt-1">Please try refreshing</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              User Profile
            </h1>
          </div>
          <button
            onClick={() => {
              refetch();
              toast.success('Refreshed profile!');
            }}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Refresh
          </button>
        </div>

        {/* Profile Form */}
        <div className="bg-white/80 rounded-xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">👤</span>
              <div>
                <p className="text-xs text-slate-500">Username</p>
                <p className="text-slate-800 font-medium">{user?.username || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">✉️</span>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-slate-800">{user?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  New Email
                </label>
                <input
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-1 bg-white/15 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                  placeholder="Enter new email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-1 bg-white/15 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <button
              onClick={handleUpdate}
              className="w-full mt-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;