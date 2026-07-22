import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{ maxWidth: '400px', margin: '30px auto' }}>
      <h2>Add Your Business</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Business Name" onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Category (restaurant/salon/gym)" onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Contact" onChange={(e) => setForm({ ...form, contact: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Latitude (e.g. 27.1767)" onChange={(e) => setForm({ ...form, lat: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Longitude (e.g. 78.0081)" onChange={(e) => setForm({ ...form, lng: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <button type="submit" style={{ padding: '10px 20px' }}>Add Business</button>
      </form>
    </div>
  );
}

export default AddBusiness;