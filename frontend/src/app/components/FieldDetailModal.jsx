export default function FieldDetailModal({ field, onClose }) {
  if (!field) return null;

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
            <strong>{field.assigned_agent}</strong>
          </div>
          <div className="detail-row">
            <span>Notes</span>
            <p>{field.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
