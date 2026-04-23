import { agents } from '../../data/mockData';

export default function AgentDirectory() {
  return (
    <div className="page-grid">
      <div className="card agent-card">
        <div className="card-header">
          <div>
            <h2>Agent directory</h2>
            <p>Field agents assigned to active monitoring tasks.</p>
          </div>
        </div>

        <div className="agent-grid">
          {agents.map((agent) => (
            <div key={agent.id} className="agent-item">
              <h3>{agent.name}</h3>
              <p>{agent.email}</p>
              <span className={`agent-role ${agent.role.toLowerCase()}`}>{agent.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
