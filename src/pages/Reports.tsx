import React, { useState } from 'react';
import { useGetReportsQuery } from '../api/apiSlice';
import type { Report } from '../types/Report';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;
  const offset = (page - 1) * limit;

  const {
    data: reportsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetReportsQuery(
    { limit, offset, search: search.trim() || undefined },
    {
      pollingInterval: 0,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      (error as { data?: { detail?: string } })?.data?.detail || 'Failed to load reports.';
    toast.error(errorMessage);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-rose-600 font-semibold">{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const reports = reportsData?.results || [];
  const totalCount = reportsData?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Reports
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                refetch();
                toast.success('Refreshed reports!');
              }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex justify-end">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by parcel ID, customer, or city..."
              className="w-full px-4 py-2 pl-10 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto bg-white/80 rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Parcel ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">City</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Delivered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-600">
                    <div className="text-4xl mb-2 opacity-50">📋</div>
                    <p className="text-gray-600 font-medium">No reports found</p>
                  </td>
                </tr>
              ) : (
                reports.map((report: Report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 transition-all duration-200">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{report.parcel_id}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{report.customer_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{report.delivery_address}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{report.delivery_city}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(report.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {report.delivered_at ? new Date(report.delivered_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} reports
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-4 py-2 bg-gray-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="px-4 py-2 bg-green-500 text-white rounded-xl disabled:opacity-80 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
