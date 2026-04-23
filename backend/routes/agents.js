const express = require('express');
const { dbAll } = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const agents = await dbAll('SELECT id, name, email, role FROM users WHERE role = ? ORDER BY name ASC', ['AGENT']);
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load agents' });
  }
});

module.exports = router;
