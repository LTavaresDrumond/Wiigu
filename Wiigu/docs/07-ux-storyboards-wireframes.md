# Projeto de Interface com o Usuario

## Finalidade

Este documento descreve o projeto de interface do Wiigu por meio de storyboards compostos por wireframes. O objetivo e representar, de forma simples, os principais cenarios de uso do sistema antes da implementacao do prototipo.

## Contexto

O Wiigu e uma aplicacao web para apoio a gestao visual de projetos por Kanban. A interface deve permitir que usuarios autenticados criem projetos, quadros, raias e cartoes, alem de mover cartoes, configurar limite WIP e visualizar metricas.

Cada quadro Kanban do prototipo deve apresentar as colunas obrigatorias `A FAZER`, `FAZENDO` e `FEITO`.

## Principios de interface

- Priorizar clareza e leitura rapida do quadro.
- Usar navegacao direta entre dashboard, projeto, quadro e metricas.
- Evitar telas decorativas sem funcao no fluxo do usuario.
- Exibir informacoes essenciais do cartao: identificador, nome, responsavel, data limite, prioridade e descricao resumida.
- Usar formularios simples para criacao e edicao.
- Mostrar mensagens de erro proximo ao campo ou acao com problema.
- Sinalizar limite WIP diretamente na coluna afetada.

## Mapa de telas

| Codigo | Tela | Finalidade |
| --- | --- | --- |
| WF-01 | Login | Autenticar usuario cadastrado por email e senha ou por Google, quando configurado. |
| WF-02 | Cadastro | Criar conta de usuario. |
| WF-03 | Dashboard de projetos | Listar, criar e acessar projetos. |
| WF-04 | Formulario de projeto | Criar ou editar projeto. |
| WF-05 | Formulario de quadro | Criar ou editar quadro Kanban. |
| WF-06 | Quadro Kanban | Exibir colunas, raias e cartoes. |
| WF-07 | Formulario de raia | Criar ou editar raia. |
| WF-08 | Formulario de cartao | Criar ou editar cartao. |
| WF-09 | Detalhe do cartao | Visualizar dados e mover cartao. |
| WF-10 | Configuracao WIP | Definir limite WIP por coluna. |
| WF-11 | Painel de metricas | Exibir lead time, cycle time, throughput e WIP. |
| WF-12 | Estados de erro | Representar validacoes e mensagens. |

Os wireframes completos estao em `ux/wireframes.md`.

## Storyboards

### SB-01: Cadastro e login

Historias atendidas: HU-01, HU-02, HU-02A e HU-03.

Sequencia de wireframes:

1. WF-01: visitante acessa a tela de login.
2. WF-02: visitante abre cadastro e informa nome, email e senha.
3. WF-01: usuario cadastrado retorna ao login e informa credenciais.
4. WF-03: sistema autentica e exibe o dashboard de projetos.

Resultado esperado: usuario consegue criar conta, autenticar e acessar a area principal.

### SB-02: Criacao de projeto

Historias atendidas: HU-04 e HU-05.

Sequencia de wireframes:

1. WF-03: usuario visualiza dashboard de projetos.
2. WF-04: usuario aciona "Novo projeto" e preenche nome e descricao.
3. WF-03: sistema salva o projeto e atualiza a lista.
4. WF-03: usuario acessa o projeto criado.

Resultado esperado: projeto criado, persistido e disponivel para acesso.

### SB-03: Criacao de quadro Kanban

Historias atendidas: HU-06 e HU-07.

Sequencia de wireframes:

1. WF-03: usuario seleciona um projeto.
2. WF-05: usuario aciona "Novo quadro" e informa nome e descricao.
3. WF-06: sistema cria o quadro com as colunas `A FAZER`, `FAZENDO` e `FEITO`.
4. WF-06: quadro vazio fica pronto para receber raias e cartoes.

Resultado esperado: quadro Kanban criado com as colunas obrigatorias.

### SB-04: Criacao de raia

Historias atendidas: HU-08 e HU-09.

Sequencia de wireframes:

