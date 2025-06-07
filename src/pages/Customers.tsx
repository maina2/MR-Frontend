import React, { useState } from "react";
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "../api/apiSlice";
import type { Customer } from "../types/Customer";
import toast from "react-hot-toast";

const Customers: React.FC = () => {
  const {
    data: customers = [],
    isLoading: isQueryLoading,
    error: queryError,
    refetch,
  } = useGetCustomersQuery(undefined, {
    pollingInterval: 0, // Disable polling, rely on tag invalidation
    refetchOnMountOrArgChange: true, // Refetch when component mounts
  });

  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    phone: "",
    address: "",
    postal_code: "",
    city: "",
  });
  const [editCustomer, setEditCustomer] = useState<Partial<Customer> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdCustomer = await createCustomer(newCustomer).unwrap();
      setNewCustomer({
        name: "",
        phone: "",
        address: "",
        postal_code: "",
        city: "",
      });
      setIsModalOpen(false);
      toast.success("Customer created successfully!");
    } catch (err) {
      toast.error("Failed to create customer. Please try again.");
      console.error("Failed to create customer:", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCustomer?.id) {
      try {
        await updateCustomer({
          id: editCustomer.id,
          data: editCustomer,
        }).unwrap();
        setEditCustomer(null);
        toast.success("Customer updated successfully!");
      } catch (err) {
        toast.error("Failed to update customer. Please try again.");
        console.error("Failed to update customer:", err);
      }
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      window.confirm(`Are you sure you want to delete the customer ${name}?`)
    ) {
      // Optimistic update: remove customer from UI immediately
      const previousCustomers = customers;
      const updatedCustomers = customers.filter(
        (customer) => customer.id !== id
      );
      // Update local state optimistically
      // Note: RTK Query will handle the actual refetch due to invalidatesTags
      try {
        await deleteCustomer(id).unwrap();
        toast.success("Customer deleted successfully!");
      } catch (err) {
        // Rollback optimistic update if delete fails
        toast.error("Failed to delete customer. Please try again.");
        console.error("Failed to delete customer:", err);
      }
    }
  };

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
            onClick={() => setIsModalOpen(true)}
            disabled={isCreating}
            className={`px-6 py-2 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isCreating ? "Creating..." : "Create Customer"}
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
                key={customer.id}
                className="bg-white/15 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-gray-600 text-sm">
                      Name:{" "}
                      <span className="text-gray-800 font-medium">
                        {customer.name}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Phone:{" "}
                      <span className="text-gray-800 font-medium">
                        {customer.phone}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Address:{" "}
                      <span className="text-gray-800 font-medium">
                        {customer.address}, {customer.city},{" "}
                        {customer.postal_code}
                      </span>
                    </div>
                  </div>
                  <div className="space-x-3">
                    <button
                      onClick={() => setEditCustomer(customer)}
                      disabled={isUpdating || isDeleting}
                      className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 ${isUpdating || isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isUpdating && editCustomer?.id === customer.id
                        ? "Updating..."
                        : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id, customer.name)}
                      disabled={isDeleting}
                      className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
                {editCustomer?.id === customer.id && (
                  <form onSubmit={handleUpdate} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editCustomer.name || ""}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={editCustomer.phone || ""}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={editCustomer.address || ""}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={editCustomer.postal_code || ""}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            postal_code: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={editCustomer.city || ""}
                        onChange={(e) =>
                          setEditCustomer({
                            ...editCustomer,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className={`w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditCustomer(null)}
                        className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Customer Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white/15 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Customer
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name || ""}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newCustomer.phone || ""}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newCustomer.address || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={newCustomer.postal_code || ""}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        postal_code: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newCustomer.city || ""}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, city: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    required
                    disabled={isCreating}
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isCreating ? "Creating..." : "Create Customer"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
