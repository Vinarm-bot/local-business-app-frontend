import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';

function AddItem() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', photo: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/item', {
        businessId,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        photo: form.photo
      });
      alert('Item added successfully!');
      navigate(`/business/${businessId}`);
    } catch (err) {
      alert('Failed to add item');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', padding: '0 15px' }}>
      <Link to={`/business/${businessId}`}>Back to Business</Link>
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Item Name (e.g. Masala Chai)"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          placeholder="Price (e.g. 20)"
          type="number"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          placeholder="Photo URL (paste an image link)"
          onChange={(e) => setForm({ ...form, photo: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', width: '100%', background: '#e63946', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Add Item
        </button>
      </form>
      <p style={{ fontSize: '13px', color: '#666', marginTop: '15px' }}>
        Tip: You can get free image links from unsplash.com — search a food item, right-click the image, "Copy image address."
      </p>
    </div>
  );
}

export default AddItem;