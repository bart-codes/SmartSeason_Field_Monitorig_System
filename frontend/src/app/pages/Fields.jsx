import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import FieldsTable from '../components/FieldsTable';
import FieldDetailModal from '../components/FieldDetailModal';
import { API_BASE, authHeaders, safeFetch } from '../api';

export default function Fields() {
  const { token, logout } = useAuth();
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleSelectField = (field) => {
    setSelectedField(field);
    loadNotes(field.id);
  };

  return (
    <div className="page-grid">
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Field Management</h2>
            <p>Review field status and drill into individual plots for details.</p>
          </div>
          <button className="primary-button">Add new field</button>
        </div>

        {loading ? (
          <p>Loading fields…</p>
        ) : (
          <FieldsTable fields={fields} onSelect={handleSelectField} />
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      <FieldDetailModal field={selectedField} notes={notes} onClose={() => setSelectedField(null)} onNoteAdded={() => selectedField && loadNotes(selectedField.id)} />
    </div>
  );
}
