import { useMemo } from 'react';
import { fields } from '../../data/mockData';

function statLabel(count, label) {
  return (
    <div className="metric-card">
      <h4>{count}</h4>
      <p>{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const metrics = useMemo(() => {
    const total = fields.length;
    const active = fields.filter((field) => field.status === 'ACTIVE').length;
    const atRisk = fields.filter((field) => field.status === 'AT_RISK').length;
    const completed = fields.filter((field) => field.status === 'COMPLETED').length;
    return { total, active, atRisk, completed };
  }, []);

  return (
    <div className="page-grid">
      <div className="card summary-card">
        <h2>Operations Overview</h2>
        <p>Track field progression, agent workload, and crop status from one place.</p>
        <div className="metrics-row">
          {statLabel(metrics.total, 'Total fields')}
          {statLabel(metrics.active, 'Active fields')}
          {statLabel(metrics.atRisk, 'At risk')}
          {statLabel(metrics.completed, 'Completed')}
        </div>
      </div>

      <div className="card insights-card">
        <h3>Quick insights</h3>
        <ul>
          <li>Field growth is ahead of schedule in most plots.</li>
          <li>Agent coverage is complete across assigned fields.</li>
          <li>Focus on at-risk fields to reduce harvest delays.</li>
        </ul>
      </div>
    </div>
  );
}
