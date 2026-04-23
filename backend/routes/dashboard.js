const express = require('express');
const { dbAll } = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/summary', async (req, res) => {
  try {
    const baseQuery = 'SELECT COUNT(*) AS count FROM fields f';
    const scopeClause = req.user.role === 'ADMIN' ? '' : ' WHERE f.assigned_agent_id = ?';
    const params = req.user.role === 'ADMIN' ? [] : [req.user.id];

    const totalRow = await dbAll(`${baseQuery}${scopeClause}`, params);
    const activeQuery = scopeClause ? `${baseQuery}${scopeClause} AND status = 'ACTIVE'` : `${baseQuery} WHERE status = 'ACTIVE'`;
    const atRiskQuery = scopeClause ? `${baseQuery}${scopeClause} AND status = 'AT_RISK'` : `${baseQuery} WHERE status = 'AT_RISK'`;
    const completedQuery = scopeClause ? `${baseQuery}${scopeClause} AND status = 'COMPLETED'` : `${baseQuery} WHERE status = 'COMPLETED'`;

    const activeRow = await dbAll(activeQuery, params);
    const atRiskRow = await dbAll(atRiskQuery, params);
    const completedRow = await dbAll(completedQuery, params);

    res.json({
      total: totalRow[0]?.count || 0,
      active: activeRow[0]?.count || 0,
      atRisk: atRiskRow[0]?.count || 0,
      completed: completedRow[0]?.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard summary' });
  }
});

module.exports = router;
