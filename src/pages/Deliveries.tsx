import React, { useState } from "react";
import {
  useGetDeliveriesQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
} from "../api/apiSlice";
import type { Delivery } from "../types/Delivery";
import toast from "react-hot-toast";

const PAGE_SIZE = 12;

const Deliveries: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "in_transit" | "delivered" | "cancelled"
  >("all");

  const {
    data: paginatedDeliveries,
    isLoading: isLoadingDeliveries,
    error: errorDeliveries,
    isFetching,
  } = useGetDeliveriesQuery(
    {
      limit: PAGE_SIZE,
      offset,
      ...(statusFilter !== "all" && { delivery_status: statusFilter }),
    },
    {
      pollingInterval: 0,
      refetchOnMountOrArgChange: true,
    }
  );

  const [createDelivery, { isLoading: isCreating }] = useCreateDeliveryMutation();
  const [updateDelivery, { isLoading: isUpdating }] = useUpdateDeliveryMutation();
  const [deleteDelivery, { isLoading: isDeleting }] = useDeleteDeliveryMutation();

  const [newDelivery, setNewDelivery] = useState<Partial<Delivery>>({
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    delivery_postal_code: "",
    delivery_city: "",
    delivery_status: "pending",
    delivery_cost: "",
  });
  const [editDelivery, setEditDelivery] = useState<Partial<Delivery> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deliveries = paginatedDeliveries?.results ?? [];
  const totalCount = paginatedDeliveries?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDelivery(newDelivery).unwrap();
      setNewDelivery({
        customer_name: "",
        customer_phone: "",
        delivery_address: "",
        delivery_postal_code: "",
        delivery_city: "",
        delivery_status: "pending",
        delivery_cost: "",
      });
      setIsModalOpen(false);
      toast.success("Delivery created successfully!");
    } catch (err: any) {
      const errorMessage =
        err?.data?.detail || "Failed to create delivery. Please try again.";
      toast.error(errorMessage);
      console.error("Failed to create delivery:", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editDelivery?.id) {
      try {
        const dataToSend = {
          delivery_status: editDelivery.delivery_status,
          delivery_cost: editDelivery.delivery_cost || null,
        };
        await updateDelivery({
          id: editDelivery.id,
          data: dataToSend,
        }).unwrap();
        setEditDelivery(null);
        setIsModalOpen(false);
        toast.success("Delivery updated successfully!");
      } catch (err: any) {
        const errorMessage =
          err?.data?.detail || "Failed to update delivery. Please try again.";
        toast.error(errorMessage);
        console.error("Failed to update delivery:", err);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      try {
        await deleteDelivery(id).unwrap();
        toast.success("Delivery deleted successfully!");
      } catch (err: any) {
        const errorMessage =
          err?.data?.error || "Failed to delete delivery. Please try again.";
        toast.error(errorMessage);
        console.error("Failed to delete delivery:", err);
      }
    }
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
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

  if (isLoadingDeliveries) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  if (errorDeliveries) {
    const errorMessage =
      (errorDeliveries as any)?.data?.detail ||
      "Error loading deliveries. Please try refreshing.";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-rose-600 font-semibold">{errorMessage}</p>
          <p className="text-slate-500 mt-1">Please try refreshing or check your filters.</p>
        </div>
      </div>
    );
  }

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
            className={`px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
              isCreating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCreating ? "Creating..." : "New Delivery"}
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "In Transit", value: "in_transit" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setStatusFilter(
                  filter.value as
                    | "all"
                    | "pending"
                    | "in_transit"
                    | "delivered"
                    | "cancelled"
                );
                setOffset(0);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                statusFilter === filter.value
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white/70 text-slate-700 border border-white/50 hover:bg-orange-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {[
            { label: "Total", count: totalCount, color: "blue" },
            {
              label: "Pending",
              count: deliveries.filter((d) => d.delivery_status === "pending").length,
              color: "slate",
            },
            {
              label: "In Transit",
              count: deliveries.filter((d) => d.delivery_status === "in_transit")
                .length,
              color: "amber",
            },
            {
              label: "Delivered",
              count: deliveries.filter((d) => d.delivery_status === "delivered")
                .length,
              color: "emerald",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-white/70 rounded-xl p-2 border border-white/50 shadow-sm hover:shadow-md transition-all duration-200 ${
                stat.color === "blue"
                  ? "hover:bg-blue-50"
                  : stat.color === "slate"
                  ? "hover:bg-slate-50"
                  : stat.color === "amber"
                  ? "hover:bg-amber-50"
                  : "hover:bg-emerald-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase text-slate-600">
                    {stat.label}
                  </p>
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
              <p className="text-slate-500">Create your first delivery or adjust filters</p>
            </div>
          ) : (
            deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white/80 rounded-xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-x-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Parcel ID:</span> {delivery.parcel_id}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Customer Name:</span> {delivery.customer_name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Delivery Address:</span> {delivery.delivery_address}
                    </p>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">City:</span> {delivery.delivery_city}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Created At:</span> {new Date(delivery.created_at).toLocaleDateString()}
                    </p>
                    {delivery.delivered_at && (
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Delivered At:</span> {new Date(delivery.delivered_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Delivery Cost:</span> {delivery.delivery_cost ? `${delivery.delivery_cost} Ksh` : "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          delivery.delivery_status
                        )}`}
                      >
                        {delivery.delivery_status.charAt(0).toUpperCase() +
                          delivery.delivery_status.slice(1).replace("_", " ")}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => setEditDelivery(delivery)}
                      disabled={isUpdating}
                      className={`flex-1 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg ${
                        isUpdating && editDelivery?.id === delivery.id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-emerald-600 transition-all duration-200"
                      }`}
                    >
                      {isUpdating && editDelivery?.id === delivery.id ? "Updating..." : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDelete(delivery.id)}
                      disabled={isDeleting}
                      className={`flex-1 py-1 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-lg ${
                        isDeleting
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-rose-600 transition-all duration-200"
                      }`}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Edit Modal */}
                {editDelivery?.id === delivery.id && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white/90 rounded-xl p-4 w-full max-w-md">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Update Delivery
                      </h3>
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
                                delivery_status: e.target.value as
                                  | "pending"
                                  | "in_transit"
                                  | "delivered"
                                  | "cancelled",
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
                            type="text"
                            value={editDelivery.delivery_cost || ""}
                            onChange={(e) =>
                              setEditDelivery({
                                ...editDelivery,
                                delivery_cost: e.target.value || "",
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
                            className={`flex-1 py-2 bg-orange-500 text-white rounded-lg ${
                              isUpdating
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-orange-600 transition-all"
                            }`}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
            <div className="text-sm text-slate-600">
              Showing {offset + 1} - {Math.min(offset + PAGE_SIZE, totalCount)} of {totalCount} deliveries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(offset - PAGE_SIZE)}
                disabled={offset === 0 || isFetching}
                className={`px-4 py-2 rounded-lg ${
                  offset === 0 || isFetching
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-white/70 text-slate-700 border border-white/50 hover:bg-orange-100"
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx * PAGE_SIZE)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === idx + 1
                      ? "bg-orange-500 text-white"
                      : "bg-white/70 text-slate-700 border border-white/50 hover:bg-orange-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(offset + PAGE_SIZE)}
                disabled={offset + PAGE_SIZE >= totalCount || isFetching}
                className={`px-4 py-2 rounded-lg ${
                  offset + PAGE_SIZE >= totalCount || isFetching
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-white/70 text-slate-700 border border-white/50 hover:bg-orange-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Create Delivery Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 rounded-xl p-4 w-full max-w-md overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Add New Delivery</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={newDelivery.customer_name || ""}
                      onChange={(e) =>
                        setNewDelivery({
                          ...newDelivery,
                          customer_name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Phone *
                    </label>
                    <input
                      type="text"
                      value={newDelivery.customer_phone || ""}
                      onChange={(e) =>
                        setNewDelivery({
                          ...newDelivery,
                          customer_phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={newDelivery.delivery_address || ""}
                      onChange={(e) =>
                        setNewDelivery({
                          ...newDelivery,
                          delivery_address: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={newDelivery.delivery_postal_code || ""}
                      onChange={(e) =>
                        setNewDelivery({
                          ...newDelivery,
                          delivery_postal_code: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      City *
                    </label>
                    <input
                      type="text"
                      value={newDelivery.delivery_city || ""}
                      onChange={(e) =>
                        setNewDelivery({
                          ...newDelivery,
                          delivery_city: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Cost (Ksh)
                    </label>
                    <input
                      type="text"
                      value={newDelivery.delivery_cost || ""}
                      onChange={(e) =>
                        setNewDelivery({
                          ...newDelivery,
                          delivery_cost: e.target.value || "",
                        })
                      }
                      className="w-full px-3 py-1 bg-white/80 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Optional"
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Status
                    </label>
                    <select
                      value={newDelivery.delivery_status || "pending"}
                      onChange={(e) =>
                        setNewDelivery({
                          ...newDelivery,
                          delivery_status: e.target.value as
                            | "pending"
                            | "in_transit"
                            | "delivered"
                            | "cancelled",
                        })
                      }
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
                    className={`flex-1 py-2 bg-orange-500 text-white rounded-lg ${
                      isCreating
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-orange-600 transition-all"
                    }`}
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