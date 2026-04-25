const express = require('express');
const bcrypt = require('bcryptjs');
const { dbAll, dbGet, dbRun } = require('../db');
const authenticate = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();
router.use(authenticate);

// Get all agents
router.get('/', async (req, res) => {
  try {
    const agents = await dbAll('SELECT id, name, email, role FROM users WHERE role = ? ORDER BY name ASC', ['AGENT']);
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load agents' });
  }
});

// Add new agent (admin only)
router.post('/', adminAuth, async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Check if email already exists
    const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, 'AGENT', new Date().toISOString()]
    );

    const newAgent = await dbGet('SELECT id, name, email, role FROM users WHERE email = ?', [email]);
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

// Update agent (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    return res.status(400).json({ error: 'At least one field must be updated' });
  }

  try {
    const agent = await dbGet('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'AGENT']);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (email && email !== agent.email) {
      const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (password) {
      const passwordHash = bcrypt.hashSync(password, 10);
      updates.push('password_hash = ?');
      params.push(passwordHash);
    }

    params.push(id);
    await dbRun(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    const updatedAgent = await dbGet('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

// Delete agent (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const agent = await dbGet('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'AGENT']);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    await dbRun('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

module.exports = router;
