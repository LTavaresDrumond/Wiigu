import crypto from 'node:crypto';
import { get } from './db.js';

const sessions = new Map();

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(hash, 'hex');
  return storedBuffer.length === candidate.length && crypto.timingSafeEqual(storedBuffer, candidate);
}

export function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, userId);
  return token;
}

export function clearSession(token) {
  sessions.delete(token);
}

export function authMiddleware(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: 'Usuario nao autenticado.' });
  }

  const user = get('SELECT id, name, email, created_at FROM users WHERE id = ?', [sessions.get(token)]);
  if (!user) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Sessao invalida.' });
  }

  req.token = token;
  req.user = user;
  next();
}

