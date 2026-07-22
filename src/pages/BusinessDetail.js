import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

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

  if (!business) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 15px' }}>
      <Link to="/">Back to Map</Link>

      <div style={{ marginTop: '15px', marginBottom: '25px' }}>
        <h1 style={{ marginBottom: '5px' }}>{business.name}</h1>
        <p style={{ color: '#666', margin: '2px 0' }}>{business.category} &middot; {business.address}</p>
        <p style={{ margin: '2px 0' }}><b>Rating:</b> {business.avgRating || 'No ratings yet'} / 5</p>
        <p style={{ margin: '2px 0' }}>{business.description}</p>
        <p style={{ margin: '2px 0' }}><b>Contact:</b> {business.contact}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Menu</h2>
        {user && user.id === business.ownerId && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to={`/add-item/${business._id}`}>
              <button style={{ padding: '8px 15px', background: '#457b9d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                + Add Item
              </button>
            </Link>
            <Link to={`/orders/${business._id}`}>
              <button style={{ padding: '8px 15px', background: '#e76f51', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                View Orders
              </button>
            </Link>
          </div>
        )}
      </div>

      {items.length === 0 && <p>No items added yet.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px' }}>
        {items.map((item) => {
          const inCart = cart.find((c) => c._id === item._id);
          return (
            <div key={item._id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <img src={item.photo} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: '0 0 8px 0' }}>{item.description}</p>
                <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>Rs. {item.price}</p>
                {!inCart ? (
                  <button onClick={() => addToCart(item)} style={{ width: '100%', padding: '8px', background: '#e63946', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Add to Cart
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button onClick={() => removeFromCart(item._id)} style={{ padding: '5px 12px', cursor: 'pointer' }}>-</button>
                    <span>{inCart.qty}</span>
                    <button onClick={() => addToCart(item)} style={{ padding: '5px 12px', cursor: 'pointer' }}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div style={{ position: 'sticky', bottom: '0', background: 'white', border: '1px solid #ddd', borderRadius: '10px', padding: '15px', marginTop: '20px', boxShadow: '0 -2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Your Cart ({cart.length} items) — Rs. {cartTotal}</h3>
          <Link to={`/checkout/${id}`} state={{ cart, businessName: business.name }}>
            <button style={{ width: '100%', padding: '12px', background: '#2a9d8f', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}

      <h2 style={{ marginTop: '30px' }}>Reviews</h2>
      <form onSubmit={submitReview} style={{ marginBottom: '20px' }}>
        <select
          value={reviewForm.rating}
          onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
          style={{ display: 'block', marginBottom: '10px', padding: '5px' }}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} Stars</option>
          ))}
        </select>
        <textarea
          placeholder="Write your review..."
          value={reviewForm.text}
          onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Submit Review</button>
      </form>

      {reviews.length === 0 && <p>No reviews yet. Be the first!</p>}
      {reviews.map((r) => (
        <div key={r._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
          <b>{r.userName}</b> &mdash; {r.rating} Stars
          <p>{r.text}</p>
        </div>
      ))}
    </div>
  );
}

export default BusinessDetail;