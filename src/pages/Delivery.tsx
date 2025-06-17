import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetDeliveryQuery,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
} from "../api/apiSlice";
import type { Delivery } from "../types/Delivery";
import toast from "react-hot-toast";

const Delivery: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editDelivery, setEditDelivery] = useState<Partial<Delivery> | null>(
    null
  );

  const {
    data: delivery,
    isLoading,
    error,
  } = useGetDeliveryQuery(parseInt(id!), { skip: !id });

  const [updateDelivery, { isLoading: isUpdating }] =
    useUpdateDeliveryMutation();
  const [deleteDelivery, { isLoading: isDeleting }] =
    useDeleteDeliveryMutation();

  const getStatusColor = (status?: string) => {
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

  const formatStatus = (status?: string) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editDelivery?.id) {
      try {
        const dataToSend: Partial<Delivery> = {
          delivery_status: editDelivery.delivery_status,
          delivery_cost: editDelivery.delivery_cost || null,
        };
        await updateDelivery({
          id: editDelivery.id,
          data: dataToSend,
        }).unwrap();
        setEditDelivery(null);
        toast.success("Delivery updated successfully!");
      } catch (err: any) {
        const errorMessage =
          err?.data?.detail || "Failed to update delivery. Please try again.";
        toast.error(errorMessage);
        console.error("Failed to update delivery:", err);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      try {
        await deleteDelivery(parseInt(id!)).unwrap();
        toast.success("Delivery deleted successfully!");
        navigate("/deliveries");
      } catch (err: any) {
        const errorMessage =
          err?.data?.error || "Failed to delete delivery. Please try again.";
        toast.error(errorMessage);
        console.error("Failed to delete delivery:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Loading delivery...</p>
        </div>
      </div>
    );
  }

  if (error || !delivery || !delivery.delivery_status) {
    const errorMessage =
      (error as any)?.data?.detail ||
      "Error loading delivery. Invalid or missing data.";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-rose-600 font-semibold">{errorMessage}</p>
          <p className="text-slate-500 mt-1">
            Return to{" "}
            <button
              onClick={() => navigate("/deliveries")}
              className="text-orange-500 hover:underline"
            >
              Deliveries
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Delivery {delivery.parcel_id}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditDelivery(delivery)}
              disabled={isUpdating}
              className={`px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? "Updating..." : "Edit"}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white/80 rounded-xl p-6 border border-white/60 shadow-sm">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-sm text-slate-700">
                <span className="font-medium">Parcel ID:</span>{" "}
                {delivery.parcel_id}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Customer Name:</span>{" "}
                {delivery.customer_name}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Phone:</span>{" "}
                {delivery.customer_phone}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Address:</span>{" "}
                {delivery.delivery_address}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">City:</span>{" "}
                {delivery.delivery_city}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Postal Code:</span>{" "}
                {delivery.delivery_postal_code || "N/A"}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Cost:</span>{" "}
                {delivery.delivery_cost
                  ? `${delivery.delivery_cost} Ksh`
                  : "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    delivery.delivery_status
                  )}`}
                >
                  {formatStatus(delivery.delivery_status)}
                </span>
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Created At:</span>{" "}
                {new Date(delivery.created_at).toLocaleString()}
              </p>
              {delivery.delivered_at && (
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Delivered At:</span>{" "}
                  {new Date(delivery.delivered_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editDelivery && (
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
                    value={editDelivery.delivery_cost ?? ""}
                    onChange={(e) =>
                      setEditDelivery({
                        ...editDelivery,
                        delivery_cost: e.target.value || null,
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
    </div>
  );
};

export default Delivery;
