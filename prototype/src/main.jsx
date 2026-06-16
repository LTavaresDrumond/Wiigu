import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BarChart3,
  CheckCircle2,
  Columns3,
  Edit,
  KeyRound,
  LogOut,
  Plus,
  Save,
  Trash2,
  X
} from 'lucide-react';
import './styles.css';

const blankProject = { name: '', description: '' };
const blankBoard = { name: '', description: '' };
const blankLane = { name: '' };
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const blankCard = {
  title: '',
  description: '',
  assignee_name: '',
  priority: 'media',
  due_date: '',
  column_id: '',
  swimlane_id: ''
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('wiigu_token') || '');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [boardData, setBoardData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [panel, setPanel] = useState('projects');
  const [projectForm, setProjectForm] = useState(blankProject);
  const [editingProject, setEditingProject] = useState(null);
  const [boardForm, setBoardForm] = useState(blankBoard);
  const [editingBoard, setEditingBoard] = useState(null);
  const [laneForm, setLaneForm] = useState(blankLane);
  const [editingLane, setEditingLane] = useState(null);
  const [cardForm, setCardForm] = useState(blankCard);
  const [editingCard, setEditingCard] = useState(null);
  const [wipDraft, setWipDraft] = useState({});
  const [draggingCardId, setDraggingCardId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const api = async (path, options = {}) => {
    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao processar solicitacao.');
    }
    return data;
  };

  const showError = (error) => setMessage(error.message || String(error));
  const showOk = (text) => setMessage(text);

  const loadProjects = async () => {
    const data = await api('/api/projects');
    setProjects(data.projects);
  };

  const loadBoards = async (project) => {
    const data = await api(`/api/projects/${project.id}/boards`);
    setSelectedProject(project);
    setBoards(data.boards);
    setPanel('boards');
    setBoardData(null);
    setMetrics(null);
  };

  const loadBoard = async (boardId) => {
    const data = await api(`/api/boards/${boardId}`);
    setBoardData(data);
    setWipDraft(Object.fromEntries(data.columns.map((column) => [column.id, column.wip_limit ?? ''])));
    setPanel('board');
    setMetrics(null);
  };

  const completeAuth = (data) => {
    localStorage.setItem('wiigu_token', data.token);
    setToken(data.token);
    setUser(data.user);
    showOk('Acesso realizado.');
  };

  useEffect(() => {
    if (!token) return;
    api('/api/me')
      .then((data) => {
        setUser(data.user);
        return loadProjects();
      })
      .catch(() => {
        localStorage.removeItem('wiigu_token');
        setToken('');
      });
  }, [token]);

  useEffect(() => {
    if (token || !googleClientId || authMode !== 'login') return undefined;

    let cancelled = false;

    const handleCredential = async (response) => {
      if (!response?.credential) return;
      setLoading(true);
      setMessage('');
      try {
        const data = await api('/api/auth/google', {
          method: 'POST',
          body: JSON.stringify({ credential: response.credential })
        });
        completeAuth(data);
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };

    const renderGoogleButton = () => {
      if (cancelled || !window.google?.accounts?.id) return;
      const target = document.getElementById('google-signin');
      if (!target) return;
      target.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredential
      });
      window.google.accounts.id.renderButton(target, {
        theme: 'outline',
        size: 'large',
        shape: 'rectangular',
        width: Math.min(360, target.clientWidth || 360)
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [token, authMode]);

  const submitAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (authMode === 'register' && authForm.password !== authForm.confirm) {
        throw new Error('As senhas devem ser iguais.');
      }

      const path = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload =
        authMode === 'register'
          ? { name: authForm.name, email: authForm.email, password: authForm.password }
          : { email: authForm.email, password: authForm.password };
      const data = await api(path, { method: 'POST', body: JSON.stringify(payload) });
      completeAuth(data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST', body: '{}' });
    } catch {
      // A sessao local e encerrada mesmo se a API ja tiver expirado.
    }
    localStorage.removeItem('wiigu_token');
    setToken('');
    setUser(null);
    setProjects([]);
    setBoards([]);
    setBoardData(null);
    setSelectedProject(null);
  };

  const saveProject = async (event) => {
    event.preventDefault();
    try {
      if (editingProject) {
        await api(`/api/projects/${editingProject.id}`, { method: 'PUT', body: JSON.stringify(projectForm) });
        showOk('Projeto atualizado.');
      } else {
        await api('/api/projects', { method: 'POST', body: JSON.stringify(projectForm) });
        showOk('Projeto criado.');
      }
      setProjectForm(blankProject);
      setEditingProject(null);
      await loadProjects();
    } catch (error) {
      showError(error);
    }
  };

  const deleteProject = async (project) => {
    if (!confirm(`Excluir o projeto "${project.name}"?`)) return;
    try {
      await api(`/api/projects/${project.id}`, { method: 'DELETE' });
      showOk('Projeto excluido.');
      if (selectedProject?.id === project.id) {
        setSelectedProject(null);
        setBoards([]);
        setBoardData(null);
        setPanel('projects');
      }
      await loadProjects();
    } catch (error) {
      showError(error);
    }
  };

  const saveBoard = async (event) => {
    event.preventDefault();
    if (!selectedProject) return;
    try {
      if (editingBoard) {
        await api(`/api/boards/${editingBoard.id}`, { method: 'PUT', body: JSON.stringify(boardForm) });
        showOk('Quadro atualizado.');
        await loadBoards(selectedProject);
      } else {
        const data = await api(`/api/projects/${selectedProject.id}/boards`, {
          method: 'POST',
          body: JSON.stringify(boardForm)
        });
        showOk('Quadro criado com as colunas obrigatorias.');
        setBoardData(data);
        const boardsData = await api(`/api/projects/${selectedProject.id}/boards`);
        setBoards(boardsData.boards);
        setPanel('board');
      }
      setBoardForm(blankBoard);
      setEditingBoard(null);
    } catch (error) {
      showError(error);
    }
  };

  const deleteBoard = async (board) => {
    if (!confirm(`Excluir o quadro "${board.name}"?`)) return;
    try {
      await api(`/api/boards/${board.id}`, { method: 'DELETE' });
      showOk('Quadro excluido.');
      await loadBoards(selectedProject);
    } catch (error) {
      showError(error);
    }
  };

  const saveLane = async (event) => {
    event.preventDefault();
    if (!boardData) return;
    try {
      const path = editingLane ? `/api/swimlanes/${editingLane.id}` : `/api/boards/${boardData.board.id}/swimlanes`;
      const method = editingLane ? 'PUT' : 'POST';
      const data = await api(path, { method, body: JSON.stringify(laneForm) });
      setBoardData(data);
      setLaneForm(blankLane);
      setEditingLane(null);
      setPanel('board');
      showOk(editingLane ? 'Raia atualizada.' : 'Raia criada.');
    } catch (error) {
      showError(error);
    }
  };

  const deleteLane = async (lane) => {
    if (!confirm(`Excluir a raia "${lane.name}"?`)) return;
    try {
      const data = await api(`/api/swimlanes/${lane.id}`, { method: 'DELETE' });
      setBoardData(data);
      showOk('Raia excluida.');
    } catch (error) {
      showError(error);
    }
  };

  const openCardForm = (column, swimlane, card = null) => {
    setEditingCard(card);
    setPanel('card');
    setCardForm(
      card
        ? {
            title: card.title,
            description: card.description || '',
            assignee_name: card.assignee_name || '',
            priority: card.priority,
            due_date: card.due_date || '',
            column_id: String(card.column_id),
            swimlane_id: String(card.swimlane_id)
          }
        : {
            ...blankCard,
            column_id: String(column?.id || boardData?.columns[0]?.id || ''),
            swimlane_id: String(swimlane?.id || boardData?.swimlanes[0]?.id || '')
          }
    );
  };

  const saveCard = async (event) => {
    event.preventDefault();
    if (!boardData) return;
    try {
      const payload = { ...cardForm, column_id: Number(cardForm.column_id), swimlane_id: Number(cardForm.swimlane_id) };
      const path = editingCard ? `/api/cards/${editingCard.id}` : `/api/boards/${boardData.board.id}/cards`;
      const method = editingCard ? 'PUT' : 'POST';
      const data = await api(path, { method, body: JSON.stringify(payload) });
      setBoardData(data);
      setCardForm(blankCard);
      setEditingCard(null);
      setPanel('board');
      showOk(editingCard ? 'Cartao atualizado.' : 'Cartao criado.');
    } catch (error) {
      showError(error);
    }
  };

  const moveCard = async (card, columnId, swimlaneId = card.swimlane_id) => {
    try {
      const payload = {
        title: card.title,
        description: card.description || '',
        assignee_name: card.assignee_name || '',
        priority: card.priority,
        due_date: card.due_date || '',
        column_id: columnId,
        swimlane_id: swimlaneId
      };
      const data = await api(`/api/cards/${card.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setBoardData(data);
      showOk('Movimentacao registrada.');
    } catch (error) {
      showError(error);
    }
  };

  const dropCard = async (event, column, lane) => {
    event.preventDefault();
    const card = boardData?.cards.find((item) => item.id === draggingCardId);
    setDraggingCardId(null);

    if (!card) return;
    if (card.column_id === column.id && card.swimlane_id === lane.id) return;
    await moveCard(card, column.id, lane.id);
  };

  const deleteCard = async (card) => {
    if (!confirm(`Excluir o cartao "${card.title}"?`)) return;
    try {
      const data = await api(`/api/cards/${card.id}`, { method: 'DELETE' });
      setBoardData(data);
      setPanel('board');
      showOk('Cartao excluido.');
    } catch (error) {
      showError(error);
    }
  };

  const saveWip = async (event) => {
    event.preventDefault();
    if (!boardData) return;
    try {
      let latest = boardData;
      for (const column of boardData.columns) {
        latest = await api(`/api/columns/${column.id}`, {
          method: 'PUT',
          body: JSON.stringify({ wip_limit: wipDraft[column.id] })
        });
      }
      setBoardData(latest);
      setPanel('board');
      showOk('Limites WIP atualizados.');
    } catch (error) {
      showError(error);
    }
  };

  const loadMetrics = async () => {
    if (!boardData) return;
    try {
      const data = await api(`/api/boards/${boardData.board.id}/metrics`);
      setMetrics(data.metrics);
      setPanel('metrics');
    } catch (error) {
      showError(error);
    }
  };

  const cardsByPosition = useMemo(() => {
    if (!boardData) return {};
    const map = {};
    for (const lane of boardData.swimlanes) {
      for (const column of boardData.columns) {
        map[`${lane.id}-${column.id}`] = boardData.cards.filter(
          (card) => card.swimlane_id === lane.id && card.column_id === column.id
        );
      }
    }
    return map;
  }, [boardData]);

  if (!token || !user) {
    return (
      <main className="auth-shell">
        <section className="auth-panel">
          <div className="brand-block">
            <span className="brand-mark">W</span>
            <div>
              <h1>Wiigu</h1>
              <p>Gestao visual de projetos por Kanban</p>
            </div>
          </div>

          <form onSubmit={submitAuth} className="form-stack">
            <h2>{authMode === 'login' ? 'Entrar' : 'Criar conta'}</h2>
            {authMode === 'register' && (
              <label>
                Nome
                <input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              />
            </label>
            {authMode === 'register' && (
              <label>
                Confirmar senha
                <input
                  type="password"
                  value={authForm.confirm}
                  onChange={(event) => setAuthForm({ ...authForm, confirm: event.target.value })}
                />
              </label>
            )}
            {message && <p className="message">{message}</p>}
            <button className="primary" disabled={loading}>
              <CheckCircle2 size={18} />
              {loading ? 'Aguarde' : authMode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <button
            className="ghost"
            onClick={() => {
              setMessage('');
              setAuthMode(authMode === 'login' ? 'register' : 'login');
            }}
          >
            {authMode === 'login' ? 'Criar uma conta' : 'Ja tenho conta'}
          </button>
          {authMode === 'login' &&
            (googleClientId ? (
              <div className="google-signin" id="google-signin" />
            ) : (
              <button className="ghost google-disabled" disabled title="Configure VITE_GOOGLE_CLIENT_ID e GOOGLE_CLIENT_ID">
                <KeyRound size={18} />
                Entrar com Google
              </button>
            ))}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-inline">
          <span className="brand-mark">W</span>
          <div>
            <strong>Wiigu</strong>
            <span>{selectedProject ? selectedProject.name : 'Projetos'}</span>
          </div>
        </div>
        <nav>
          <button className="ghost" onClick={() => setPanel('projects')}>Projetos</button>
          {selectedProject && <button className="ghost" onClick={() => setPanel('boards')}>Quadros</button>}
          {boardData && <button className="ghost" onClick={() => setPanel('board')}>Quadro atual</button>}
        </nav>
        <button className="ghost" onClick={logout} title="Sair">
          <LogOut size={18} />
          Sair
        </button>
      </header>

      {message && (
        <div className="toast">
          <span>{message}</span>
          <button className="icon-button" onClick={() => setMessage('')} title="Fechar mensagem">
            <X size={16} />
          </button>
        </div>
      )}

      {panel === 'projects' && (
        <section className="workspace">
          <aside className="side-panel">
            <h2>{editingProject ? 'Editar projeto' : 'Novo projeto'}</h2>
            <form onSubmit={saveProject} className="form-stack">
              <label>
                Nome
                <input value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} />
              </label>
              <label>
                Descricao
                <textarea
                  value={projectForm.description}
                  onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
                />
              </label>
              <button className="primary">
                <Save size={18} />
                Salvar projeto
              </button>
              {editingProject && (
                <button
                  type="button"
                  className="ghost"
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm(blankProject);
                  }}
                >
                  Cancelar edicao
                </button>
              )}
            </form>
          </aside>

          <section className="content-panel">
            <div className="section-title">
              <div>
                <h2>Projetos</h2>
                <p>{projects.length} projeto(s) disponivel(is)</p>
              </div>
              <button className="ghost" onClick={loadProjects}>Atualizar</button>
            </div>
            <div className="project-grid">
              {projects.map((project) => (
                <article key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <p>{project.description || 'Sem descricao'}</p>
                  <span>{project.board_count} quadro(s)</span>
                  <div className="row-actions">
                    <button className="primary" onClick={() => loadBoards(project)}>
                      <Columns3 size={18} />
                      Abrir
                    </button>
                    <button
                      className="icon-button"
                      onClick={() => {
                        setEditingProject(project);
                        setProjectForm({ name: project.name, description: project.description || '' });
                      }}
                      title="Editar projeto"
                    >
                      <Edit size={18} />
                    </button>
                    <button className="icon-button danger" onClick={() => deleteProject(project)} title="Excluir projeto">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}

      {panel === 'boards' && selectedProject && (
        <section className="workspace">
          <aside className="side-panel">
            <h2>{editingBoard ? 'Editar quadro' : 'Novo quadro'}</h2>
            <p className="hint">As colunas A FAZER, FAZENDO e FEITO sao criadas automaticamente.</p>
            <form onSubmit={saveBoard} className="form-stack">
              <label>
                Nome
                <input value={boardForm.name} onChange={(event) => setBoardForm({ ...boardForm, name: event.target.value })} />
              </label>
              <label>
                Descricao
                <textarea value={boardForm.description} onChange={(event) => setBoardForm({ ...boardForm, description: event.target.value })} />
              </label>
              <button className="primary">
                <Save size={18} />
                Salvar quadro
              </button>
            </form>
          </aside>
          <section className="content-panel">
            <div className="section-title">
              <div>
                <h2>Quadros de {selectedProject.name}</h2>
                <p>{boards.length} quadro(s)</p>
              </div>
            </div>
            <div className="project-grid">
              {boards.map((board) => (
                <article key={board.id} className="project-card">
                  <h3>{board.name}</h3>
                  <p>{board.description || 'Sem descricao'}</p>
                  <div className="row-actions">
                    <button className="primary" onClick={() => loadBoard(board.id)}>
                      <Columns3 size={18} />
                      Abrir
                    </button>
                    <button
                      className="icon-button"
                      onClick={() => {
                        setEditingBoard(board);
                        setBoardForm({ name: board.name, description: board.description || '' });
                      }}
                      title="Editar quadro"
                    >
                      <Edit size={18} />
                    </button>
                    <button className="icon-button danger" onClick={() => deleteBoard(board)} title="Excluir quadro">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      )}

      {panel === 'board' && boardData && (
        <section className="board-view">
          <div className="board-toolbar">
            <div>
              <h2>{boardData.board.name}</h2>
              <p>{boardData.board.description || 'Quadro Kanban'}</p>
            </div>
            <div className="row-actions">
              <button className="secondary" onClick={() => setPanel('lane')}>
                <Plus size={18} />
                Raia
              </button>
              <button className="secondary" onClick={() => openCardForm(boardData.columns[0], boardData.swimlanes[0])}>
                <Plus size={18} />
                Cartao
              </button>
              <button className="secondary" onClick={() => setPanel('wip')}>
                <Columns3 size={18} />
                WIP
              </button>
              <button className="primary" onClick={loadMetrics}>
                <BarChart3 size={18} />
                Metricas
              </button>
            </div>
          </div>

          <div className="kanban">
            {boardData.swimlanes.map((lane) => (
              <section key={lane.id} className="lane-band">
                <div className="lane-title">
                  <h3>{lane.name}</h3>
                  <div className="row-actions">
                    <button
                      className="icon-button"
                      onClick={() => {
                        setEditingLane(lane);
                        setLaneForm({ name: lane.name });
                        setPanel('lane');
                      }}
                      title="Editar raia"
                    >
                      <Edit size={16} />
                    </button>
                    <button className="icon-button danger" onClick={() => deleteLane(lane)} title="Excluir raia">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="columns-grid">
                  {boardData.columns.map((column) => {
                    const cards = cardsByPosition[`${lane.id}-${column.id}`] || [];
                    const columnCount = boardData.cards.filter((card) => card.column_id === column.id).length;
                    const exceeded = column.wip_limit !== null && columnCount >= column.wip_limit;
                    return (
                      <div
                        className={`kanban-column ${exceeded ? 'wip-alert' : ''} ${draggingCardId ? 'drop-ready' : ''}`}
                        key={column.id}
                        onDragOver={(event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(event) => dropCard(event, column, lane)}
                      >
                        <header>
                          <strong>{column.name}</strong>
                          <span>WIP {columnCount}/{column.wip_limit ?? '-'}</span>
                        </header>
                        <button className="add-card" onClick={() => openCardForm(column, lane)}>
                          <Plus size={16} />
                          Cartao
                        </button>
                        <div className="card-list">
                          {cards.map((card) => (
                            <article
                              key={card.id}
                              className={`task-card ${draggingCardId === card.id ? 'dragging' : ''}`}
                              draggable
                              onDragStart={(event) => {
                                event.dataTransfer.effectAllowed = 'move';
                                event.dataTransfer.setData('text/plain', String(card.id));
                                setDraggingCardId(card.id);
                              }}
                              onDragEnd={() => setDraggingCardId(null)}
                            >
                              <div>
                                <strong>{card.code}</strong>
                                <span className={`priority ${card.priority}`}>{card.priority}</span>
                              </div>
                              <h4>{card.title}</h4>
                              <p>{card.assignee_name}</p>
                              <small>{card.due_date}</small>
                              <div className="move-row">
                                {boardData.columns.map((target) => (
                                  <button
                                    key={target.id}
                                    className={target.id === card.column_id ? 'pill active' : 'pill'}
                                    onClick={() => moveCard(card, target.id)}
                                  >
                                    {target.name}
                                  </button>
                                ))}
                              </div>
                              <div className="row-actions">
                                <button className="ghost compact" onClick={() => openCardForm(column, lane, card)}>Editar</button>
                                <button className="ghost compact danger-text" onClick={() => deleteCard(card)}>Excluir</button>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}

      {panel === 'lane' && boardData && (
        <FormPanel title={editingLane ? 'Editar raia' : 'Nova raia'} onBack={() => setPanel('board')}>
          <form onSubmit={saveLane} className="form-stack narrow">
            <label>
              Nome da raia
              <input value={laneForm.name} onChange={(event) => setLaneForm({ name: event.target.value })} />
            </label>
            <button className="primary">
              <Save size={18} />
              Salvar raia
            </button>
          </form>
        </FormPanel>
      )}

      {panel === 'card' && boardData && (
        <FormPanel title={editingCard ? `Editar ${editingCard.code}` : 'Novo cartao'} onBack={() => setPanel('board')}>
          <form onSubmit={saveCard} className="form-grid">
            <label>
              Nome
              <input value={cardForm.title} onChange={(event) => setCardForm({ ...cardForm, title: event.target.value })} />
            </label>
            <label>
              Responsavel
              <input value={cardForm.assignee_name} onChange={(event) => setCardForm({ ...cardForm, assignee_name: event.target.value })} />
            </label>
            <label>
              Data limite
              <input type="date" value={cardForm.due_date} onChange={(event) => setCardForm({ ...cardForm, due_date: event.target.value })} />
            </label>
            <label>
              Prioridade
              <select value={cardForm.priority} onChange={(event) => setCardForm({ ...cardForm, priority: event.target.value })}>
                <option value="baixa">Baixa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </label>
            <label>
              Coluna
              <select value={cardForm.column_id} onChange={(event) => setCardForm({ ...cardForm, column_id: event.target.value })}>
                {boardData.columns.map((column) => (
                  <option value={column.id} key={column.id}>{column.name}</option>
                ))}
              </select>
            </label>
            <label>
              Raia
              <select value={cardForm.swimlane_id} onChange={(event) => setCardForm({ ...cardForm, swimlane_id: event.target.value })}>
                {boardData.swimlanes.map((lane) => (
                  <option value={lane.id} key={lane.id}>{lane.name}</option>
                ))}
              </select>
            </label>
            <label className="span-2">
              Descricao
              <textarea value={cardForm.description} onChange={(event) => setCardForm({ ...cardForm, description: event.target.value })} />
            </label>
            <button className="primary span-2">
              <Save size={18} />
              Salvar cartao
            </button>
          </form>
        </FormPanel>
      )}

      {panel === 'wip' && boardData && (
        <FormPanel title="Limites WIP" onBack={() => setPanel('board')}>
          <form onSubmit={saveWip} className="form-stack narrow">
            {boardData.columns.map((column) => (
              <label key={column.id}>
                {column.name}
                <input
                  type="number"
                  min="0"
                  placeholder="Sem limite"
                  value={wipDraft[column.id]}
                  onChange={(event) => setWipDraft({ ...wipDraft, [column.id]: event.target.value })}
                />
              </label>
            ))}
            <button className="primary">
              <Save size={18} />
              Salvar limites
            </button>
          </form>
        </FormPanel>
      )}

      {panel === 'metrics' && metrics && (
        <FormPanel title="Metricas Kanban" onBack={() => setPanel('board')}>
          <section className="metrics-grid">
            <Metric label="Lead time medio" value={`${metrics.lead_time_avg_days} dias`} />
            <Metric label="Cycle time medio" value={`${metrics.cycle_time_avg_days} dias`} />
            <Metric label="Throughput" value={`${metrics.throughput_7_days} cartoes/7 dias`} />
          </section>
          <section className="content-panel unframed">
            <h3>Work-in-progress</h3>
            <div className="wip-list">
              {metrics.wip.map((item) => (
                <div key={item.column_id}>
                  <strong>{item.column_name}</strong>
                  <span>{item.count}/{item.wip_limit ?? '-'}</span>
                </div>
              ))}
            </div>
            <h3>Cartoes concluidos</h3>
            <table>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome</th>
                  <th>Lead time</th>
                  <th>Cycle time</th>
                </tr>
              </thead>
              <tbody>
                {metrics.completed_cards.map((card) => (
                  <tr key={card.code}>
                    <td>{card.code}</td>
                    <td>{card.title}</td>
                    <td>{card.lead_time_days} dias</td>
                    <td>{card.cycle_time_days} dias</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </FormPanel>
      )}
    </main>
  );
}

function FormPanel({ title, onBack, children }) {
  return (
    <section className="form-page">
      <div className="section-title">
        <h2>{title}</h2>
        <button className="ghost" onClick={onBack}>
          <X size={18} />
          Voltar
        </button>
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

createRoot(document.getElementById('root')).render(<App />);
