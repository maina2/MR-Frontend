import React, { useState } from "react";
import { useGetCustomersQuery } from "../api/apiSlice";
import type { Customer } from "../types/Customer";
import toast from "react-hot-toast";

const PAGE_SIZE = 12; 

const Customers: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: paginatedCustomers,
    isLoading: isQueryLoading,
    error: queryError,
    isFetching,
  } = useGetCustomersQuery(
    {
      limit: PAGE_SIZE,
      offset,
      ...(searchTerm && { search: searchTerm }),
    },
    {
      pollingInterval: 0,
      refetchOnMountOrArgChange: true,
    }
  );

  const customers = paginatedCustomers?.results ?? [];
  const totalCount = paginatedCustomers?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setOffset(0); // Reset to first page on search
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "in_transit":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return "✓";
      case "in_transit":
        return "🚚";
      case "cancelled":
        return "✕";
      default:
        return "⏳";
    }
  };

  // Pagination window: Show current page ±2, first, last, and ellipses
  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Show up to 5 page numbers
    const pages: (number | string)[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (isQueryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (queryError) {
    const errorMessage =
      (queryError as any)?.data?.detail ||
      "Failed to load customers. Please try again.";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-rose-600 font-semibold">{errorMessage}</p>
          <p className="text-slate-500 mt-1">Check your search or try refreshing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Manage Customers
          </h1>
          <button
            onClick={() => {
              setOffset(0);
              toast.success("Refreshed customer list!");
            }}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Refresh
          </button>
        </div>

        {/* Search Input and Total Count */}
        <div className="mb-4 space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by customer name or parcel ID..."
              className="w-full px-4 py-2 pl-10 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">🔍</span>
          </div>
          <div className="text-sm text-slate-600">
            Total Customers: <span className="font-medium">{totalCount}</span>
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto bg-white/80 rounded-xl border border-white/60 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Delivered At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-slate-600">
                    <div className="text-4xl mb-2 opacity-50">👤</div>
                    <p className="text-slate-600 font-medium">No customers found</p>
                    <p className="text-slate-500">Try adjusting your search</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer: Customer, index: number) => (
                  <tr
                    key={customer.customer_name + customer.customer_phone + index}
                    className="hover:bg-slate-50/50 transition-all duration-200"
                  >
                    <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                      {customer.customer_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800">
                      {customer.customer_phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {customer.delivery_address}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          customer.delivery_status
                        )}`}
                      >
                        <span className="mr-1">{getStatusIcon(customer.delivery_status)}</span>
                        {customer.delivery_status.charAt(0).toUpperCase() +
                          customer.delivery_status.slice(1).replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {customer.delivered_at
                        ? new Date(customer.delivered_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
            <div className="text-sm text-slate-600">
              Showing {offset + 1} - {Math.min(offset + PAGE_SIZE, totalCount)} of {totalCount} customers
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(offset - PAGE_SIZE)}
                disabled={offset === 0 || isFetching}
                className={`px-5 py-2 rounded-lg font-semibold text-sm ${
                  offset === 0 || isFetching
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                Previous
              </button>
              {getPageNumbers().map((page, idx) =>
                typeof page === "string" ? (
                  <span key={idx} className="px-3 py-2 text-sm text-slate-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => handlePageChange((page - 1) * PAGE_SIZE)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      currentPage === page
                        ? "bg-orange-500 text-white"
                        : "bg-white/70 text-slate-700 border border-white/50 hover:bg-orange-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(offset + PAGE_SIZE)}
                disabled={offset + PAGE_SIZE >= totalCount || isFetching}
                className={`px-5 py-2 rounded-lg font-semibold text-sm ${
                  offset + PAGE_SIZE >= totalCount || isFetching
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
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

export default Customers;