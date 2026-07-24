import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import TiltCard from '../components/TiltCard';
import ScrollReveal from '../components/ScrollReveal';

function BusinessDetail() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  const loadData = () => {
    API.get(`/business/${id}`).then((res) => setBusiness(res.data));
    API.get(`/item/${id}`).then((res) => setItems(res.data));
    API.get(`/review/${id}`).then((res) => setReviews(res.data));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
  }, [id]);

  const addToCart = (item) => {
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      setCart(cart.map((c) => c._id === item._id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find((c) => c._id === itemId);
    if (existing.qty === 1) {
      setCart(cart.filter((c) => c._id !== itemId));
    } else {
      setCart(cart.map((c) => c._id === itemId ? { ...c, qty: c.qty - 1 } : c));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to write a review');
      return;
    }
    await API.post('/review', {
      businessId: id,
      userId: user.id,
      userName: user.name,
      rating: Number(reviewForm.rating),
      text: reviewForm.text
    });
    setReviewForm({ rating: 5, text: '' });
    loadData();
  };

  if (!business) return <p style={{ textAlign: 'center', marginTop: '60px' }}>Loading...</p>;

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, var(--secondary), #2b4c7e)',
        color: 'white',
        padding: '40px 20px'
      }}>
        <div className="container">
          <Link to="/" style={{ color: '#cfd8e6', fontSize: '14px' }}>Back to Home</Link>
          <h1 className="fade-in-up" style={{ fontSize: '30px', margin: '10px 0 6px' }}>{business.name}</h1>
          <p className="fade-in-up stagger-1" style={{ color: '#cfd8e6', margin: '2px 0', textTransform: 'capitalize' }}>
            {business.category} - {business.address}
          </p>
          <p className="fade-in-up stagger-2" style={{ margin: '10px 0 0' }}>
            <span style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 12px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              Rating: {business.avgRating || 'New'} / 5
            </span>
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
        <ScrollReveal>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            marginBottom: '30px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <p style={{ margin: '0 0 6px' }}>{business.description}</p>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}><b>Contact:</b> {business.contact}</p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '22px' }}>Menu</h2>
          {user && user.id === business.ownerId && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/add-item/${business._id}`}>
                <button className="btn-press" style={{ padding: '8px 16px', background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Add Item
                </button>
              </Link>
              <Link to={`/orders/${business._id}`}>
                <button className="btn-press" style={{ padding: '8px 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  View Orders
                </button>
              </Link>
            </div>
          )}
        </div>

        {items.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No items added yet.</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '18px', marginBottom: cart.length > 0 ? '90px' : '30px' }}>
          {items.map((item, index) => {
            const inCart = cart.find((c) => c._id === item._id);
            return (
              <TiltCard key={item._id} className={`fade-in-up stagger-${(index % 6) + 1}`} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)'
              }}>
                <img src={item.photo} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <div style={{ padding: '14px' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 8px' }}>{item.description}</p>
                  <p style={{ fontWeight: 700, margin: '0 0 12px', fontSize: '15px' }}>Rs. {item.price}</p>
                  {!inCart ? (
                    <button onClick={() => addToCart(item)} className="btn-press" style={{
                      width: '100%', padding: '9px', background: 'var(--primary)', color: 'white',
                      border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                    }}>
                      Add to Cart
                    </button>
                  ) : (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: '#fff2f1', borderRadius: '8px', padding: '4px'
                    }}>
                      <button onClick={() => removeFromCart(item._id)} className="btn-press" style={{ padding: '6px 14px', border: 'none', background: 'transparent', fontWeight: 700, cursor: 'pointer', color: 'var(--primary-dark)' }}>-</button>
                      <span style={{ fontWeight: 600 }}>{inCart.qty}</span>
                      <button onClick={() => addToCart(item)} className="btn-press" style={{ padding: '6px 14px', border: 'none', background: 'transparent', fontWeight: 700, cursor: 'pointer', color: 'var(--primary-dark)' }}>+</button>
                    </div>
                  )}
                </div>
              </TiltCard>
            );
          })}
        </div>

        <ScrollReveal>
          <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>Reviews</h2>
          <form onSubmit={submitReview} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)',
            padding: '18px', marginBottom: '20px', boxShadow: 'var(--shadow-card)'
          }}>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
              style={{ display: 'block', marginBottom: '10px', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
            >
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} Stars</option>)}
            </select>
            <textarea
              placeholder="Write your review..."
              value={reviewForm.text}
              onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
              style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }}
            />
            <button type="submit" className="btn-press" style={{ padding: '10px 20px', background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Submit Review
            </button>
          </form>
        </ScrollReveal>

        {reviews.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>}
        {reviews.map((r) => (
          <div key={r._id} style={{
            border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)',
            margin: '0 0 12px', padding: '14px', background: 'var(--bg-card)'
          }}>
            <b>{r.userName}</b> - Rating: {r.rating}
            <p style={{ margin: '6px 0 0', color: 'var(--text-muted)' }}>{r.text}</p>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--secondary)', color: 'white',
          padding: '16px 20px', boxShadow: '0 -4px 15px rgba(0,0,0,0.15)',
          zIndex: 999
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>{cart.length} items - Rs. {cartTotal}</span>
            <Link to={`/checkout/${id}`} state={{ cart, businessName: business.name }}>
              <button className="btn-press glow-btn" style={{
                padding: '10px 24px', background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '15px'
              }}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessDetail;