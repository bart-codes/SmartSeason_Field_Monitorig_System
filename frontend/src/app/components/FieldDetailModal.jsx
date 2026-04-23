import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { API_BASE, authHeaders, safeFetch } from '../api';

export default function FieldDetailModal({ field, notes, onClose, onNoteAdded }) {
  const { token, logout } = useAuth();
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!field) return null;

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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{field.name}</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
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
