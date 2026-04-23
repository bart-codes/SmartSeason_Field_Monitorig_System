import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { API_BASE, authHeaders, safeFetch } from '../api';

function statLabel(count, label) {
  return (
    <div className="metric-card">
      <h4>{count}</h4>
      <p>{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [metrics, setMetrics] = useState({ total: 0, active: 0, atRisk: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const data = await safeFetch(`${API_BASE}/dashboard/summary`, {
          headers: authHeaders(token)
        });
        setMetrics(data);
      } catch (err) {
        if (err.status === 401) {
          logout();
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token, logout]);

  return (
    <div className="page-grid">
      <div className="card summary-card">
        <h2>Operations Overview</h2>
        <p>Track field progression, agent workload, and crop status from one place.</p>
        {loading ? (
          <p>Loading summary…</p>
        ) : (
          <div className="metrics-row">
            {statLabel(metrics.total, 'Total fields')}
            {statLabel(metrics.active, 'Active fields')}
            {statLabel(metrics.atRisk, 'At risk')}
            {statLabel(metrics.completed, 'Completed')}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="card insights-card">
        <h3>Quick insights</h3>
        <ul>
          <li>Field growth is ahead of schedule in most plots.</li>
          <li>Agent coverage is complete across assigned fields.</li>
          <li>Focus on at-risk fields to reduce harvest delays.</li>
        </ul>
      </div>
    </div>
  );
}
