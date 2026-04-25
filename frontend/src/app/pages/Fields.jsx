import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import FieldsTable from '../components/FieldsTable';
import FieldDetailModal from '../components/FieldDetailModal';
import { API_BASE, authHeaders, safeFetch } from '../api';

export default function Fields() {
  const { user, token, logout } = useAuth();
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    crop_type: '',
    planting_date: '',
    current_stage: 'PLANTED',
    assigned_agent_id: ''
  });
  const [agents, setAgents] = useState([]);
  const [formError, setFormError] = useState('');
  const [formBusy, setFormBusy] = useState(false);

  const loadFields = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await safeFetch(`${API_BASE}/fields`, {
        headers: authHeaders(token)
      });
      setFields(data);
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

  const loadNotes = async (fieldId) => {
    try {
      const data = await safeFetch(`${API_BASE}/fields/${fieldId}/notes`, {
        headers: authHeaders(token)
      });
      setNotes(data);
    } catch (err) {
      setNotes([]);
    }
  };

  useEffect(() => {
    loadFields();
  }, [token]);

  const handleOpenAddForm = async () => {
    try {
      const agentsData = await safeFetch(`${API_BASE}/agents`, {
        headers: authHeaders(token)
      });
      setAgents(agentsData);
    } catch (err) {
      console.error('Failed to load agents:', err);
    }
    setFormData({
      name: '',
      crop_type: '',
      planting_date: '',
      current_stage: 'PLANTED',
      assigned_agent_id: ''
    });
    setFormError('');
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setFormData({
      name: '',
      crop_type: '',
      planting_date: '',
      current_stage: 'PLANTED',
      assigned_agent_id: ''
    });
    setFormError('');
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.crop_type || !formData.planting_date) {
      setFormError('Please fill in all required fields');
      return;
    }

    setFormBusy(true);
    setFormError('');

    try {
      await safeFetch(`${API_BASE}/fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(token)
        },
        body: JSON.stringify({
          name: formData.name,
          crop_type: formData.crop_type,
          planting_date: formData.planting_date,
          current_stage: formData.current_stage,
          assigned_agent_id: formData.assigned_agent_id || null
        })
      });
      handleCloseForm();
      loadFields();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormBusy(false);
    }
  };

  const handleSelectField = (field) => {
    setSelectedField(field);
    loadNotes(field.id);
  };

  const handleFieldUpdated = async () => {
    await loadFields();
    // Refresh the modal with updated data
    if (selectedField) {
      try {
        const updated = await safeFetch(`${API_BASE}/fields/${selectedField.id}`, {
          headers: authHeaders(token)
        });
        setSelectedField(updated);
      } catch (err) {
        console.error('Failed to refresh field:', err);
      }
    }
  };

  return (
    <div className="page-grid">
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Field Management</h2>
            <p>Review field status and drill into individual plots for details.</p>
          </div>
          <button className="primary-button" onClick={handleOpenAddForm}>Add new field</button>
        </div>

        {loading ? (
          <p>Loading fields…</p>
        ) : (
          <FieldsTable fields={fields} onSelect={handleSelectField} />
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      <FieldDetailModal field={selectedField} notes={notes} onClose={() => setSelectedField(null)} onNoteAdded={() => selectedField && loadNotes(selectedField.id)} onFieldUpdated={handleFieldUpdated} />

      {/* Add Field Modal */}
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
          <div className="card" style={{ width: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>Add New Field</h2>
            <form onSubmit={handleSubmitForm}>
              <label>
                Field Name *
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Crop Type *
                <input
                  type="text"
                  value={formData.crop_type}
                  onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                  required
                  placeholder="e.g., Corn, Soybean, Wheat"
                />
              </label>
              <label>
                Planting Date *
                <input
                  type="date"
                  value={formData.planting_date}
                  onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
                  required
                />
              </label>
              <label>
                Current Stage
                <select
                  value={formData.current_stage}
                  onChange={(e) => setFormData({ ...formData, current_stage: e.target.value })}
                >
                  <option value="PLANTED">Planted</option>
                  <option value="GROWING">Growing</option>
                  <option value="READY">Ready</option>
                  <option value="HARVESTED">Harvested</option>
                </select>
              </label>
              {user?.role === 'ADMIN' && (
                <label>
                  Assign Agent
                  <select
                    value={formData.assigned_agent_id}
                    onChange={(e) => setFormData({ ...formData, assigned_agent_id: e.target.value })}
                  >
                    <option value="">-- Unassigned --</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  type="submit"
                  disabled={formBusy}
                  style={{
                    flex: 1,
                    backgroundColor: '#3d6e4e',
                    color: 'white'
                  }}
                >
                  {formBusy ? 'Creating…' : 'Create Field'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  style={{
                    flex: 1,
                    backgroundColor: '#999',
                    color: 'white'
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
