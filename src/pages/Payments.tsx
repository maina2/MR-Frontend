import React from "react";
import { useGetPaymentsQuery } from "../api/apiSlice";

import toast from "react-hot-toast";

const Payments: React.FC = () => {
  const {
    data: payments = [],
    isLoading: isQueryLoading,
    error: queryError,
    refetch,
  } = useGetPaymentsQuery(undefined, {
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
        Error loading payments
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Manage Payments
          </h1>
          <button
            onClick={() => {
              refetch();
              toast.success("Refreshed payment list!");
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Refresh
          </button>
        </div>

        {/* Payment List */}
        <div className="grid gap-6">
          {payments.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">
              No payments found.
            </p>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.parcel_id} // Unique key using parcel_id
                className="bg-white/15 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-gray-600 text-sm">
                      Parcel ID:{" "}
                      <span className="text-gray-800 font-medium">
                        {payment.parcel_id}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Customer Name:{" "}
                      <span className="text-gray-800 font-medium">
                        {payment.customer_name}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Cost:{" "}
                      <span className="text-gray-800 font-medium">
                        {payment.delivery_cost !== null
                          ? `$${payment.delivery_cost}`
                          : "N/A"}
                      </span>
                    </div>
                    {/* <div className="text-gray-600 text-sm flex items-center gap-2">
                      Status:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          payment.status === "delivered"
                            ? "bg-green-500/20 text-green-500 border-green-500/30"
                            : payment.status === "in_transit"
                            ? "bg-orange-500/20 text-orange-500 border-orange-500/30"
                            : payment.status === "cancelled"
                            ? "bg-red-500/20 text-red-500 border-red-500/30"
                            : "bg-gray-500/20 text-gray-500 border-gray-500/30"
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </span>
                    </div> */}
                    <div className="text-gray-600 text-sm">
                      Delivered:{" "}
                      <span className="text-gray-800 font-medium">
                        {payment.delivered_at
                          ? new Date(payment.delivered_at).toLocaleDateString()
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

export default Payments;