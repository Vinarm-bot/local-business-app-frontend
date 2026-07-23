import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function AddBusiness() {
  const [form, setForm] = useState({
    name: '', category: '', description: '', address: '', contact: '', lat: '', lng: ''
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login first to add a business');
      return;
    }
    try {
      await API.post('/business', {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        ownerId: user.id
      });
      alert('Business added successfully!');
      navigate('/');
    } catch (err) {
      alert('Failed to add business');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', paddingTop: '30px', paddingBottom: '60px' }}>
      <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>&larr; Back to Home</Link>
      <h2 style={{ fontSize: '26px', margin: '10px 0 5px' }}>List Your Business</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
        Reach customers in your area by adding your shop
      </p>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)', padding: '25px', boxShadow: 'var(--shadow-card)'
      }}>
        <form onSubmit={handleSubmit}>
          <input placeholder="Business Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
          <select onChange={(e) => setForm({ ...form, category: e.target.value })} required style={inputStyle}>
            <option value="">Select Category</option>
            <option value="restaurant">Restaurant</option>
            <option value="grocery">Grocery</option>
            <option value="salon">Salon</option>
            <option value="gym">Gym</option>
          </select>
          <input placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
          <input placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} required style={inputStyle} />
          <input placeholder="Contact Number" onChange={(e) => setForm({ ...form, contact: e.target.value })} required style={inputStyle} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Latitude" onChange={(e) => setForm({ ...form, lat: e.target.value })} required style={{ ...inputStyle, flex: 1 }} />
            <input placeholder="Longitude" onChange={(e) => setForm({ ...form, lng: e.target.value })} required style={{ ...inputStyle, flex: 1 }} />
          </div>
          <button type="submit" style={{
            width: '100%', padding: '13px', background: 'var(--primary)', color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginTop: '5px'
          }}>
            Add Business
          </button>
        </form>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '15px' }}>
          Tip: Get coordinates by searching your address on Google Maps, right-clicking the exact spot, and copying the numbers shown.
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  display: 'block', width: '100%', marginBottom: '14px', padding: '12px 14px',
  borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '14px', fontFamily: 'var(--font-body)'
};

export default AddBusiness;