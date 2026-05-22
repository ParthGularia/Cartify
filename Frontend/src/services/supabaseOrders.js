import { supabase } from './supabaseClient';

/** PROFILE **/
export const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
        .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // ignore not found
  return data;
};

export const upsertProfile = async (userId, profile) => {
  const { data, error } = await supabase
    .from('profiles')
        .upsert({ user_id: userId, ...profile }, { onConflict: 'user_id' })
    .single();
  if (error) throw error;
  return data;
};

/** ORDERS **/
export const fetchOrders = async (userId, status = null) => {
  let query = supabase.from('orders').select('*').eq('user_id', userId);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createOrder = async (userId, order) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: userId,
        product_id: order.product_id || null,
        product_name: order.product_name,
        quantity: order.quantity,
        total_price: order.total_price,
        image_url: order.image_url || null,
        status: 'active',
      },
    ])
    .single();
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .single();
  if (error) throw error;
  return data;
};
