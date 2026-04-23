const express = require('express');
const { dbGet, dbAll, dbRun } = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

const computeStatus = (stage) => {
  if (stage === 'HARVESTED') return 'COMPLETED';
  if (stage === 'PLANTED' || stage === 'GROWING') return 'ACTIVE';
  return 'AT_RISK';
};

const enforceAccess = (field, user) => {
  return user.role === 'ADMIN' || field.assigned_agent_id === user.id;
};

router.get('/', async (req, res) => {
  try {
    const baseQuery = `SELECT f.*, u.name AS assigned_agent_name
      FROM fields f
      LEFT JOIN users u ON f.assigned_agent_id = u.id`;
    const query = req.user.role === 'ADMIN'
      ? baseQuery
      : `${baseQuery} WHERE f.assigned_agent_id = ?`;

    const fields = req.user.role === 'ADMIN'
      ? await dbAll(query)
      : await dbAll(query, [req.user.id]);

    res.json(fields);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load fields' });
  }
});

router.post('/', async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin only' });
  }

  const { name, crop_type, planting_date, current_stage, assigned_agent_id } = req.body;
  if (!name || !crop_type || !planting_date || !current_stage) {
    return res.status(400).json({ error: 'Missing required field data' });
  }

  try {
    const status = computeStatus(current_stage);
    const now = new Date().toISOString();

    const result = await dbRun(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, crop_type, planting_date, current_stage, status, assigned_agent_id || null, now, now]
    );

    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create field' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const field = await dbGet(
      `SELECT f.*, u.name AS assigned_agent_name
       FROM fields f
       LEFT JOIN users u ON f.assigned_agent_id = u.id
       WHERE f.id = ?`,
      [req.params.id]
    );
    if (!field) return res.status(404).json({ error: 'Field not found' });
    if (!enforceAccess(field, req.user)) return res.status(403).json({ error: 'Forbidden' });
    res.json(field);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch field' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const field = await dbGet('SELECT * FROM fields WHERE id = ?', [req.params.id]);
    if (!field) return res.status(404).json({ error: 'Field not found' });
    if (!enforceAccess(field, req.user)) return res.status(403).json({ error: 'Forbidden' });

    const { name, crop_type, planting_date, current_stage, assigned_agent_id } = req.body;
    const updatedStage = current_stage || field.current_stage;
    const status = computeStatus(updatedStage);
    const now = new Date().toISOString();

    await dbRun(
      'UPDATE fields SET name = ?, crop_type = ?, planting_date = ?, current_stage = ?, status = ?, assigned_agent_id = ?, updated_at = ? WHERE id = ?',
      [
        name || field.name,
        crop_type || field.crop_type,
        planting_date || field.planting_date,
        updatedStage,
        status,
        assigned_agent_id !== undefined ? assigned_agent_id : field.assigned_agent_id,
        now,
        req.params.id
      ]
    );

    res.json({ message: 'Field updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update field' });
  }
});

router.patch('/:id/assign', async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin only' });
  }

  try {
    const { assigned_agent_id } = req.body;
    const field = await dbGet('SELECT * FROM fields WHERE id = ?', [req.params.id]);
    if (!field) return res.status(404).json({ error: 'Field not found' });

    await dbRun(
      'UPDATE fields SET assigned_agent_id = ?, updated_at = ? WHERE id = ?',
      [assigned_agent_id, new Date().toISOString(), req.params.id]
    );

    res.json({ message: 'Field assignment updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

router.get('/:id/notes', async (req, res) => {
  try {
    const field = await dbGet('SELECT * FROM fields WHERE id = ?', [req.params.id]);
    if (!field) return res.status(404).json({ error: 'Field not found' });
    if (!enforceAccess(field, req.user)) return res.status(403).json({ error: 'Forbidden' });

    const notes = await dbAll('SELECT * FROM notes WHERE field_id = ? ORDER BY created_at DESC', [req.params.id]);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load notes' });
  }
});

router.post('/:id/notes', async (req, res) => {
  try {
    const field = await dbGet('SELECT * FROM fields WHERE id = ?', [req.params.id]);
    if (!field) return res.status(404).json({ error: 'Field not found' });
    if (!enforceAccess(field, req.user)) return res.status(403).json({ error: 'Forbidden' });

    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    await dbRun(
      'INSERT INTO notes (field_id, author_id, content, created_at) VALUES (?, ?, ?, ?)',
      [req.params.id, req.user.id, content, new Date().toISOString()]
    );

    res.status(201).json({ message: 'Note added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

module.exports = router;
