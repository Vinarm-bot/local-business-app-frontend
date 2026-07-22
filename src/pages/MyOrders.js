import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      API.get(`/order/user/${user.id}`).then((res) => setOrders(res.data));
    }
  }, []);

  const statusColor = (status) => {
    if (status === 'Pending') return '#f4a261';
    if (status === 'Confirmed') return '#457b9d';
    if (status === 'Delivered') return '#2a9d8f';
    return '#999';
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
        <p>Please login to view your orders.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '0 15px' }}>
      <h2>My Orders</h2>

      {orders.length === 0 && <p>You haven't placed any orders yet.</p>}

      {orders.map((order) => (
        <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>Order #{order._id.slice(-6).toUpperCase()}</b>
            <span style={{ background: statusColor(order.status), color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '13px' }}>
              {order.status}
            </span>
          </div>
          <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <div style={{ margin: '10px 0' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>{item.name} x {item.qty}</span>
                <span>Rs. {item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>Rs. {order.totalAmount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;