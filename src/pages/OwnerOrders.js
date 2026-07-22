import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

function OwnerOrders() {
  const { businessId } = useParams();
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    API.get(`/order/business/${businessId}`).then((res) => setOrders(res.data));
  };

  useEffect(() => {
    loadOrders();
  }, [businessId]);

  const updateStatus = async (orderId, newStatus) => {
    await API.put(`/order/${orderId}`, { status: newStatus });
    loadOrders();
  };

  const statusColor = (status) => {
    if (status === 'Pending') return '#f4a261';
    if (status === 'Confirmed') return '#457b9d';
    if (status === 'Delivered') return '#2a9d8f';
    return '#999';
  };

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '0 15px' }}>
      <Link to={`/business/${businessId}`}>Back to Business</Link>
      <h2>Orders Dashboard</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>{order.customerName}</b>
            <span style={{ background: statusColor(order.status), color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '13px' }}>
              {order.status}
            </span>
          </div>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
            {order.customerPhone} | {order.customerAddress}
          </p>
          <div style={{ margin: '10px 0' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>{item.name} x {item.qty}</span>
                <span>Rs. {item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '10px' }}>
            <span>Total</span>
            <span>Rs. {order.totalAmount}</span>
          </div>

          {order.status === 'Pending' && (
            <button onClick={() => updateStatus(order._id, 'Confirmed')} style={{ padding: '6px 12px', marginRight: '8px', cursor: 'pointer' }}>
              Confirm Order
            </button>
          )}
          {order.status === 'Confirmed' && (
            <button onClick={() => updateStatus(order._id, 'Delivered')} style={{ padding: '6px 12px', marginRight: '8px', cursor: 'pointer' }}>
              Mark Delivered
            </button>
          )}
          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <button onClick={() => updateStatus(order._id, 'Cancelled')} style={{ padding: '6px 12px', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default OwnerOrders;