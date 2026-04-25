import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_BASE, safeFetch } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [role, setRole] = useState('ADMIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const roleCredentials = {
    ADMIN: { email: 'admin@example.com', password: 'Password123!' },
    AGENT: { email: 'jasmine@example.com', password: 'Agent123!' }
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setEmail('');
    setPassword('');
    setError('');
  };

  const fillDemoCredentials = () => {
    const creds = roleCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const data = await safeFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="card login-card">
        <h2>Sign in</h2>
        <p>Select your role and enter credentials to access the field monitoring dashboard.</p>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Role
          </label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="ADMIN" 
                checked={role === 'ADMIN'} 
                onChange={handleRoleChange}
              />
              Admin
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="AGENT" 
                checked={role === 'AGENT'} 
                onChange={handleRoleChange}
              />
              Agent
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </label>
          <button type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <button 
          type="button" 
          onClick={fillDemoCredentials}
          style={{ marginTop: '12px', width: '100%', backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ddd', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Use Demo Credentials
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}
