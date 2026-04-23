import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { API_BASE, authHeaders, safeFetch } from '../api';

export default function AgentDirectory() {
  const { token, logout } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await safeFetch(`${API_BASE}/agents`, {
          headers: authHeaders(token)
        });
        setAgents(data);
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

    fetchAgents();
  }, [token, logout]);

  return (
    <div className="page-grid">
      <div className="card agent-card">
        <div className="card-header">
          <div>
            <h2>Agent directory</h2>
            <p>Field agents assigned to active monitoring tasks.</p>
          </div>
        </div>

        {loading ? (
          <p>Loading agents…</p>
        ) : (
          <div className="agent-grid">
            {agents.map((agent) => (
              <div key={agent.id} className="agent-item">
                <h3>{agent.name}</h3>
                <p>{agent.email}</p>
                <span className={`agent-role ${agent.role.toLowerCase()}`}>{agent.role}</span>
              </div>
            ))}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}
