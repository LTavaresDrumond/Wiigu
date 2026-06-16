import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { OAuth2Client } from 'google-auth-library';
import { all, get, now, run, transaction } from './db.js';
import { authMiddleware, clearSession, createSession, hashPassword, verifyPassword } from './auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const app = express();
const port = Number(process.env.PORT || 3001);
const googleClient = new OAuth2Client();

app.use(express.json({ limit: '1mb' }));

function required(value, label) {
  if (value === undefined || value === null || String(value).trim() === '') {
    throw new Error(`${label} e obrigatorio.`);
  }
  return String(value).trim();
}

function toInt(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number)) {
    throw new Error(`${label} invalido.`);
  }
  return number;
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

async function verifyGoogleCredential(credential) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const error = new Error('Login Google nao configurado no servidor.');
    error.status = 400;
    throw error;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: clientId
  });
  const payload = ticket.getPayload();

  if (!payload?.sub || !payload?.email) {
    const error = new Error('Credencial Google incompleta.');
    error.status = 401;
    throw error;
  }
  if (!payload.email_verified) {
    const error = new Error('Email Google nao verificado.');
    error.status = 401;
    throw error;
  }

  return {
    googleSub: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email.split('@')[0]
  };
}

function ownsProject(userId, projectId) {
  return get(
    `SELECT p.id
       FROM projects p
       LEFT JOIN project_members pm ON pm.project_id = p.id
      WHERE p.id = ? AND (p.owner_id = ? OR pm.user_id = ?)`,
    [projectId, userId, userId]
  );
}

function canAccessBoard(userId, boardId) {
  return get(
    `SELECT b.id, b.project_id
       FROM boards b
       JOIN projects p ON p.id = b.project_id
       LEFT JOIN project_members pm ON pm.project_id = p.id
      WHERE b.id = ? AND (p.owner_id = ? OR pm.user_id = ?)`,
    [boardId, userId, userId]
  );
}

function requireProject(req, projectId) {
  const project = ownsProject(req.user.id, projectId);
  if (!project) {
    const error = new Error('Projeto nao encontrado.');
    error.status = 404;
    throw error;
  }
  return project;
}

function requireBoard(req, boardId) {
  const board = canAccessBoard(req.user.id, boardId);
  if (!board) {
    const error = new Error('Quadro nao encontrado.');
    error.status = 404;
    throw error;
  }
  return board;
}

function boardPayload(boardId) {
  const board = get('SELECT * FROM boards WHERE id = ?', [boardId]);
  const columns = all('SELECT * FROM board_columns WHERE board_id = ? ORDER BY position', [boardId]);
  const swimlanes = all('SELECT * FROM swimlanes WHERE board_id = ? ORDER BY position', [boardId]);
  const cards = all(
    `SELECT c.*, bc.name AS column_name, s.name AS swimlane_name
       FROM cards c
       JOIN board_columns bc ON bc.id = c.column_id
       JOIN swimlanes s ON s.id = c.swimlane_id
      WHERE c.board_id = ?
      ORDER BY c.id DESC`,
    [boardId]
  );

  return { board, columns, swimlanes, cards };
}

function nextCardCode() {
  const row = get('SELECT COUNT(*) AS total FROM cards');
  return `WIG-${String((row?.total || 0) + 1).padStart(3, '0')}`;
}

function assertWipLimit(boardId, column, ignoredCardId = null) {
  if (column.wip_limit === null || column.wip_limit === undefined) return;
  const count = get(
    `SELECT COUNT(*) AS total
       FROM cards
      WHERE board_id = ? AND column_id = ? AND (? IS NULL OR id <> ?)`,
    [boardId, column.id, ignoredCardId, ignoredCardId]
  );

  if (count.total >= column.wip_limit) {
    const error = new Error(`Limite WIP da coluna ${column.name} atingido.`);
    error.status = 400;
    throw error;
  }
}

