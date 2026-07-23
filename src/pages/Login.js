import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
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
        <h2 style={{ fontSize: '24px', marginBottom: '6px', textAlign: 'center' }}>Welcome back</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginBottom: '25px' }}>
          Login to order from your favorite local shops
        </p>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>Sign up</Link>
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

export default Login;