const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbFile = process.env.DB_FILE || path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile);

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const initDatabase = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      crop_type TEXT NOT NULL,
      planting_date TEXT NOT NULL,
      current_stage TEXT NOT NULL,
      status TEXT NOT NULL,
      assigned_agent_id INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (assigned_agent_id) REFERENCES users (id)
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (field_id) REFERENCES fields (id),
      FOREIGN KEY (author_id) REFERENCES users (id)
    )
  `);

  const userCount = await dbGet('SELECT COUNT(*) AS count FROM users');
  if (!userCount || userCount.count === 0) {
    const passwordAdmin = bcrypt.hashSync('Password123!', 10);
    const passwordAgent = bcrypt.hashSync('Agent123!', 10);

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Admin User', 'admin@example.com', passwordAdmin, 'ADMIN', new Date().toISOString()]
    );

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Jasmine Park', 'jasmine@example.com', passwordAgent, 'AGENT', new Date().toISOString()]
    );

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Samuel Reed', 'samuel@example.com', passwordAgent, 'AGENT', new Date().toISOString()]
    );

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Mia Johnson', 'mia@example.com', passwordAgent, 'AGENT', new Date().toISOString()]
    );

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Daniel Cruz', 'daniel@example.com', passwordAgent, 'AGENT', new Date().toISOString()]
    );
  }

  const fieldCount = await dbGet('SELECT COUNT(*) AS count FROM fields');
  if (!fieldCount || fieldCount.count === 0) {
    const jasmine = await dbGet('SELECT id FROM users WHERE email = ?', ['jasmine@example.com']);
    const samuel = await dbGet('SELECT id FROM users WHERE email = ?', ['samuel@example.com']);
    const mia = await dbGet('SELECT id FROM users WHERE email = ?', ['mia@example.com']);
    const daniel = await dbGet('SELECT id FROM users WHERE email = ?', ['daniel@example.com']);

    const now = new Date().toISOString();
    await dbRun(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['North Orchard', 'Corn', '2026-03-12', 'GROWING', 'ACTIVE', jasmine.id, now, now]
    );
    await dbRun(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['East Pasture', 'Soybean', '2026-02-28', 'READY', 'AT_RISK', samuel.id, now, now]
    );
    await dbRun(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['South Field', 'Wheat', '2026-03-20', 'PLANTED', 'ACTIVE', mia.id, now, now]
    );
    await dbRun(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['West Grove', 'Barley', '2026-01-15', 'HARVESTED', 'COMPLETED', daniel.id, now, now]
    );

    const north = await dbGet('SELECT id FROM fields WHERE name = ?', ['North Orchard']);
    const east = await dbGet('SELECT id FROM fields WHERE name = ?', ['East Pasture']);
    const south = await dbGet('SELECT id FROM fields WHERE name = ?', ['South Field']);
    const west = await dbGet('SELECT id FROM fields WHERE name = ?', ['West Grove']);

    await dbRun('INSERT INTO notes (field_id, author_id, content, created_at) VALUES (?, ?, ?, ?)', [north.id, jasmine.id, 'Irrigation schedule is stable and growth looks healthy.', now]);
    await dbRun('INSERT INTO notes (field_id, author_id, content, created_at) VALUES (?, ?, ?, ?)', [east.id, samuel.id, 'Crop appears ready, but weather risk is elevated for the next week.', now]);
    await dbRun('INSERT INTO notes (field_id, author_id, content, created_at) VALUES (?, ?, ?, ?)', [south.id, mia.id, 'New planting phase completed successfully.', now]);
    await dbRun('INSERT INTO notes (field_id, author_id, content, created_at) VALUES (?, ?, ?, ?)', [west.id, daniel.id, 'Harvest completed with strong yield.', now]);
  }
};

initDatabase().catch((error) => {
  console.error('Failed to initialize database:', error);
});

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll
};
