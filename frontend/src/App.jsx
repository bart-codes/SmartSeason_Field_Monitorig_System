import { useState } from 'react';

const API_BASE = 'http://localhost:4000/api';

function App() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Password123!');
  const [token, setToken] = useState('');
  const [fields, setFields] = useState([]);
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      setToken(data.token);
      fetchFields(data.token);
    } catch (err) {
      setError('Unable to reach API');
    }
  };

  const fetchFields = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE}/fields`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await response.json();
      setFields(data);
    } catch (err) {
      setError('Unable to load fields');
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>SmartSeason Field Monitoring</h1>
      </header>

      {!token ? (
        <section className="card login-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </label>
            <label>
              Password
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </label>
            <button type="submit">Sign In</button>
          </form>
          {error && <div className="error-message">{error}</div>}
          <div className="hint">Use admin@example.com or agent@example.com</div>
        </section>
      ) : (
        <section className="card fields-card">
          <h2>Your Assigned Fields</h2>
          {fields.length === 0 ? (
            <p>No fields assigned yet.</p>
          ) : (
            <div className="fields-grid">
              {fields.map((field) => (
                <article className="field-item" key={field.id}>
                  <h3>{field.name}</h3>
                  <p><strong>Crop:</strong> {field.crop_type}</p>
                  <p><strong>Stage:</strong> {field.current_stage}</p>
                  <p><strong>Status:</strong> {field.status}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