function calculateMetrics(boardId) {
  const columns = all('SELECT * FROM board_columns WHERE board_id = ? ORDER BY position', [boardId]);
  const cards = all('SELECT * FROM cards WHERE board_id = ?', [boardId]);
  const doneCards = cards.filter((card) => card.completed_at);
  const activeColumnNames = new Set(['A FAZER', 'FAZENDO']);

  const wip = columns.map((column) => ({
    column_id: column.id,
    column_name: column.name,
    wip_limit: column.wip_limit,
    count: cards.filter((card) => card.column_id === column.id).length,
    active: activeColumnNames.has(column.name)
  }));

  const durations = doneCards.map((card) => {
    const created = new Date(card.created_at).getTime();
    const started = card.started_at ? new Date(card.started_at).getTime() : created;
    const completed = new Date(card.completed_at).getTime();
    return {
      code: card.code,
      title: card.title,
      lead_time_days: Math.max(0, (completed - created) / 86400000),
      cycle_time_days: Math.max(0, (completed - started) / 86400000)
    };
  });

  const average = (items, key) => {
    if (!items.length) return 0;
    return items.reduce((sum, item) => sum + item[key], 0) / items.length;
  };

  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const throughput = doneCards.filter((card) => new Date(card.completed_at).getTime() >= sevenDaysAgo).length;

  return {
    lead_time_avg_days: Number(average(durations, 'lead_time_days').toFixed(2)),
    cycle_time_avg_days: Number(average(durations, 'cycle_time_days').toFixed(2)),
    throughput_7_days: throughput,
    wip,
    completed_cards: durations.map((item) => ({
      ...item,
      lead_time_days: Number(item.lead_time_days.toFixed(2)),
      cycle_time_days: Number(item.cycle_time_days.toFixed(2))
    }))
  };
}

app.post('/api/auth/register', asyncHandler((req, res) => {
  const name = required(req.body.name, 'Nome');
  const email = required(req.body.email, 'Email').toLowerCase();
  const password = required(req.body.password, 'Senha');

  if (password.length < 4) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 4 caracteres.' });
  }

  try {
    run('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hashPassword(password)]);
  } catch {
    return res.status(409).json({ error: 'Email ja cadastrado.' });
  }

  const user = get('SELECT id, name, email, created_at FROM users WHERE email = ?', [email]);
  const token = createSession(user.id);
  res.status(201).json({ token, user });
}));

app.post('/api/auth/login', asyncHandler((req, res) => {
  const email = required(req.body.email, 'Email').toLowerCase();
  const password = required(req.body.password, 'Senha');
  const userWithPassword = get('SELECT * FROM users WHERE email = ?', [email]);

  if (!userWithPassword || !verifyPassword(password, userWithPassword.password_hash)) {
    return res.status(401).json({ error: 'Email ou senha invalidos.' });
  }

  const token = createSession(userWithPassword.id);
  const { password_hash, ...user } = userWithPassword;
  res.json({ token, user });
}));

app.post('/api/auth/google', asyncHandler(async (req, res) => {
  const credential = required(req.body.credential, 'Credencial Google');
  const profile = await verifyGoogleCredential(credential);

  const user = transaction(() => {
    let currentUser = get('SELECT id, name, email, created_at FROM users WHERE google_sub = ?', [profile.googleSub]);
    if (currentUser) return currentUser;

    currentUser = get('SELECT id, name, email, google_sub, created_at FROM users WHERE email = ?', [profile.email]);
    if (currentUser) {
      run('UPDATE users SET google_sub = ? WHERE id = ?', [profile.googleSub, currentUser.id]);
      return get('SELECT id, name, email, created_at FROM users WHERE id = ?', [currentUser.id]);
    }

    const created = run('INSERT INTO users (name, email, google_sub, password_hash) VALUES (?, ?, ?, ?)', [
      profile.name,
      profile.email,
      profile.googleSub,
      hashPassword(`${profile.googleSub}:${now()}`)
    ]);
    return get('SELECT id, name, email, created_at FROM users WHERE id = ?', [created.lastInsertRowid]);
  });

  const token = createSession(user.id);
  res.json({ token, user });
}));

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  clearSession(req.token);
  res.json({ ok: true });
});

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/projects', authMiddleware, (req, res) => {
  const projects = all(
    `SELECT DISTINCT p.*,
            (SELECT COUNT(*) FROM boards b WHERE b.project_id = p.id) AS board_count
       FROM projects p
       LEFT JOIN project_members pm ON pm.project_id = p.id
      WHERE p.owner_id = ? OR pm.user_id = ?
      ORDER BY p.created_at DESC`,
    [req.user.id, req.user.id]
  );
  res.json({ projects });
});

