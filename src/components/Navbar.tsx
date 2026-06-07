import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  /* TESZTFUNKCIÓK: Szerepkörváltás gombnyomásra
  const setRoleToVisitor = () => {
    dispatch(logout());
    navigate('/');
  };

  const setRoleToUser = () => {
    dispatch(loginSuccess({
      token: "GSV6KvyKAm1FCoNXlnE0NjG2C9jJCNmIV6guPzE5dd88be42",
      user: { name: "Kovács Péter (Teszt User)", email: "peter@example.com", role: "user" }
    }));
    navigate('/');
  };

  const setRoleToAdmin = () => {
    dispatch(loginSuccess({
      token: "GSV6KvyKAm1FCoNXlnE0NjG2C9jJCNmIV6guPzE5dd88be42",
      user: { name: "Réka (Admin)", email: "admin@example.com", role: "ADMIN" }
    }));
    navigate('/');
  };*/

  // Stílusok
  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 30px',
    backgroundColor: '#1e293b',
    borderBottom: '2px solid #334155',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif'
  };

  const btnStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '8px 14px',
    margin: '0 4px',
    color: '#f1f5f9',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '13px',
    backgroundColor: '#334155',
    border: '1px solid #475569',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  /*const testBtnStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white'
  };*/

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '22px', fontWeight: '900', letterSpacing: '0.5px' }}>
          Roomlie
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to="/" style={btnStyle}>Terem oldal</Link>

        {!user ? (
          /* LÁTOGATÓ MENÜ */
          <>
            <Link to="/login" style={btnStyle}>Bejelentkezés</Link>
            <Link to="/register" style={{ ...btnStyle, backgroundColor: '#2563eb', borderColor: '#3b82f6' }}>Regisztráció</Link>
          </>
        ) : user.role === 'ADMIN' || user.role === 'admin' ? (
          /* ADMIN MENÜ */
          <>
            <Link to="/admin-bookings" style={{ ...btnStyle, backgroundColor: '#1e1b4b', borderColor: '#4338ca' }}>📋 Beérkezett foglalások</Link>
            <div style={{ marginLeft: '10px', paddingLeft: '10px', borderLeft: '2px solid #475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADMIN</span>
              <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '600' }}>{user.name}</span>
              <button onClick={handleLogout} style={{ ...btnStyle, backgroundColor: '#e11d48', borderColor: '#f43f5e', margin: 0 }}>Kijelentkezés</button>
            </div>
          </>
        ) : (
          /* FELHASZNÁLÓ MENÜ */
          <>
            <Link to="/my-bookings" style={{ ...btnStyle, backgroundColor: '#064e3b', borderColor: '#059669' }}>📅 Foglalásaim</Link>
            <div style={{ marginLeft: '10px', paddingLeft: '10px', borderLeft: '2px solid #475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '600' }}>{user.name}</span>
              <button onClick={handleLogout} style={{ ...btnStyle, backgroundColor: '#e11d48', borderColor: '#f43f5e', margin: 0 }}>Kijelentkezés</button>
            </div>
          </>
        )}
      </div>

      {/* 3. JOBB OLDAL: Gyors tesztpanel 
      <div style={{ display: 'flex', gap: '6px', backgroundColor: '#0f172a', padding: '6px', borderRadius: '6px', border: '1px solid #334155' }}>
        <span style={{ padding: '4px 8px', color: '#94a3b8', fontSize: '10px', alignSelf: 'center', fontWeight: 'bold' }}>TESZT ROLE:</span>
        <button onClick={setRoleToVisitor} style={{ ...testBtnStyle, backgroundColor: '#64748b' }}>Látogató</button>
        <button onClick={setRoleToUser} style={{ ...testBtnStyle, backgroundColor: '#16a34a' }}>User</button>
        <button onClick={setRoleToAdmin} style={{ ...testBtnStyle, backgroundColor: '#dc2626' }}>Admin</button>
      </div>*/}
    </nav>
  );
}