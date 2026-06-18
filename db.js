const Database = require("better-sqlite3");

const db = new Database("database.sqlite");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT UNIQUE,
  coins INTEGER DEFAULT 0
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT,
  task_name TEXT,
  completed INTEGER DEFAULT 0
);
`);

module.exports = db;