app.post('/api/projects', authMiddleware, asyncHandler((req, res) => {
  const name = required(req.body.name, 'Nome do projeto');
  const description = req.body.description?.trim() || '';

  const project = transaction(() => {
    const result = run('INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)', [
      name,
      description,
      req.user.id
    ]);
    run('INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)', [
      result.lastInsertRowid,
      req.user.id,
      'owner'
    ]);
    return get('SELECT * FROM projects WHERE id = ?', [result.lastInsertRowid]);
  });

  res.status(201).json({ project });
}));

app.put('/api/projects/:id', authMiddleware, asyncHandler((req, res) => {
  const id = toInt(req.params.id, 'Projeto');
  requireProject(req, id);
  const name = required(req.body.name, 'Nome do projeto');
  const description = req.body.description?.trim() || '';
  run('UPDATE projects SET name = ?, description = ? WHERE id = ?', [name, description, id]);
  res.json({ project: get('SELECT * FROM projects WHERE id = ?', [id]) });
}));

app.delete('/api/projects/:id', authMiddleware, asyncHandler((req, res) => {
  const id = toInt(req.params.id, 'Projeto');
  requireProject(req, id);
  run('DELETE FROM projects WHERE id = ?', [id]);
  res.json({ ok: true });
}));

app.get('/api/projects/:projectId/boards', authMiddleware, asyncHandler((req, res) => {
  const projectId = toInt(req.params.projectId, 'Projeto');
  requireProject(req, projectId);
  const boards = all('SELECT * FROM boards WHERE project_id = ? ORDER BY created_at DESC', [projectId]);
  res.json({ boards });
}));

app.post('/api/projects/:projectId/boards', authMiddleware, asyncHandler((req, res) => {
  const projectId = toInt(req.params.projectId, 'Projeto');
  requireProject(req, projectId);
  const name = required(req.body.name, 'Nome do quadro');
  const description = req.body.description?.trim() || '';

  const payload = transaction(() => {
    const boardResult = run('INSERT INTO boards (project_id, name, description) VALUES (?, ?, ?)', [
      projectId,
      name,
      description
    ]);
    const boardId = Number(boardResult.lastInsertRowid);

    ['A FAZER', 'FAZENDO', 'FEITO'].forEach((columnName, index) => {
      run('INSERT INTO board_columns (board_id, name, position, wip_limit) VALUES (?, ?, ?, ?)', [
        boardId,
        columnName,
        index + 1,
        columnName === 'FAZENDO' ? 3 : null
      ]);
    });
    run('INSERT INTO swimlanes (board_id, name, position) VALUES (?, ?, ?)', [boardId, 'Geral', 1]);
    return boardPayload(boardId);
  });

  res.status(201).json(payload);
}));

app.get('/api/boards/:boardId', authMiddleware, asyncHandler((req, res) => {
  const boardId = toInt(req.params.boardId, 'Quadro');
  requireBoard(req, boardId);
  res.json(boardPayload(boardId));
}));

app.put('/api/boards/:boardId', authMiddleware, asyncHandler((req, res) => {
  const boardId = toInt(req.params.boardId, 'Quadro');
  requireBoard(req, boardId);
  const name = required(req.body.name, 'Nome do quadro');
  const description = req.body.description?.trim() || '';
  run('UPDATE boards SET name = ?, description = ? WHERE id = ?', [name, description, boardId]);
  res.json(boardPayload(boardId));
}));

