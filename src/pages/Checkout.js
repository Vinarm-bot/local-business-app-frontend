import { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Checkout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const cart = location.state?.cart || [];
  const businessName = location.state?.businessName || '';

  const [form, setForm] = useState({ address: '', phone: '' });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      await API.post('/order', {
        businessId: id,
        userId: user.id,
        customerName: user.name,
        customerPhone: form.phone,
        customerAddress: form.address,
        items: cart.map((item) => ({
          itemId: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty
        })),
        totalAmount: total
      });
      alert('Order placed successfully!');
      navigate('/');
    } catch (err) {
      alert('Failed to place order');
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
        <p>Your cart is empty.</p>
        <Link to="/">Go back to browse businesses</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '0 15px' }}>
      <Link to={`/business/${id}`}>Back to Menu</Link>
      <h2>Checkout - {businessName}</h2>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
        {cart.map((item) => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>{item.name} x {item.qty}</span>
            <span>Rs. {item.price * item.qty}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>Total</span>
          <span>Rs. {total}</span>
        </div>
      </div>

      <form onSubmit={placeOrder}>
        <h3>Delivery Details</h3>
        <input
          placeholder="Delivery Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#2a9d8f', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
          Place Order (Cash on Delivery)
        </button>
      </form>
    </div>
  );
}

export default Checkout;