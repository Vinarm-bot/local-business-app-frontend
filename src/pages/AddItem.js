import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';

const CLOUDINARY_CLOUD_NAME = 'boulh2el';
const CLOUDINARY_UPLOAD_PRESET = 'localbiz_uploads';

function AddItem() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async () => {
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select a photo for the item');
      return;
    }
    try {
      setUploading(true);
      const photoUrl = await uploadToCloudinary();
      await API.post('/item', {
        businessId,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        photo: photoUrl
      });
      setUploading(false);
      alert('Item added successfully!');
      navigate(`/business/${businessId}`);
    } catch (err) {
      setUploading(false);
      alert('Failed to add item');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', paddingTop: '30px', paddingBottom: '60px' }}>
      <Link to={`/business/${businessId}`} style={{ color: 'var(--text-muted)', fontSize: '14px' }}>&larr; Back to Business</Link>
      <h2 style={{ fontSize: '24px', margin: '10px 0 20px' }}>Add Menu Item</h2>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)', padding: '25px', boxShadow: 'var(--shadow-card)'
      }}>
        <form onSubmit={handleSubmit}>
          <input placeholder="Item Name (e.g. Masala Chai)" onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
          <input placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
          <input placeholder="Price (e.g. 20)" type="number" onChange={(e) => setForm({ ...form, price: e.target.value })} required style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
            ITEM PHOTO
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ ...inputStyle, padding: '10px' }}
          />

          {preview && (
            <img src={preview} alt="Preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '14px' }} />
          )}

          <button type="submit" disabled={uploading} style={{
            width: '100%', padding: '13px', background: uploading ? '#aaa' : 'var(--secondary)', color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '15px',
            cursor: uploading ? 'not-allowed' : 'pointer', marginTop: '5px'
          }}>
            {uploading ? 'Uploading photo...' : 'Add Item'}
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

export default AddItem;