import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import HeroSlideshow from '../components/HeroSlideshow';
import FloatingParticles from '../components/FloatingParticles';
import TiltCard from '../components/TiltCard';
import ScrollReveal from '../components/ScrollReveal';
import Hero3D from '../components/Hero3D';

const categoryIcons = {
  restaurant: '🍽️',
  grocery: '🛒',
  salon: '💇',
  gym: '🏋️'
};

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter([latitude, longitude]);
        fetchBusinesses(latitude, longitude);
      },
      () => {
        fetchBusinesses(center[0], center[1]);
      }
    );
  }, [category]);

  const filteredBusinesses = businesses.filter((b) => {
    const text = search.toLowerCase();
    return b.name.toLowerCase().includes(text) || b.category.toLowerCase().includes(text);
  });

  return (
    <div>
      {/* Full-screen Hero Section */}
      <div style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        overflow: 'hidden'
      }}>
        <HeroSlideshow />
        <FloatingParticles />

        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1100px',
          padding: '0 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ flex: '1 1 400px', textAlign: 'left' }}>
            <h1 className="fade-in-up" style={{ fontSize: '64px', fontWeight: 800, marginBottom: '10px', letterSpacing: '-1px' }}>
              Cravio
            </h1>
            <p className="fade-in-up stagger-1" style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '30px', letterSpacing: '0.5px' }}>
              Crave More. Wait Less.
            </p>
            <div style={{ maxWidth: '480px' }}>
              <input
                type="text"
                placeholder="Search for restaurants, shops, groceries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.35)'
                }}
              />
            </div>
          </div>
          <div style={{ flex: '1 1 350px', height: '400px' }}>
            <Hero3D />
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          fontSize: '13px',
          color: 'rgba(255,255,255,0.8)'
        }}>
          ↓ Scroll to explore
        </div>
      </div>

      <div className="container" style={{ paddingTop: '30px' }}>
        {/* Category Pills */}
        <ScrollReveal>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {['', 'restaurant', 'grocery', 'salon', 'gym'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn-press ${category === cat ? 'glow-btn' : ''}`}
                style={{
                  padding: '8px 18px',
                  borderRadius: '20px',
                  border: category === cat ? 'none' : '1px solid var(--border-light)',
                  background: category === cat ? 'var(--primary)' : 'white',
                  color: category === cat ? 'white' : 'var(--text-dark)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  fontSize: '14px'
                }}
              >
                {cat === '' ? 'All' : `${categoryIcons[cat] || ''} ${cat}`}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Shop List */}
        <ScrollReveal delay={0.1}>
          <h2 style={{ marginBottom: '18px', fontSize: '22px' }}>
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'Result' : 'Results'} Near You
          </h2>
        </ScrollReveal>

        {filteredBusinesses.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No businesses found. Try a different search or category.</p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
          paddingBottom: '40px'
        }}>
          {filteredBusinesses.map((b, index) => (
            <Link key={b._id} to={`/business/${b._id}`} style={{ color: 'inherit' }}>
              <TiltCard className={`fade-in-up stagger-${(index % 6) + 1}`} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{
                  height: '130px',
                  background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '46px'
                }}>
                  {categoryIcons[b.category] || '🏪'}
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{ fontSize: '17px', marginBottom: '4px' }}>{b.name}</h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {b.category} &middot; {b.address}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    display: 'inline-block',
                    background: '#e8f5f3',
                    padding: '3px 10px',
                    borderRadius: '6px'
                  }}>
                    ⭐ {b.avgRating || 'New'}
                  </p>
                </div>
              </TiltCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;