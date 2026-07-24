import { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../api';

const RAZORPAY_KEY_ID = 'rzp_test_TGaPf7hJzxk6c6';

function Checkout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const cart = location.state?.cart || [];
  const businessName = location.state?.businessName || '';

  const [form, setForm] = useState({ address: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const saveOrder = async (paymentStatus, paymentId) => {
    await API.post('/order', {
      businessId: id,
      userId: user.id,
      customerName: user.name,
      customerPhone: form.phone,
      customerAddress: form.address,
      items: cart.map((item) => ({ itemId: item._id, name: item.name, price: item.price, qty: item.qty })),
      totalAmount: total,
      paymentMethod: paymentStatus,
      paymentId: paymentId || null
    });

    try {
      const sound = new Audio('/order-sound.mp3');
      sound.play();
    } catch (err) {
      // ignore if sound fails to play
    }

    alert('Order placed successfully!');
    navigate('/my-orders');
  };

  const handleOnlinePayment = async () => {
    try {
      const { data: order } = await API.post('/payment/create-order', { amount: total });

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Cravio',
        description: `Order from ${businessName}`,
        order_id: order.id,
        handler: async function (response) {
          await saveOrder('Paid Online', response.razorpay_payment_id);
        },
        prefill: {
          name: user.name,
          contact: form.phone
        },
        theme: { color: '#FF4B3E' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Failed to start payment. Please try again.');
    }
  };

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

    if (paymentMethod === 'online') {
      handleOnlinePayment();
    } else {
      saveOrder('Cash on Delivery', null);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '500px', margin: '80px auto', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Your cart is empty.</p>
        <Link to="/" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Go back to browse businesses</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '560px', paddingTop: '30px', paddingBottom: '60px' }}>
      <Link to={`/business/${id}`} style={{ color: 'var(--text-muted)', fontSize: '14px' }}>&larr; Back to Menu</Link>
      <h2 style={{ fontSize: '26px', margin: '10px 0 20px' }}>Checkout &mdash; {businessName}</h2>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '20px', boxShadow: 'var(--shadow-card)'
      }}>
        <h3 style={{ fontSize: '15px', marginBottom: '12px', color: 'var(--text-muted)' }}>ORDER SUMMARY</h3>
        {cart.map((item) => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
            <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>x{item.qty}</span></span>
            <span style={{ fontWeight: 600 }}>Rs. {item.price * item.qty}</span>
          </div>
        ))}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '14px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '17px' }}>
          <span>Total</span>
          <span>Rs. {total}</span>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '20px', boxShadow: 'var(--shadow-card)'
      }}>
        <h3 style={{ fontSize: '15px', marginBottom: '15px', color: 'var(--text-muted)' }}>DELIVERY DETAILS</h3>
        <form onSubmit={placeOrder}>
          <input
            placeholder="Delivery Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            style={inputStyle}
          />

          <h3 style={{ fontSize: '15px', margin: '18px 0 12px', color: 'var(--text-muted)' }}>PAYMENT METHOD</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
            <label style={{
              flex: 1, border: paymentMethod === 'cod' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
              borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'center'
            }}>
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ marginRight: '6px' }} />
              Cash on Delivery
            </label>
            <label style={{
              flex: 1, border: paymentMethod === 'online' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
              borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'center'
            }}>
              <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} style={{ marginRight: '6px' }} />
              Pay Online
            </label>
          </div>

          <button type="submit" className="btn-press" style={{
            width: '100%', padding: '14px', background: 'var(--accent)', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer'
          }}>
            {paymentMethod === 'online' ? `Pay Rs. ${total} Now` : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  display: 'block', width: '100%', marginBottom: '14px', padding: '12px 14px',
  borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '14px', fontFamily: 'var(--font-body)'
};

export default Checkout;