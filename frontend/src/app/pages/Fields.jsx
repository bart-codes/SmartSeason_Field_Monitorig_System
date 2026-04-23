import { useState } from 'react';
import FieldsTable from '../components/FieldsTable';
import FieldDetailModal from '../components/FieldDetailModal';
import { fields as fieldData } from '../../data/mockData';

export default function Fields() {
  const [selectedField, setSelectedField] = useState(null);

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

        <FieldsTable fields={fieldData} onSelect={setSelectedField} />
      </div>

      <FieldDetailModal field={selectedField} onClose={() => setSelectedField(null)} />
    </div>
  );
}
