import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkPendingOrders = async () => {
      try {
        const { data: myBusinesses } = await API.get(`/business/owner/${user.id}`);
        let total = 0;
        for (const biz of myBusinesses) {
          const { data: orders } = await API.get(`/order/business/${biz._id}`);
          total += orders.filter((o) => o.status === 'Pending').length;
        }
        setPendingCount(total);
      } catch (err) {
        // silently ignore
      }
    };

    checkPendingOrders();
    const interval = setInterval(checkPendingOrders, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 30px',
      background: '#fff',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--primary-dark)'
      }}>
        Cravio
      </Link>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/add-business" style={{ color: 'var(--text-dark)', fontWeight: 500, fontSize: '15px' }}>
          Add Business
        </Link>

        {user ? (
          <>
            <Link to="/my-orders" style={{ color: 'var(--text-dark)', fontWeight: 500, fontSize: '15px' }}>
              My Orders
            </Link>

            <Link to="/my-businesses" style={{ position: 'relative', color: 'var(--text-dark)', fontWeight: 500, fontSize: '15px' }}>
              My Shops
              {pendingCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-14px',
                  background: 'var(--primary)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  padding: '1px 6px'
                }}>
                  {pendingCount}
                </span>
              )}
            </Link>

            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Hi, {user.name.split(' ')[0]}</span>
            <button
              onClick={handleLogout}
              className="btn-press"
              style={{
                padding: '8px 18px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-dark)', fontWeight: 500, fontSize: '15px' }}>Login</Link>
            <Link to="/signup">
              <button className="btn-press" style={{
                padding: '8px 18px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;