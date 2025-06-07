import React, { useState } from "react";
import {
  useGetDeliveriesQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
} from "../api/apiSlice";
import type { Delivery } from "../types/Delivery";
import toast from "react-hot-toast";

const Deliveries: React.FC = () => {
  const {
    data: deliveries = [],
    isLoading: isLoadingDeliveries,
    error: errorDeliveries,
  } = useGetDeliveriesQuery(undefined, {
    pollingInterval: 0,
    refetchOnMountOrArgChange: true,
  });

  const [createDelivery, { isLoading: isCreating }] = useCreateDeliveryMutation();
  const [updateDelivery, { isLoading: isUpdating }] = useUpdateDeliveryMutation();

  const [newDelivery, setNewDelivery] = useState<Partial<Delivery>>({
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    delivery_postal_code: "",
    delivery_city: "",
    delivery_status: "pending",
    delivery_cost: null,
  });
  const [editDelivery, setEditDelivery] = useState<Partial<Delivery> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Sending data:", newDelivery);
      await createDelivery(newDelivery).unwrap();
      setNewDelivery({
        customer_name: "",
        customer_phone: "",
        delivery_address: "",
        delivery_postal_code: "",
        delivery_city: "",
        delivery_status: "pending",
        delivery_cost: null,
      });
      setIsModalOpen(false);
      toast.success("Delivery created successfully!");
    } catch (err) {
      toast.error("Failed to create delivery. Please try again.");
      console.error("Failed to create delivery:", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editDelivery?.id) {
      try {
        const dataToSend = {
          delivery_status: editDelivery.delivery_status,
          delivery_cost: editDelivery.delivery_cost,
        };
        await updateDelivery({
          id: editDelivery.id,
          data: dataToSend,
        }).unwrap();
        setEditDelivery(null);
        setIsModalOpen(false);
        toast.success("Delivery updated successfully!");
      } catch (err) {
        toast.error("Failed to update delivery. Please try again.");
        console.error("Failed to update delivery:", err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-emerald-200/50";
      case "in_transit":
        return "bg-amber-100 text-amber-700 border-amber-200 shadow-amber-200/50";
      case "cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200 shadow-rose-200/50";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 shadow-slate-200/50";
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

  if (isLoadingDeliveries)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Loading deliveries...</p>
        </div>
      </div>
    );
  if (errorDeliveries)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-rose-600 font-semibold">Error loading deliveries</p>
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
              Manage Deliveries
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isCreating}
            className={`px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isCreating ? "Creating..." : "New Delivery"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: "Total", count: deliveries.length, color: "blue" },
            { label: "Pending", count: deliveries.filter(d => d.delivery_status === "pending").length, color: "slate" },
            { label: "In Transit", count: deliveries.filter(d => d.delivery_status === "in_transit").length, color: "amber" },
            { label: "Delivered", count: deliveries.filter(d => d.delivery_status === "delivered").length, color: "emerald" },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white/70 rounded-xl p-2 border border-white/50 shadow-sm hover:shadow-md transition-all duration-200 ${stat.color === "blue" ? "hover:bg-blue-50" : stat.color === "slate" ? "hover:bg-slate-50" : stat.color === "amber" ? "hover:bg-amber-50" : "hover:bg-emerald-50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase text-slate-600">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-800">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {deliveries.length === 0 ? (
            <div className="bg-white/70 rounded-xl p-4 border border-white/50 shadow-sm text-center col-span-full">
              <div className="text-4xl mb-2 opacity-50">📦</div>
              <p className="text-slate-600 font-medium">No deliveries found</p>
              <p className="text-slate-500">Create your first delivery</p>
            </div>
          ) : (
            deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white/80 rounded-xl p-2 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="grid grid-cols-1 gap-1">
                  {/* Parcel & Customer Info */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📦</span>
                    <div>
                      <p className="text-xs text-slate-500">Parcel ID</p>
                      <p className="text-slate-800 font-medium">{delivery.parcel_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="text-xs text-slate-500">Customer</p>
                      <p className="text-slate-800">{delivery.customer_name}</p>
                      <p className="text-xs text-slate-600">{delivery.customer_phone}</p>
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="flex items-start space-x-2">
                    <span className="text-lg mt-1">📍</span>
                    <div>
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="text-slate-700 text-sm">{delivery.delivery_address}</p>
                      <p className="text-xs text-slate-600">{delivery.delivery_city}, {delivery.delivery_postal_code}</p>
                    </div>
                  </div>

                  {/* Status & Cost */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">{getStatusIcon(delivery.delivery_status)}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(delivery.delivery_status)}`}>
                        {delivery.delivery_status.charAt(0).toUpperCase() + delivery.delivery_status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-slate-800">
                      {delivery.delivery_cost !== null ? `${delivery.delivery_cost} Ksh` : "N/A"}
                    </div>
                  </div>

                  {/* Date Info */}
                  <div className="text-xs text-slate-500 text-right">
                    Created: {new Date(delivery.created_at).toLocaleDateString()}
                    {delivery.delivered_at && (
                      <p className="text-emerald-600">Delivered: {new Date(delivery.delivered_at).toLocaleDateString()}</p>
                    )}
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => setEditDelivery(delivery)}
                    disabled={isUpdating}
                    className={`w-full py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg mt-1 ${isUpdating && editDelivery?.id === delivery.id ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600 transition-all duration-200"}`}
                  >
                    {isUpdating && editDelivery?.id === delivery.id ? "Updating..." : "Edit"}
                  </button>
                </div>

                {/* Edit Modal */}
                {editDelivery?.id === delivery.id && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white/90 rounded-xl p-4 w-full max-w-md">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Update Delivery</h3>
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700">
                            Status
                          </label>
                          <select
                            value={editDelivery.delivery_status || "pending"}
                            onChange={(e) =>
                              setEditDelivery({
                                ...editDelivery,
                                delivery_status: e.target.value as "pending" | "in_transit" | "delivered" | "cancelled",
                              })
                            }
                            className="w-full px-3 py-2 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            disabled={isUpdating}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">
                            Cost (Ksh)
                          </label>
                          <input
                            type="number"
                            value={editDelivery.delivery_cost || ""}
                            onChange={(e) =>
                              setEditDelivery({
                                ...editDelivery,
                                delivery_cost: e.target.value ? parseFloat(e.target.value) : null,
                              })
                            }
                            className="w-full px-3 py-2 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter cost"
                            disabled={isUpdating}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            disabled={isUpdating}
                            className={`flex-1 py-2 bg-orange-500 text-white rounded-lg ${isUpdating ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600 transition-all"}`}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditDelivery(null)}
                            className="flex-1 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create Delivery Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 rounded-xl p-4 w-full max-w-md overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Add New Delivery</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700">×</button>
              </div>
              <form onSubmit={handleCreate} className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Customer Name *</label>
                    <input
                      type="text"
                      value={newDelivery.customer_name || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, customer_name: e.target.value })}
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phone *</label>
                    <input
                      type="text"
                      value={newDelivery.customer_phone || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, customer_phone: e.target.value })}
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Address *</label>
                    <input
                      type="text"
                      value={newDelivery.delivery_address || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, delivery_address: e.target.value })}
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Postal Code *</label>
                    <input
                      type="text"
                      value={newDelivery.delivery_postal_code || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, delivery_postal_code: e.target.value })}
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">City *</label>
                    <input
                      type="text"
                      value={newDelivery.delivery_city || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, delivery_city: e.target.value })}
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Cost (Ksh)</label>
                    <input
                      type="number"
                      value={newDelivery.delivery_cost || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, delivery_cost: e.target.value ? parseFloat(e.target.value) : null })}
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Optional"
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Status</label>
                    <select
                      value={newDelivery.delivery_status || "pending"}
                      onChange={(e) => setNewDelivery({ ...newDelivery, delivery_status: e.target.value as "pending" | "in_transit" | "delivered" | "cancelled" })}
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={isCreating}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className={`flex-1 py-2 bg-orange-500 text-white rounded-lg ${isCreating ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600 transition-all"}`}
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deliveries;