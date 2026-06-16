import { db } from './db.js';

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all()
  .map((row) => row.name);

const expected = ['board_columns', 'boards', 'card_movements', 'cards', 'project_members', 'projects', 'swimlanes', 'users'];
const missing = expected.filter((table) => !tables.includes(table));

if (missing.length) {
  console.error(`Tabelas ausentes: ${missing.join(', ')}`);
  process.exit(1);
}

const userColumns = db
  .prepare('PRAGMA table_info(users)')
  .all()
  .map((row) => row.name);

if (!userColumns.includes('google_sub')) {
  console.error('Coluna ausente: users.google_sub');
  process.exit(1);
}

console.log(`Schema OK: ${tables.join(', ')}`);
