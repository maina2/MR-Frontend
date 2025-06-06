import React, { useState } from 'react';
import { useGetDeliveriesQuery, useCreateDeliveryMutation, useUpdateDeliveryMutation, useDeleteDeliveryMutation, useGetCustomersQuery } from '../api/apiSlice';
import type { Delivery, Customer } from '../types/Delivery';
import toast from 'react-hot-toast';

const Deliveries: React.FC = () => {
  const { 
    data: deliveries = [], 
    isLoading: isLoadingDeliveries, 
    error: errorDeliveries 
  } = useGetDeliveriesQuery(undefined, {
    pollingInterval: 0, // Disable polling, rely on tag invalidation
    refetchOnMountOrArgChange: true, // Refetch when component mounts
  });
  
  const { 
    data: customers = [], 
    isLoading: isLoadingCustomers, 
    error: errorCustomers 
  } = useGetCustomersQuery(undefined, {
    pollingInterval: 0,
    refetchOnMountOrArgChange: true,
  });
  
  const [createDelivery, { isLoading: isCreating }] = useCreateDeliveryMutation();
  const [updateDelivery, { isLoading: isUpdating }] = useUpdateDeliveryMutation();
  const [deleteDelivery, { isLoading: isDeleting }] = useDeleteDeliveryMutation();

  const [newDelivery, setNewDelivery] = useState<Partial<Delivery>>({
    customer: undefined, // Changed to undefined for better type safety
    delivery_address: '',
    delivery_postal_code: '',
    delivery_city: '',
    delivery_status: 'pending',
  });
  const [editDelivery, setEditDelivery] = useState<Partial<Delivery> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...newDelivery,
        customer: newDelivery.customer ? (newDelivery.customer as Customer).id : null,
      };
      await createDelivery(dataToSend).unwrap();
      setNewDelivery({
        customer: undefined,
        delivery_address: '',
        delivery_postal_code: '',
        delivery_city: '',
        delivery_status: 'pending',
      });
      setIsModalOpen(false);
      toast.success('Delivery created successfully!');
    } catch (err) {
      toast.error('Failed to create delivery. Please try again.');
      console.error('Failed to create delivery:', err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editDelivery?.id) {
      try {
        const dataToSend = {
          delivery_status: editDelivery.delivery_status,
        };
        await updateDelivery({ id: editDelivery.id, data: dataToSend }).unwrap();
        setEditDelivery(null);
        toast.success('Delivery updated successfully!');
      } catch (err) {
        toast.error('Failed to update delivery. Please try again.');
        console.error('Failed to update delivery:', err);
      }
    }
  };

  const handleDelete = async (id: number, customerName: string) => {
    if (window.confirm(`Are you sure you want to delete the delivery for ${customerName}?`)) {
      // Optimistic update: remove delivery from UI immediately
      const previousDeliveries = deliveries;
      const updatedDeliveries = deliveries.filter(delivery => delivery.id !== id);
      // Note: RTK Query will handle the actual refetch due to invalidatesTags
      try {
        await deleteDelivery(id).unwrap();
        toast.success('Delivery deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete delivery. Please try again.');
        console.error('Failed to delete delivery:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'in_transit':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  if (isLoadingDeliveries || isLoadingCustomers) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  if (errorDeliveries || errorCustomers) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading data</div>;

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Manage Deliveries</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isCreating}
            className={`px-6 py-2 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCreating ? 'Creating...' : 'Create Delivery'}
          </button>
        </div>

        {/* Delivery List */}
        <div className="grid gap-6">
          {deliveries.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">No deliveries found.</p>
          ) : (
            deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white/15 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-gray-600 text-sm">
                      Parcel ID: <span className="text-gray-800 font-medium">{delivery.parcel_id}</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Customer: <span className="text-gray-800 font-medium">{delivery.customer?.name || 'N/A'}</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Address:{' '}
                      <span className="text-gray-800 font-medium">
                        {delivery.delivery_address || delivery.customer?.address || 'N/A'},{' '}
                        {delivery.delivery_city || delivery.customer?.city || 'N/A'},{' '}
                        {delivery.delivery_postal_code || delivery.customer?.postal_code || 'N/A'}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm flex items-center gap-2">
                      Status:{' '}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.delivery_status)}`}>
                        {delivery.delivery_status.charAt(0).toUpperCase() + delivery.delivery_status.slice(1)}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Created: <span className="text-gray-800 font-medium">{delivery.created_at ? new Date(delivery.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    {delivery.delivered_at && (
                      <div className="text-gray-600 text-sm">
                        Delivered: <span className="text-gray-800 font-medium">{new Date(delivery.delivered_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-x-3">
                    <button
                      onClick={() => setEditDelivery(delivery)}
                      disabled={isUpdating || isDeleting}
                      className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 ${isUpdating || isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isUpdating && editDelivery?.id === delivery.id ? 'Updating...' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(delivery.id, delivery.customer?.name || 'Unknown')}
                      disabled={isDeleting}
                      className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
                {editDelivery?.id === delivery.id && (
                  <form onSubmit={handleUpdate} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                      <select
                        value={editDelivery.delivery_status || 'pending'}
                        onChange={(e) => setEditDelivery({ ...editDelivery, delivery_status: e.target.value as 'pending' | 'in_transit' | 'delivered' | 'cancelled' })}
                        className="w-full px-4 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                        disabled={isUpdating}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className={`w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditDelivery(null)}
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

      {/* Create Delivery Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white/15 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Delivery</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Customer</label>
                  <select
                    value={newDelivery.customer ? (newDelivery.customer as Customer).id : ''}
                    onChange={(e) => {
                      const selectedCustomer = customers.find(c => c.id === parseInt(e.target.value));
                      setNewDelivery({ ...newDelivery, customer: selectedCustomer || undefined });
                    }}
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    required
                    disabled={isCreating}
                  >
                    <option value="">Select a Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Delivery Address (Optional)</label>
                  <input
                    type="text"
                    value={newDelivery.delivery_address || ''}
                    onChange={(e) => setNewDelivery({ ...newDelivery, delivery_address: e.target.value })}
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    placeholder={newDelivery.customer ? (newDelivery.customer as Customer).address : 'Enter address'}
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Postal Code (Optional)</label>
                  <input
                    type="text"
                    value={newDelivery.delivery_postal_code || ''}
                    onChange={(e) => setNewDelivery({ ...newDelivery, delivery_postal_code: e.target.value })}
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    placeholder={newDelivery.customer ? (newDelivery.customer as Customer).postal_code : 'Enter postal code'}
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">City (Optional)</label>
                  <input
                    type="text"
                    value={newDelivery.delivery_city || ''}
                    onChange={(e) => setNewDelivery({ ...newDelivery, delivery_city: e.target.value })}
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    placeholder={newDelivery.customer ? (newDelivery.customer as Customer).city : 'Enter city'}
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={newDelivery.delivery_status || 'pending'}
                    onChange={(e) => setNewDelivery({ ...newDelivery, delivery_status: e.target.value as 'pending' | 'in_transit' | 'delivered' | 'cancelled' })}
                    className="w-full px-3 py-2 bg-white/15 text-gray-800 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    disabled={isCreating}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isCreating ? 'Creating...' : 'Create Delivery'}
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

export default Deliveries;