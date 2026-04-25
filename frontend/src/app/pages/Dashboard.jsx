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
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const summaryData = await safeFetch(`${API_BASE}/dashboard/summary`, {
          headers: authHeaders(token)
        });
        const fieldsData = await safeFetch(`${API_BASE}/fields`, {
          headers: authHeaders(token)
        });
        setMetrics(summaryData);
        setFields(fieldsData);
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

    fetchData();
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
        <h3>Field Overview</h3>
        {loading ? (
          <p>Loading fields…</p>
        ) : fields.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="fields-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Crop Type</th>
                  <th>Stage</th>
                  <th>Status</th>
                  <th>Assigned Agent</th>
                  <th>Planted Date</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.id}>
                    <td style={{ fontWeight: '600' }}>{field.name}</td>
                    <td>{field.crop_type}</td>
                    <td>{field.current_stage}</td>
                    <td>
                      <span className={`status-badge ${field.status}`}>
                        {field.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{field.assigned_agent_name || 'Unassigned'}</td>
                    <td>{field.planting_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No fields found.</p>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}
