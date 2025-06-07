import React from "react";
import { useGetCustomersQuery } from "../api/apiSlice";
import { toast } from "react-toastify";

const Customers: React.FC = () => {
  const {
    data: customers = [],
    isLoading: isQueryLoading,
    error: queryError,
    refetch,
  } = useGetCustomersQuery(undefined, {
    pollingInterval: 0,
    refetchOnMountOrArgChange: true,
  });

  if (isQueryLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Loading customers...</p>
        </div>
      </div>
    );
  if (queryError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-rose-600 font-semibold">Error loading customers</p>
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
              Manage Customers
            </h1>
          </div>
          <button
            onClick={() => {
              refetch();
              toast.success("Refreshed customer list!");
            }}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Refresh
          </button>
        </div>

        {/* Customer List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {customers.length === 0 ? (
            <div className="bg-white/70 rounded-xl p-4 border border-white/50 shadow-sm text-center col-span-full">
              <div className="text-4xl mb-2 opacity-50">👤</div>
              <p className="text-slate-600 font-medium">No customers found</p>
              <p className="text-slate-500">Check back later</p>
            </div>
          ) : (
            customers.map((customer) => (
              <div
                key={customer.customer_name + customer.customer_phone}
                className="bg-white/80 rounded-xl p-2 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="grid grid-cols-1 gap-1">
                  {/* Customer Info */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="text-xs text-slate-500">Name</p>
                      <p className="text-slate-800 font-medium">{customer.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📞</span>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-slate-800">{customer.customer_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-lg mt-1">📍</span>
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="text-slate-700 text-sm">{customer.delivery_address}</p>
                    </div>
                  </div>

                  {/* Status & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                       <p className="text-xs text-slate-500">Delivery Status</p> 
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                         
                          customer.delivery_status === "delivered"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-emerald-200/50"
                            : customer.delivery_status === "in_transit"
                            ? "bg-amber-100 text-amber-700 border-amber-200 shadow-amber-200/50"
                            : customer.delivery_status === "cancelled"
                            ? "bg-rose-100 text-rose-700 border-rose-200 shadow-rose-200/50"
                            : "bg-slate-100 text-slate-700 border-slate-200 shadow-slate-200/50"
                        }`}
                      >
                        {customer.delivery_status.charAt(0).toUpperCase() +
                          customer.delivery_status.slice(1).replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 text-right">
                    Delivered:{" "}
                    {customer.delivered_at
                      ? new Date(customer.delivered_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;