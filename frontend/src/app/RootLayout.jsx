import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RootLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>SmartSeason</h1>
          <p>Field Management</p>
        </div>

        <nav className="nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Dashboard</NavLink>
          <NavLink to="/fields" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Fields</NavLink>
          <NavLink to="/agents" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Agents</NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="profile-summary">
            <span className="profile-avatar">{user?.name?.[0] || 'A'}</span>
            <div>
              <p className="profile-name">{user?.name}</p>
              <p className="profile-role">{user?.role}</p>
            </div>
          </div>
          <button className="secondary-button" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="tag">Live</span>
            <h2>Field monitoring dashboard</h2>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
