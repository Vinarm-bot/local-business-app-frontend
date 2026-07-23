import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', form);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: '40px 35px',
        width: '100%',
        maxWidth: '380px'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '6px', textAlign: 'center' }}>Create an account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginBottom: '25px' }}>
          Join to order or list your own business
        </p>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginBottom: '14px',
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid var(--border-light)',
  fontSize: '14px',
  fontFamily: 'var(--font-body)'
};

const buttonStyle = {
  width: '100%',
  padding: '13px',
  background: 'var(--primary)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '15px',
  cursor: 'pointer',
  marginTop: '5px'
};

export default Signup;