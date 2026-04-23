const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const { promisify } = require('util');

const dbFile = process.env.DB_FILE || path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile);

const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

const createTables = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL
);

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
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  field_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (field_id) REFERENCES fields (id),
  FOREIGN KEY (author_id) REFERENCES users (id)
);
`;

const initDatabase = async () => {
  await dbRun(createTables);

  const row = await dbGet('SELECT COUNT(*) AS count FROM users');
  if (row.count === 0) {
    const passwordAdmin = bcrypt.hashSync('Password123!', 10);
    const passwordAgent = bcrypt.hashSync('Agent123!', 10);

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Admin User', 'admin@example.com', passwordAdmin, 'ADMIN', new Date().toISOString()]
    );

    await dbRun(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      ['Field Agent', 'agent@example.com', passwordAgent, 'AGENT', new Date().toISOString()]
    );
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
