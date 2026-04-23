import { NavLink, Outlet } from 'react-router-dom';

export default function RootLayout() {
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
