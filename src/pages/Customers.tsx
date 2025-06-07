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
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  if (queryError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading customers
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Manage Customers
          </h1>
          <button
            onClick={() => {
              refetch();
              toast.success("Refreshed customer list!");
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Refresh
          </button>
        </div>

        {/* Customer List */}
        <div className="grid gap-6">
          {customers.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">
              No customers found.
            </p>
          ) : (
            customers.map((customer) => (
              <div
                key={customer.customer_name + customer.customer_phone} // Unique key using name and phone
                className="bg-white/15 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-gray-600 text-sm">
                      Name:{" "}
                      <span className="text-gray-800 font-medium">
                        {customer.customer_name}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Phone:{" "}
                      <span className="text-gray-800 font-medium">
                        {customer.customer_phone}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Address:{" "}
                      <span className="text-gray-800 font-medium">
                        {customer.delivery_address}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm flex items-center gap-2">
                      Status:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          customer.delivery_status === "delivered"
                            ? "bg-green-500/20 text-green-500 border-green-500/30"
                            : customer.delivery_status === "in_transit"
                            ? "bg-orange-500/20 text-orange-500 border-orange-500/30"
                            : customer.delivery_status === "cancelled"
                            ? "bg-red-500/20 text-red-500 border-red-500/30"
                            : "bg-gray-500/20 text-gray-500 border-gray-500/30"
                        }`}
                      >
                        {customer.delivery_status.charAt(0).toUpperCase() +
                          customer.delivery_status.slice(1)}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Delivered:{" "}
                      <span className="text-gray-800 font-medium">
                        {customer.delivered_at
                          ? new Date(customer.delivered_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="space-x-3">
                    {/* Remove Edit and Delete buttons since no endpoints exist */}
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