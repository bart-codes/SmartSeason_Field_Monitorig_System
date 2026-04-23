import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-grid notfound-grid">
      <div className="card notfound-card">
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="primary-button">Back to dashboard</Link>
      </div>
    </div>
  );
}