app.delete('/api/boards/:boardId', authMiddleware, asyncHandler((req, res) => {
  const boardId = toInt(req.params.boardId, 'Quadro');
  requireBoard(req, boardId);
  run('DELETE FROM boards WHERE id = ?', [boardId]);
  res.json({ ok: true });
}));

app.post('/api/boards/:boardId/swimlanes', authMiddleware, asyncHandler((req, res) => {
  const boardId = toInt(req.params.boardId, 'Quadro');
  requireBoard(req, boardId);
  const name = required(req.body.name, 'Nome da raia');
  const maxPosition = get('SELECT COALESCE(MAX(position), 0) AS value FROM swimlanes WHERE board_id = ?', [boardId]);
  try {
    run('INSERT INTO swimlanes (board_id, name, position) VALUES (?, ?, ?)', [boardId, name, maxPosition.value + 1]);
  } catch {
    return res.status(409).json({ error: 'Ja existe uma raia com esse nome.' });
  }
  res.status(201).json(boardPayload(boardId));
}));

app.put('/api/swimlanes/:id', authMiddleware, asyncHandler((req, res) => {
  const id = toInt(req.params.id, 'Raia');
  const swimlane = get('SELECT * FROM swimlanes WHERE id = ?', [id]);
  if (!swimlane) return res.status(404).json({ error: 'Raia nao encontrada.' });
  requireBoard(req, swimlane.board_id);
  const name = required(req.body.name, 'Nome da raia');
  run('UPDATE swimlanes SET name = ? WHERE id = ?', [name, id]);
  res.json(boardPayload(swimlane.board_id));
}));

app.delete('/api/swimlanes/:id', authMiddleware, asyncHandler((req, res) => {
  const id = toInt(req.params.id, 'Raia');
  const swimlane = get('SELECT * FROM swimlanes WHERE id = ?', [id]);
  if (!swimlane) return res.status(404).json({ error: 'Raia nao encontrada.' });
  requireBoard(req, swimlane.board_id);
  const cards = get('SELECT COUNT(*) AS total FROM cards WHERE swimlane_id = ?', [id]);
  if (cards.total > 0) return res.status(400).json({ error: 'Nao e possivel excluir raia com cartoes.' });
  run('DELETE FROM swimlanes WHERE id = ?', [id]);
  res.json(boardPayload(swimlane.board_id));
}));

app.put('/api/columns/:id', authMiddleware, asyncHandler((req, res) => {
  const id = toInt(req.params.id, 'Coluna');
  const column = get('SELECT * FROM board_columns WHERE id = ?', [id]);
  if (!column) return res.status(404).json({ error: 'Coluna nao encontrada.' });
  requireBoard(req, column.board_id);
  const rawLimit = req.body.wip_limit;
  const limit = rawLimit === '' || rawLimit === null || rawLimit === undefined ? null : Math.max(0, toInt(rawLimit, 'Limite WIP'));
  run('UPDATE board_columns SET wip_limit = ? WHERE id = ?', [limit, id]);
  res.json(boardPayload(column.board_id));
}));

