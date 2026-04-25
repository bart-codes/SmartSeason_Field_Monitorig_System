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
      ['Wanjiru Muthoni', 'wanjiru@example.com', passwordAgent, 'AGENT', new Date().toISOString()]
    );

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Kipchoge Koech', 'kipchoge@example.com', passwordAgent, 'AGENT', new Date().toISOString()]
    );

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Njeri Kamau', 'njeri@example.com', passwordAgent, 'AGENT', new Date().toISOString()]
    );

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Chemutai Kiplagat', 'chemutai@example.com', passwordAgent, 'AGENT', new Date().toISOString()]
    );
  }

  const fieldCount = await dbGet('SELECT COUNT(*) AS count FROM fields');
  if (!fieldCount || fieldCount.count === 0) {
    const wanjiru = await dbGet('SELECT id FROM users WHERE email = ?', ['wanjiru@example.com']);
    const kipchoge = await dbGet('SELECT id FROM users WHERE email = ?', ['kipchoge@example.com']);
    const njeri = await dbGet('SELECT id FROM users WHERE email = ?', ['njeri@example.com']);
    const chemutai = await dbGet('SELECT id FROM users WHERE email = ?', ['chemutai@example.com']);

    const now = new Date().toISOString();
    await dbRun(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Kigumo Heights', 'Maize', '2026-03-12', 'GROWING', 'ACTIVE', wanjiru.id, now, now]
    );
    await dbRun(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Nakuru Spring', 'Wheat', '2026-02-28', 'READY', 'AT_RISK', kipchoge.id, now, now]
    );
    await dbRun(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Murang\'a River Bottom', 'Potatoes', '2026-03-20', 'PLANTED', 'ACTIVE', njeri.id, now, now]
    );
    await dbRun(
      'INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Eldoret Green Valley', 'Barley', '2026-01-15', 'HARVESTED', 'COMPLETED', chemutai.id, now, now]
    );

    const kigumo = await dbGet('SELECT id FROM fields WHERE name = ?', ['Kigumo Heights']);
    const nakuru = await dbGet('SELECT id FROM fields WHERE name = ?', ['Nakuru Spring']);
    const murangaRiver = await dbGet('SELECT id FROM fields WHERE name = ?', ['Murang\'a River Bottom']);
    const eldoret = await dbGet('SELECT id FROM fields WHERE name = ?', ['Eldoret Green Valley']);

    await dbRun('INSERT INTO notes (field_id, author_id, content, created_at) VALUES (?, ?, ?, ?)', [kigumo.id, wanjiru.id, 'Crop growing well with good soil moisture. Central region performing excellently.', now]);
    await dbRun('INSERT INTO notes (field_id, author_id, content, created_at) VALUES (?, ?, ?, ?)', [nakuru.id, kipchoge.id, 'Wheat crop ready but Rift Valley weather conditions unpredictable next week.', now]);
    await dbRun('INSERT INTO notes (field_id, author_id, content, created_at) VALUES (?, ?, ?, ?)', [murangaRiver.id, njeri.id, 'Potato planting phase completed successfully in fertile valley soil.', now]);
    await dbRun('INSERT INTO notes (field_id, author_id, content, created_at) VALUES (?, ?, ?, ?)', [eldoret.id, chemutai.id, 'Barley harvest completed with strong yield in Rift Valley region.', now]);
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
