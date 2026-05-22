import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useOrders } from '../hooks/useOrders';


const ProfileModal = ({ onClose }) => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, error: profileError, saveProfile } = useProfile();
  const { role } = useAuth();
  const { currentOrders, previousOrders, loading: ordersLoading, cancelOrder } = useOrders();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ address: '', contact: '' });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  // Sync form with fetched profile
  useEffect(() => {
    if (profile) {
      setForm({ address: profile?.address || '', contact: profile?.contact || '' });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await saveProfile(form);
    setEditMode(false);
  };

  const handleCancelOrder = async (orderId) => {
    await cancelOrder(orderId);
    showToast('Order canceled successfully');
    // Force a page refresh to reload the current view
    window.location.reload();
  };

  return (
    <>
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[60] bg-black text-white px-4 py-2 rounded shadow-lg transition-opacity">
          {toastMessage}
        </div>
      )}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4 z-10">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>✕</button>
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          {profileLoading ? (
            <p className="text-gray-500">Loading profile…</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
                <input id="address" name="address" type="text" value={form.address} onChange={handleChange}
                  className="w-full border rounded px-2 py-1" disabled={!editMode} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="contact">Contact</label>
                <input id="contact" name="contact" type="text" value={form.contact} onChange={handleChange}
                  className="w-full border rounded px-2 py-1" disabled={!editMode} required />
              </div>
              {profileError && <p className="text-red-600 text-sm">{profileError}</p>}
              <div className="flex space-x-2">
                {editMode ? (
                  <>
                    <button type="submit" className="flex-1 py-1 bg-black text-white rounded hover:bg-gray-800">Save</button>
                    <button type="button" className="flex-1 py-1 bg-gray-200 text-gray-800 rounded"
                      onClick={() => setEditMode(false)}>Cancel</button>
                  </>
                ) : (
                  <button type="button" className="w-full py-1 bg-black text-white rounded hover:bg-gray-800"
                    onClick={() => setEditMode(true)}>Edit Profile</button>
                )}
              </div>
            </form>
          )}

          {/* Render orders only if role is not seller */}
          {role !== 'seller' && (
            <div className="mt-6 border-t pt-4 max-h-[40vh] overflow-y-auto pr-2">
              <h3 className="text-lg font-medium mb-3">Your Orders</h3>
              {ordersLoading ? (
                <p className="text-gray-500 text-sm">Loading orders...</p>
              ) : (
                <>
                  {/* Current Orders */}
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Current</h4>
                    {currentOrders.length === 0 ? (
                      <p className="text-sm text-gray-500">No active orders.</p>
                    ) : (
                      <ul className="space-y-3">
                        {currentOrders.map(o => (
                          <li key={o.id} className="text-sm border p-3 rounded bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="font-medium text-gray-800">{o.product_name}</p>
                              <p className="text-gray-500">Qty: {o.quantity} | Total: ${o.total_price}</p>
                              <p className="text-xs text-blue-600 mt-1 uppercase tracking-wide">{o.status}</p>
                            </div>
                            <button
                              onClick={() => handleCancelOrder(o.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium transition-colors"
                            >
                              Cancel Order
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Previous Orders */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Previous</h4>
                    {previousOrders.length === 0 ? (
                      <p className="text-sm text-gray-500">No previous orders.</p>
                    ) : (
                      <ul className="space-y-3">
                        {previousOrders.map(o => (
                          <li key={o.id} className="text-sm border p-3 rounded bg-gray-50">
                            <p className="font-medium text-gray-800">{o.product_name}</p>
                            <p className="text-gray-500">Qty: {o.quantity} | Total: ${o.total_price}</p>
                            <p className={`text-xs mt-1 uppercase tracking-wide ${o.status === 'cancelled' ? 'text-red-500' : 'text-green-600'}`}>
                              {o.status}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
