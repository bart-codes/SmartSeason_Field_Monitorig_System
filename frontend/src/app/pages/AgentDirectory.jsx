import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { API_BASE, authHeaders, safeFetch } from '../api';

export default function AgentDirectory() {
  const { user, token, logout } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [formBusy, setFormBusy] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchAgents();
  }, [token]);

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

  const handleOpenAddForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setFormError('');
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleOpenEditForm = (agent) => {
    setFormData({ name: agent.name, email: agent.email, password: '' });
    setFormError('');
    setEditingId(agent.id);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', password: '' });
    setFormError('');
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormBusy(true);

    try {
      if (editingId) {
        // Update agent
        const updateData = { name: formData.name, email: formData.email };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await safeFetch(`${API_BASE}/agents/${editingId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            ...authHeaders(token)
          },
          body: JSON.stringify(updateData)
        });
      } else {
        // Add new agent
        await safeFetch(`${API_BASE}/agents`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...authHeaders(token)
          },
          body: JSON.stringify(formData)
        });
      }
      handleCloseForm();
      fetchAgents();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormBusy(false);
    }
  };

  const handleDeleteAgent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      await safeFetch(`${API_BASE}/agents/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token)
      });
      fetchAgents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-grid">
      <div className="card agent-card">
        <div className="card-header">
          <div>
            <h2>Agent directory</h2>
            <p>Field agents assigned to active monitoring tasks.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={handleOpenAddForm}
              style={{ 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                cursor: 'pointer', 
                borderRadius: '4px' 
              }}
            >
              + Add Agent
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading agents…</p>
        ) : (
          <div className="agent-grid">
            {agents.map((agent) => (
              <div key={agent.id} className="agent-item" style={{ position: 'relative' }}>
                {isAdmin && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleOpenEditForm(agent)}
                      style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent.id)}
                      style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        borderRadius: '3px',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
                <h3>{agent.name}</h3>
                <p>{agent.email}</p>
                <span className={`agent-role ${agent.role.toLowerCase()}`}>{agent.role}</span>
              </div>
            ))}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Add/Edit Agent Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px' }}>
            <h2>{editingId ? 'Edit Agent' : 'Add New Agent'}</h2>
            <form onSubmit={handleSubmitForm}>
              <label>
                Name
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </label>
              <label>
                Password {editingId && <span style={{ color: '#999', fontSize: '12px' }}>(leave empty to keep current)</span>}
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingId}
                />
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  type="submit"
                  disabled={formBusy}
                  style={{
                    flex: 1,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  {formBusy ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  style={{
                    flex: 1,
                    backgroundColor: '#999',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  Cancel
                </button>
              </div>
              {formError && <div className="error-message" style={{ marginTop: '12px' }}>{formError}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