app.post('/api/boards/:boardId/cards', authMiddleware, asyncHandler((req, res) => {
  const boardId = toInt(req.params.boardId, 'Quadro');
  requireBoard(req, boardId);
  const title = required(req.body.title, 'Nome do cartao');
  const description = req.body.description?.trim() || '';
  const assigneeName = required(req.body.assignee_name, 'Responsavel');
  const priority = req.body.priority || 'media';
  const dueDate = required(req.body.due_date, 'Data limite');
  const columnId = toInt(req.body.column_id, 'Coluna');
  const swimlaneId = toInt(req.body.swimlane_id, 'Raia');

  const column = get('SELECT * FROM board_columns WHERE id = ? AND board_id = ?', [columnId, boardId]);
  const swimlane = get('SELECT * FROM swimlanes WHERE id = ? AND board_id = ?', [swimlaneId, boardId]);
  if (!column || !swimlane) return res.status(400).json({ error: 'Coluna ou raia invalida.' });
  assertWipLimit(boardId, column);

  const timestamp = now();
  const startedAt = column.name === 'FAZENDO' ? timestamp : null;
  const completedAt = column.name === 'FEITO' ? timestamp : null;

  run(
    `INSERT INTO cards
      (code, board_id, column_id, swimlane_id, title, description, assignee_name, priority, due_date, created_at, started_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nextCardCode(), boardId, columnId, swimlaneId, title, description, assigneeName, priority, dueDate, timestamp, startedAt, completedAt]
  );
  res.status(201).json(boardPayload(boardId));
}));

app.put('/api/cards/:id', authMiddleware, asyncHandler((req, res) => {
  const id = toInt(req.params.id, 'Cartao');
  const oldCard = get('SELECT * FROM cards WHERE id = ?', [id]);
  if (!oldCard) return res.status(404).json({ error: 'Cartao nao encontrado.' });
  requireBoard(req, oldCard.board_id);

  const title = required(req.body.title, 'Nome do cartao');
  const description = req.body.description?.trim() || '';
  const assigneeName = required(req.body.assignee_name, 'Responsavel');
  const priority = req.body.priority || 'media';
  const dueDate = required(req.body.due_date, 'Data limite');
  const columnId = toInt(req.body.column_id, 'Coluna');
  const swimlaneId = toInt(req.body.swimlane_id, 'Raia');

  const column = get('SELECT * FROM board_columns WHERE id = ? AND board_id = ?', [columnId, oldCard.board_id]);
  const swimlane = get('SELECT * FROM swimlanes WHERE id = ? AND board_id = ?', [swimlaneId, oldCard.board_id]);
  if (!column || !swimlane) return res.status(400).json({ error: 'Coluna ou raia invalida.' });

  const timestamp = now();
  const changedColumn = oldCard.column_id !== columnId;
  const changedSwimlane = oldCard.swimlane_id !== swimlaneId;
  if (changedColumn) {
    assertWipLimit(oldCard.board_id, column, id);
  }
  const startedAt = oldCard.started_at || (column.name === 'FAZENDO' ? timestamp : null);
  const completedAt = column.name === 'FEITO' ? (oldCard.completed_at || timestamp) : null;

  transaction(() => {
    run(
      `UPDATE cards
          SET column_id = ?, swimlane_id = ?, title = ?, description = ?, assignee_name = ?,
              priority = ?, due_date = ?, started_at = ?, completed_at = ?
        WHERE id = ?`,
      [columnId, swimlaneId, title, description, assigneeName, priority, dueDate, startedAt, completedAt, id]
    );

    if (changedColumn || changedSwimlane) {
      run(
        `INSERT INTO card_movements
          (card_id, from_column_id, to_column_id, from_swimlane_id, to_swimlane_id, moved_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, oldCard.column_id, columnId, oldCard.swimlane_id, swimlaneId, timestamp]
      );
    }
  });

  res.json(boardPayload(oldCard.board_id));
}));

app.delete('/api/cards/:id', authMiddleware, asyncHandler((req, res) => {
  const id = toInt(req.params.id, 'Cartao');
  const card = get('SELECT * FROM cards WHERE id = ?', [id]);
  if (!card) return res.status(404).json({ error: 'Cartao nao encontrado.' });
  requireBoard(req, card.board_id);
  run('DELETE FROM cards WHERE id = ?', [id]);
  res.json(boardPayload(card.board_id));
}));

app.get('/api/boards/:boardId/metrics', authMiddleware, asyncHandler((req, res) => {
  const boardId = toInt(req.params.boardId, 'Quadro');
  requireBoard(req, boardId);
  res.json({ metrics: calculateMetrics(boardId) });
}));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

const distDir = join(rootDir, 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(join(distDir, 'index.html'));
    }
    next();
  });
}

app.use((error, req, res, _next) => {
  const status = error.status || 400;
  res.status(status).json({ error: error.message || 'Erro inesperado.' });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Wiigu API em http://127.0.0.1:${port}`);
});
