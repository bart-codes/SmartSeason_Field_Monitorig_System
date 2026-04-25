import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { API_BASE, authHeaders, safeFetch } from '../api';

export default function FieldDetailModal({ field, notes, onClose, onNoteAdded, onFieldUpdated }) {
  const { user, token, logout } = useAuth();
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  if (!field) return null;

  const isAgent = user?.role === 'AGENT';
  const isOwner = isAgent && field.assigned_agent_id === user?.id;
  const isAdmin = user?.role === 'ADMIN';
  const canEdit = isAdmin || isOwner;

  const handleAddNote = async (event) => {
    event.preventDefault();
    if (!noteText.trim()) return;
    setSaving(true);
    setError('');

    try {
      await safeFetch(`${API_BASE}/fields/${field.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(token)
        },
        body: JSON.stringify({ content: noteText })
      });
      setNoteText('');
      if (onNoteAdded) onNoteAdded();
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = () => {
    setEditData({
      name: field.name,
      crop_type: field.crop_type,
      planting_date: field.planting_date,
      current_stage: field.current_stage
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await safeFetch(`${API_BASE}/fields/${field.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(token)
        },
        body: JSON.stringify(editData)
      });
      setIsEditing(false);
      setEditData(null);
      if (onFieldUpdated) onFieldUpdated();
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{field.name}</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {canEdit && !isEditing && (
              <button 
                onClick={handleStartEdit}
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Edit
              </button>
            )}
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
        </div>
        <div className="modal-body">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px' }}>
                Field Name
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '12px' }}>
                Crop Type
                <input
                  type="text"
                  value={editData.crop_type}
                  onChange={(e) => setEditData({ ...editData, crop_type: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '12px' }}>
                Planting Date
                <input
                  type="date"
                  value={editData.planting_date}
                  onChange={(e) => setEditData({ ...editData, planting_date: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: '12px' }}>
                Current Stage
                <select
                  value={editData.current_stage}
                  onChange={(e) => setEditData({ ...editData, current_stage: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
                >
                  <option value="PLANTED">Planted</option>
                  <option value="GROWING">Growing</option>
                  <option value="READY">Ready</option>
                  <option value="HARVESTED">Harvested</option>
                </select>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  disabled={saving}
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
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
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
            </form>
          ) : (
            <>
              <div className="detail-row">
                <span>Crop type</span>
                <strong>{field.crop_type}</strong>
              </div>
              <div className="detail-row">
                <span>Planting date</span>
                <strong>{field.planting_date}</strong>
              </div>
              <div className="detail-row">
                <span>Current stage</span>
                <strong>{field.current_stage}</strong>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <strong>{field.status}</strong>
              </div>
              <div className="detail-row">
                <span>Assigned agent</span>
                <strong>{field.assigned_agent_name || 'Unassigned'}</strong>
              </div>
            </>
          )}

          <section className="notes-section">
            <h4>Recent notes</h4>
            {notes && notes.length > 0 ? (
              <ul className="notes-list">
                {notes.map((note) => (
                  <li key={note.id}>{note.content}</li>
                ))}
              </ul>
            ) : (
              <p>No notes yet for this field.</p>
            )}

            <form className="notes-form" onSubmit={handleAddNote}>
              <textarea
                rows="3"
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                placeholder="Add an observation note"
              />
              <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add note'}</button>
            </form>
            {error && <div className="error-message">{error}</div>}
          </section>
        </div>
      </div>
    </div>
  );
}
