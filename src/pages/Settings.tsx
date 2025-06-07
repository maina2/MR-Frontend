import React, { useState } from "react";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "../api/apiSlice";
import type { Settings } from "../types/Settings";
import toast from "react-hot-toast";

const Settings: React.FC = () => {
  const { data: settings, isLoading, error, refetch } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const [editSettings, setEditSettings] = useState<Partial<Settings> | null>(null);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-rose-600 font-semibold">Error loading settings</p>
          <p className="text-slate-500 mt-1">Please try refreshing</p>
        </div>
      </div>
    );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editSettings) {
      try {
        await updateSettings(editSettings).unwrap();
        setEditSettings(null);
        refetch();
        toast.success("Settings updated successfully!");
      } catch (err) {
        toast.error("Failed to update settings. Please try again.");
        console.error("Failed to update settings:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Business Settings
            </h1>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Refresh
          </button>
        </div>

        {/* Display or Edit Form */}
        {editSettings === null ? (
          <div className="bg-white/80 rounded-xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏢</span>
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="text-slate-800 font-medium">
                    {settings?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="text-xs text-slate-500">PIN</p>
                  <p className="text-slate-800 font-medium">
                    {settings?.pin || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-lg mt-1">📍</span>
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-slate-700 text-sm">
                    {settings?.address || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">📞</span>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-slate-800">{settings?.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">✉️</span>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-slate-800">{settings?.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌐</span>
                <div>
                  <p className="text-xs text-slate-500">Logo</p>
                  {settings?.logo ? (
                    <img
                      src={settings.logo}
                      alt="Business Logo"
                      className="w-32 h-32 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-800 font-medium">N/A</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditSettings(settings || {})}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200"
              >
                Edit Settings
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleUpdate}
            className="bg-white/80 rounded-xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200 space-y-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  value={editSettings.name || ""}
                  onChange={(e) =>
                    setEditSettings({ ...editSettings, name: e.target.value })
                  }
                  className="w-full px-3 py-1 bg-white/15 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  PIN
                </label>
                <input
                  type="text"
                  value={editSettings.pin || ""}
                  onChange={(e) =>
                    setEditSettings({ ...editSettings, pin: e.target.value })
                  }
                  className="w-full px-3 py-1 bg-white/15 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Address
                </label>
                <textarea
                  value={editSettings.address || ""}
                  onChange={(e) =>
                    setEditSettings({ ...editSettings, address: e.target.value })
                  }
                  className="w-full px-3 py-1 bg-white/15 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  type="text"
                  value={editSettings.phone || ""}
                  onChange={(e) =>
                    setEditSettings({ ...editSettings, phone: e.target.value })
                  }
                  className="w-full px-3 py-1 bg-white/15 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editSettings.email || ""}
                  onChange={(e) =>
                    setEditSettings({ ...editSettings, email: e.target.value })
                  }
                  className="w-full px-3 py-1 bg-white/15 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={editSettings.logo || ""}
                  onChange={(e) =>
                    setEditSettings({ ...editSettings, logo: e.target.value })
                  }
                  className="w-full px-3 py-1 bg-white/15 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                  placeholder="Enter image URL"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditSettings(null)}
                className="flex-1 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;