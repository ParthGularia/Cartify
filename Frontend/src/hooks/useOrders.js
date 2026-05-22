import { useState, useEffect, useCallback } from 'react';
import { fetchOrders, createOrder, updateOrderStatus } from '../services/supabaseOrders';
import { useAuth } from '../context/AuthContext';

/**
 * useOrders hook provides:
 *  - currentOrders (active)
 *  - previousOrders (completed or cancelled)
 *  - placeOrder (creates order in DB)
 *  - cancelOrder (sets status to 'cancelled')
 */
export const useOrders = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [currentOrders, setCurrentOrders] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const all = await fetchOrders(userId);
      const active = all.filter(o => o.status === 'active');
      const previous = all.filter(o => o.status !== 'active');
      setCurrentOrders(active);
      setPreviousOrders(previous);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const placeOrder = async (orderDetails) => {
    if (!userId) throw new Error('User not authenticated');
    const order = await createOrder(userId, orderDetails);
    setCurrentOrders(prev => [...prev, order]);
    return order;
  };

  const cancelOrder = async (orderId) => {
    const updated = await updateOrderStatus(orderId, 'cancelled');
    // Move from current to previous
    setCurrentOrders(prev => prev.filter(o => o.id !== orderId));
    setPreviousOrders(prev => [...prev, updated]);
    return updated;
  };

  return { currentOrders, previousOrders, loading, error, refresh: loadOrders, placeOrder, cancelOrder };
};