1. WF-06: usuario acessa um quadro.
2. WF-07: usuario aciona "Nova raia" e informa nome.
3. WF-06: sistema adiciona a raia ao quadro.
4. WF-06: usuario visualiza a raia nas tres colunas.

Resultado esperado: raia criada e associada ao quadro.

### SB-05: Criacao de cartao

Historias atendidas: HU-10 e HU-11.

Sequencia de wireframes:

1. WF-06: usuario escolhe coluna e raia.
2. WF-08: usuario informa nome, responsavel, data limite, prioridade e descricao.
3. WF-06: sistema cria o cartao na coluna e raia selecionadas.
4. WF-09: usuario pode abrir o cartao para consultar ou editar detalhes.

Resultado esperado: cartao criado com os dados obrigatorios.

### SB-06: Movimentacao de cartao entre colunas

Historias atendidas: HU-12.

Sequencia de wireframes:

1. WF-06: usuario visualiza cartao em `A FAZER`.
2. WF-06: usuario arrasta o cartao para a coluna de destino ou usa acao de mover.
3. WF-06: sistema move o cartao para `FAZENDO` e registra movimentacao.
4. WF-06: usuario move o cartao para `FEITO` e sistema registra conclusao.

Resultado esperado: cartao muda de coluna e as movimentacoes ficam disponiveis para metricas.

### SB-07: Movimentacao de cartao entre raias

Historias atendidas: HU-13.

Sequencia de wireframes:

1. WF-06: usuario visualiza cartao em uma raia.
2. WF-06: usuario arrasta o cartao para a raia de destino ou seleciona nova raia no formulario.
3. WF-06: sistema reposiciona o cartao na nova raia.
4. WF-06: cartao mantem a coluna atual e seus dados.

Resultado esperado: cartao muda de raia sem perder estado, prioridade ou prazo.

### SB-08: Definicao e alerta de limite WIP

Historias atendidas: HU-14, HU-15 e HU-15A.

Sequencia de wireframes:

1. WF-06: usuario visualiza o quadro.
2. WF-10: usuario define limite WIP para uma coluna.
3. WF-06: sistema mostra o limite no cabecalho da coluna.
4. WF-06: ao atingir ou ultrapassar o limite, a coluna exibe alerta visual.

Resultado esperado: usuario identifica gargalo no fluxo de trabalho.

### SB-09: Visualizacao de metricas Kanban

Historias atendidas: HU-16.

Sequencia de wireframes:

1. WF-06: usuario acessa quadro com cartoes movimentados.
2. WF-11: usuario abre painel de metricas.
3. WF-11: sistema exibe lead time, cycle time, throughput e WIP.
4. WF-11: usuario consulta indicadores do fluxo.

Resultado esperado: metricas exibidas a partir dos dados registrados pelo sistema.

## Rastreabilidade

| Item de UX | Historias | Entidades do banco relacionadas |
| --- | --- | --- |
| WF-01, WF-02 | HU-01, HU-02, HU-02A, HU-03 | `users` |
| WF-03, WF-04 | HU-04, HU-05 | `projects`, `project_members` |
| WF-05, WF-06 | HU-06, HU-07 | `boards`, `board_columns` |
| WF-07 | HU-08, HU-09 | `swimlanes` |
| WF-08, WF-09 | HU-10, HU-11 | `cards` |
| WF-06, WF-09 | HU-12, HU-13 | `cards`, `card_movements` |
| WF-10 | HU-14, HU-15, HU-15A | `board_columns` |
| WF-11 | HU-16 | `cards`, `card_movements`, `board_columns` |

## Revisao de coerencia

A revisao de coerencia esta registrada em `ux/revisao-coerencia.md`. Ela verifica se as telas atendem as historias, se os dados apresentados existem no banco e se os fluxos sao suportados pela arquitetura.

## Criterios de conclusao

Este artefato sera considerado concluido quando:

- cada storyboard descrever um cenario de uso;
- cada storyboard possuir sequencia de wireframes;
- cada wireframe for um esboco simples de tela;
- as telas cobrirem os servicos obrigatorios;
- a rastreabilidade com historias e banco estiver registrada.
