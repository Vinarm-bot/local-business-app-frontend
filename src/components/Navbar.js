import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

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
      padding: '15px 25px',
      background: '#1d3557',
      color: 'white'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
        LocalBiz
      </Link>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/add-business" style={{ color: 'white', textDecoration: 'none' }}>
          Add Business
        </Link>

        {user ? (
          <>
            <Link to="/my-orders" style={{ color: 'white', textDecoration: 'none' }}>
              My Orders
            </Link>
            <span style={{ fontSize: '14px' }}>Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 14px',
                background: '#e63946',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;