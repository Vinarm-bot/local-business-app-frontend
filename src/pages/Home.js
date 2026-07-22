import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import API from '../api';
import 'leaflet/dist/leaflet.css';

function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [center, setCenter] = useState([27.1767, 78.0081]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const fetchBusinesses = (lat, lng) => {
    API.get(`/business/nearby?lat=${lat}&lng=${lng}&distance=500000&category=${category}`)
      .then(res => setBusinesses(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter([latitude, longitude]);
        fetchBusinesses(latitude, longitude);
      },
      (err) => {
        fetchBusinesses(center[0], center[1]);
      }
    );
  }, [category]);

  // Filter businesses by search text (matches name or category)
  const filteredBusinesses = businesses.filter((b) => {
    const text = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(text) ||
      b.category.toLowerCase().includes(text)
    );
  });

  return (
    <div>
      {/* Search + Filter Bar */}
      <div style={{ padding: '15px', background: '#f1faee' }}>
        <input
          type="text"
          placeholder="Search for restaurants, shops, groceries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '10px 15px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '15px',
            display: 'block',
            marginBottom: '10px'
          }}
        />
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['', 'restaurant', 'grocery', 'salon', 'gym'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: category === cat ? '2px solid #e63946' : '1px solid #ccc',
                background: category === cat ? '#e63946' : 'white',
                color: category === cat ? 'white' : '#333',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {cat === '' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <MapContainer center={center} zoom={13} style={{ height: '350px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredBusinesses.map((b) => (
          <Marker key={b._id} position={[b.location.coordinates[1], b.location.coordinates[0]]}>
            <Popup>
              <b>{b.name}</b><br />
              Rating: {b.avgRating || 'No ratings yet'}<br />
              <Link to={`/business/${b._id}`}>View Details</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Shop List (Cards) */}
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'Result' : 'Results'} Near You
        </h2>

        {filteredBusinesses.length === 0 && (
          <p style={{ color: '#666' }}>No businesses found. Try a different search or category.</p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '18px'
        }}>
          {filteredBusinesses.map((b) => (
            <Link
              key={b._id}
              to={`/business/${b._id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                border: '1px solid #eee',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                transition: 'transform 0.15s',
                cursor: 'pointer'
              }}>
                <div style={{
                  height: '120px',
                  background: '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px'
                }}>
                  {b.category === 'restaurant' && '🍽️'}
                  {b.category === 'grocery' && '🛒'}
                  {b.category === 'salon' && '💇'}
                  {b.category === 'gym' && '🏋️'}
                  {!['restaurant', 'grocery', 'salon', 'gym'].includes(b.category) && '🏪'}
                </div>
                <div style={{ padding: '12px' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '17px' }}>{b.name}</h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666', textTransform: 'capitalize' }}>
                    {b.category}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>
                    {b.address}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#2a9d8f' }}>
                    ⭐ {b.avgRating || 'New'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;