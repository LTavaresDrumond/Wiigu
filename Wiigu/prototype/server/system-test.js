import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const prototypeDir = join(__dirname, '..');
const repoDir = join(prototypeDir, '..');
const reportPath = join(repoDir, 'docs', '11-execucao-testes-sistema.md');
const dataDir = join(prototypeDir, 'data');
const stamp = Date.now();
const port = 3101;
const baseUrl = `http://127.0.0.1:${port}/api`;
const dbPath = join(dataDir, `system-test-${stamp}.db`);

mkdirSync(dataDir, { recursive: true });

const server = spawn(process.execPath, ['--no-warnings', 'server/index.js'], {
  cwd: prototypeDir,
  env: {
    ...process.env,
    PORT: String(port),
    WIIGU_DB_PATH: dbPath
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

let serverOutput = '';
server.stdout.on('data', (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on('data', (chunk) => {
  serverOutput += chunk.toString();
});

const results = [];
let token = '';
let project = null;
let boardPayload = null;
let mainLane = null;
let secondLane = null;
let mainCard = null;
let laneMoveCard = null;

function record(id, title, status, evidence) {
  results.push({ id, title, status, evidence });
}

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 12000) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`Servidor de teste nao respondeu. Saida: ${serverOutput}`);
}

async function api(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Erro HTTP ${response.status}`);
  }
  return data;
}

async function apiError(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (response.ok) {
    throw new Error(`Resposta deveria falhar em ${path}.`);
  }
  return data.error || `Erro HTTP ${response.status}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runCase(id, title, fn) {
  try {
    const evidence = await fn();
    record(id, title, 'PASSOU', evidence);
  } catch (error) {
    record(id, title, 'FALHOU', error.message);
    throw error;
  }
}

function findColumn(name) {
  const column = boardPayload.columns.find((item) => item.name === name);
  assert(column, `Coluna ${name} nao encontrada.`);
  return column;
}

function writeReport() {
  const date = new Date().toISOString();
  const passed = results.filter((item) => item.status === 'PASSOU').length;
  const failed = results.filter((item) => item.status === 'FALHOU').length;
  const table = results
    .map((item) => `| ${item.id} | ${item.title} | ${item.status} | ${item.evidence.replaceAll('\n', ' ')} |`)
    .join('\n');

  const markdown = `# Relatorio de Execucao dos Testes de Sistema

## Finalidade

Este documento registra a execucao dos testes de sistema do prototipo Wiigu. Os testes foram executados contra a API do prototipo, usando banco SQLite separado para a rodada de teste.

## Ambiente

- Data da execucao: ${date}
- API testada: ${baseUrl}
- Banco de teste: \`${dbPath}\`
- Comando: \`npm run test:system\`

## Resultado geral

- Cenarios executados: ${results.length}
- Cenarios aprovados: ${passed}
- Cenarios com falha: ${failed}

## Resultado por cenario

| ID | Cenario | Resultado | Evidencia |
| --- | --- | --- | --- |
${table}

## Conclusao

${failed === 0 ? 'Todos os cenarios de sucesso definidos para os servicos principais foram executados com resultado aprovado.' : 'Houve falha em pelo menos um cenario. O prototipo deve ser corrigido e os testes devem ser executados novamente.'}
`;

  writeFileSync(reportPath, markdown, 'utf-8');
}

try {
  await waitForServer();

  await runCase('CT-01', 'Cadastro, login local e logout', async () => {
    const email = `teste-${stamp}@wiigu.local`;
    const register = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Carlos', email, password: '1234' })
    });
    assert(register.user.email === email, 'Usuario cadastrado nao retornou email esperado.');
    token = register.token;
    await api('/auth/logout', { method: 'POST', body: '{}' });
    token = '';
    const login = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: '1234' })
    });
    token = login.token;
    assert(login.user.email === email, 'Login nao retornou usuario esperado.');
    return `Usuario ${email} cadastrado, logout executado e login validado.`;
  });

  await runCase('CT-02', 'CRUD de projetos', async () => {
    const created = await api('/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'Projeto ESW', description: 'Projeto de teste de sistema' })
    });
    project = created.project;
    const updated = await api(`/projects/${project.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Projeto ESW Atualizado', description: 'Descricao atualizada' })
    });
    project = updated.project;
    const listed = await api('/projects');
    assert(listed.projects.some((item) => item.id === project.id), 'Projeto nao listado apos criacao.');
    const temporary = await api('/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'Projeto temporario', description: 'Para exclusao' })
    });
    await api(`/projects/${temporary.project.id}`, { method: 'DELETE' });
    const afterDelete = await api('/projects');
    assert(!afterDelete.projects.some((item) => item.id === temporary.project.id), 'Projeto temporario nao foi excluido.');
    return `Projeto ${project.id} criado, atualizado, listado e projeto temporario excluido.`;
  });

  await runCase('CT-03', 'CRUD de quadros Kanban', async () => {
    boardPayload = await api(`/projects/${project.id}/boards`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Quadro Principal', description: 'Quadro de teste' })
    });
    assert(boardPayload.columns.map((item) => item.name).join(',') === 'A FAZER,FAZENDO,FEITO', 'Colunas obrigatorias nao foram criadas.');
    await api(`/boards/${boardPayload.board.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Quadro Principal Atualizado', description: 'Quadro atualizado' })
    });
    boardPayload = await api(`/boards/${boardPayload.board.id}`);
    const boards = await api(`/projects/${project.id}/boards`);
    assert(boards.boards.some((item) => item.id === boardPayload.board.id), 'Quadro nao listado.');
    const temporary = await api(`/projects/${project.id}/boards`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Quadro temporario', description: 'Para exclusao' })
    });
    await api(`/boards/${temporary.board.id}`, { method: 'DELETE' });
    return `Quadro ${boardPayload.board.id} criado com A FAZER, FAZENDO e FEITO; edicao, leitura e exclusao temporaria validadas.`;
  });

  await runCase('CT-04', 'CRUD de raias', async () => {
    boardPayload = await api(`/boards/${boardPayload.board.id}/swimlanes`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Documentacao' })
    });
    mainLane = boardPayload.swimlanes.find((item) => item.name === 'Documentacao');
    assert(mainLane, 'Raia Documentacao nao criada.');
    boardPayload = await api(`/swimlanes/${mainLane.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Documentacao e UX' })
    });
    mainLane = boardPayload.swimlanes.find((item) => item.name === 'Documentacao e UX');
    boardPayload = await api(`/boards/${boardPayload.board.id}/swimlanes`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Desenvolvimento' })
    });
    secondLane = boardPayload.swimlanes.find((item) => item.name === 'Desenvolvimento');
    const temporary = await api(`/boards/${boardPayload.board.id}/swimlanes`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Raia temporaria' })
    });
    const tempLane = temporary.swimlanes.find((item) => item.name === 'Raia temporaria');
    boardPayload = await api(`/swimlanes/${tempLane.id}`, { method: 'DELETE' });
    assert(!boardPayload.swimlanes.some((item) => item.id === tempLane.id), 'Raia temporaria nao foi excluida.');
    return `Raias criadas, editadas, listadas no quadro e raia temporaria excluida.`;
  });

  await runCase('CT-05', 'CRUD de cartoes', async () => {
    const todo = findColumn('A FAZER');
    boardPayload = await api(`/boards/${boardPayload.board.id}/cards`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Criar Vision',
        description: 'Documento de visao e escopo',
        assignee_name: 'Carlos',
        priority: 'alta',
        due_date: '2026-06-10',
        column_id: todo.id,
        swimlane_id: mainLane.id
      })
    });
    mainCard = boardPayload.cards.find((item) => item.title === 'Criar Vision');
    assert(mainCard?.code, 'Cartao principal nao criado.');
    boardPayload = await api(`/cards/${mainCard.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Criar Vision Revisado',
        description: 'Documento de visao e escopo revisado',
        assignee_name: 'Carlos',
        priority: 'alta',
        due_date: '2026-06-10',
        column_id: todo.id,
        swimlane_id: mainLane.id
      })
    });
    mainCard = boardPayload.cards.find((item) => item.id === mainCard.id);
    const temporary = await api(`/boards/${boardPayload.board.id}/cards`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Cartao temporario',
        description: 'Para exclusao',
        assignee_name: 'Carlos',
        priority: 'media',
        due_date: '2026-06-12',
        column_id: todo.id,
        swimlane_id: mainLane.id
      })
    });
    const tempCard = temporary.cards.find((item) => item.title === 'Cartao temporario');
    boardPayload = await api(`/cards/${tempCard.id}`, { method: 'DELETE' });
    assert(!boardPayload.cards.some((item) => item.id === tempCard.id), 'Cartao temporario nao foi excluido.');
    return `Cartao ${mainCard.code} criado e editado; cartao temporario excluido.`;
  });

  await runCase('CT-06', 'Movimentacao de cartao entre colunas', async () => {
    const doing = findColumn('FAZENDO');
    const done = findColumn('FEITO');
    boardPayload = await api(`/cards/${mainCard.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: mainCard.title,
        description: mainCard.description,
        assignee_name: mainCard.assignee_name,
        priority: mainCard.priority,
        due_date: mainCard.due_date,
        column_id: doing.id,
        swimlane_id: mainCard.swimlane_id
      })
    });
    mainCard = boardPayload.cards.find((item) => item.id === mainCard.id);
    assert(mainCard.started_at, 'Data de inicio nao registrada ao mover para FAZENDO.');
    boardPayload = await api(`/cards/${mainCard.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: mainCard.title,
        description: mainCard.description,
        assignee_name: mainCard.assignee_name,
        priority: mainCard.priority,
        due_date: mainCard.due_date,
        column_id: done.id,
        swimlane_id: mainCard.swimlane_id
      })
    });
    mainCard = boardPayload.cards.find((item) => item.id === mainCard.id);
    assert(mainCard.completed_at, 'Data de conclusao nao registrada ao mover para FEITO.');
    return `Cartao ${mainCard.code} movido para FAZENDO e depois FEITO.`;
  });

  await runCase('CT-07', 'Movimentacao de cartao entre raias', async () => {
    const todo = findColumn('A FAZER');
    boardPayload = await api(`/boards/${boardPayload.board.id}/cards`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Revisar UX',
        description: 'Validar wireframes',
        assignee_name: 'Carlos',
        priority: 'media',
        due_date: '2026-06-13',
        column_id: todo.id,
        swimlane_id: mainLane.id
      })
    });
    const card = boardPayload.cards.find((item) => item.title === 'Revisar UX');
    boardPayload = await api(`/cards/${card.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: card.title,
        description: card.description,
        assignee_name: card.assignee_name,
        priority: card.priority,
        due_date: card.due_date,
        column_id: card.column_id,
        swimlane_id: secondLane.id
      })
    });
    const moved = boardPayload.cards.find((item) => item.id === card.id);
    assert(moved.swimlane_id === secondLane.id && moved.column_id === todo.id, 'Cartao nao preservou coluna ao mudar de raia.');
    laneMoveCard = moved;
    return `Cartao ${moved.code} movido para outra raia preservando coluna atual.`;
  });

  await runCase('CT-08', 'Limite WIP por coluna', async () => {
    const doing = findColumn('FAZENDO');
    boardPayload = await api(`/columns/${doing.id}`, {
      method: 'PUT',
      body: JSON.stringify({ wip_limit: 1 })
    });
    const updatedDoing = boardPayload.columns.find((item) => item.id === doing.id);
    assert(updatedDoing.wip_limit === 1, 'Limite WIP nao foi persistido.');
    boardPayload = await api(`/boards/${boardPayload.board.id}/cards`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Cartao dentro do WIP',
        description: 'Valida entrada permitida',
        assignee_name: 'Carlos',
        priority: 'media',
        due_date: '2026-06-14',
        column_id: doing.id,
        swimlane_id: secondLane.id
      })
    });
    const blockedMessage = await apiError(`/cards/${laneMoveCard.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: laneMoveCard.title,
        description: laneMoveCard.description,
        assignee_name: laneMoveCard.assignee_name,
        priority: laneMoveCard.priority,
        due_date: laneMoveCard.due_date,
        column_id: doing.id,
        swimlane_id: laneMoveCard.swimlane_id
      })
    });
    assert(blockedMessage.includes('Limite WIP'), 'Bloqueio por WIP nao retornou mensagem esperada.');
    return `Limite WIP da coluna FAZENDO definido como ${updatedDoing.wip_limit} e bloqueio acima do limite validado.`;
  });

  await runCase('CT-09', 'Metricas Kanban', async () => {
    const data = await api(`/boards/${boardPayload.board.id}/metrics`);
    assert(typeof data.metrics.lead_time_avg_days === 'number', 'Lead time nao calculado.');
    assert(typeof data.metrics.cycle_time_avg_days === 'number', 'Cycle time nao calculado.');
    assert(data.metrics.throughput_7_days >= 1, 'Throughput nao refletiu cartao concluido.');
    assert(data.metrics.wip.length === 3, 'WIP nao retornou as tres colunas.');
    return `Metricas calculadas: lead time ${data.metrics.lead_time_avg_days}, cycle time ${data.metrics.cycle_time_avg_days}, throughput ${data.metrics.throughput_7_days}.`;
  });

  writeReport();
  console.log(`Testes de sistema concluidos. Relatorio: ${reportPath}`);
} finally {
  server.kill();
}
