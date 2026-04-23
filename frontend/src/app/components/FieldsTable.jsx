export default function FieldsTable({ fields, onSelect }) {
  return (
    <div className="card table-card">
      <div className="card-header">
        <h3>Field list</h3>
        <p>{fields.length} fields available</p>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Crop</th>
              <th>Planting</th>
              <th>Stage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => (
              <tr key={field.id} onClick={() => onSelect(field)}>
                <td>{field.name}</td>
                <td>{field.crop_type}</td>
                <td>{field.planting_date}</td>
                <td>{field.current_stage}</td>
                <td><span className={`status-pill ${field.status.toLowerCase()}`}>{field.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
