# Projeto de Interface com o Usuário (UI/UX)

## Finalidade

Este documento descreve o projeto de interface do sistema Wiigu por meio de *Storyboards* compostos pelo mapeamento de *Wireframes*. O objetivo é representar, de forma clara e sequencial, os principais cenários de uso e fluxos de interação do sistema antes da implementação final do protótipo no código.

## Contexto

O Wiigu é uma aplicação *web* voltada para o apoio à gestão visual de projetos utilizando o método Kanban. A interface deve permitir que usuários autenticados criem projetos, estruturem quadros, gerenciem raias (*swimlanes*) e cartões, além de movimentar tarefas, configurar limites WIP (*Work in Progress*) e visualizar métricas dinâmicas.

Para conformidade com os requisitos de negócio, cada quadro Kanban renderizado pelo protótipo deve apresentar, por padrão, as colunas obrigatórias: `A FAZER`, `FAZENDO` e `FEITO`.

## Princípios de Design de Interface

- Priorizar a **clareza cognitiva** e a leitura rápida e escaneável do quadro.
- Utilizar uma **navegação direta** e fluida entre *dashboard*, projetos, quadros e o painel de métricas.
- Evitar telas decorativas ou modais que não tenham função prática no fluxo de valor do usuário (*design minimalista*).
- Exibir, na visão geral, as **informações essenciais do cartão**: código identificador, título, responsável, data limite, prioridade e descrição resumida.
- Utilizar **formulários simples**, enxutos e de rápido preenchimento para ações de criação e edição.
- Fornecer **feedback visual imediato**, mostrando mensagens de erro exatas próximas ao campo ou ação que gerou o problema.
- Sinalizar o **alerta de limite WIP** de maneira destacada, diretamente no cabeçalho da coluna afetada.

## Mapa de Telas (*Wireframes*)

| Código | Tela | Finalidade do Componente/View |
| :--- | :--- | :--- |
| **WF-01** | *Login* | Autenticar o usuário cadastrado por e-mail e senha (local) ou via conta Google (OAuth). |
| **WF-02** | Cadastro | Formulário de criação de uma nova conta de usuário. |
| **WF-03** | *Dashboard* de Projetos | Listar de forma resumida, criar e acessar os projetos do usuário. |
| **WF-04** | Modal/Formulário de Projeto | Criar ou editar as informações de um projeto. |
| **WF-05** | Modal/Formulário de Quadro | Criar ou editar as configurações de um quadro Kanban. |
| **WF-06** | Quadro Kanban (*Main View*) | Exibir o fluxo visual contendo as colunas, raias e os cartões ativos. |
| **WF-07** | Modal/Formulário de Raia | Criar ou editar o título de uma raia horizontal. |
| **WF-08** | Modal/Formulário de Cartão | Formulário para criar ou editar os dados de um cartão de atividade. |
| **WF-09** | Detalhe do Cartão | Visualizar todos os dados integrados e permitir ações de movimentação ou edição. |
| **WF-10** | Configuração de WIP | Definir ou alterar o limite numérico WIP de uma coluna específica. |
| **WF-11** | Painel de Métricas | Exibir painel analítico com *Lead Time, Cycle Time, Throughput* e estado do WIP. |
| **WF-12** | Estados de Erro/Alerta | Componentes globais (*Toasts* ou Modais) para representar validações e mensagens do sistema. |

> **Nota:** Os *wireframes* desenhados (esboços visuais) que compõem estas telas encontram-se documentados no arquivo anexo `ux/wireframes.md`.

---

## Storyboards (Fluxos de Uso)

### SB-01: Cadastro e Autenticação
- **Histórias Atendidas:** HU-01, HU-02, HU-02A e HU-03.
- **Sequência de Interação:**
  1. **[WF-01]** Visitante aciona a aplicação e visualiza a tela de *login*.
  2. **[WF-02]** Visitante navega para a rota de cadastro e preenche nome, e-mail e senha.
  3. **[WF-01]** O sistema redireciona o usuário (agora cadastrado) para o *login*, onde ele insere as suas credenciais.
  4. **[WF-03]** O sistema autentica o usuário e carrega o *Dashboard* de projetos.
- **Resultado Esperado:** O usuário consegue criar a conta, autenticar-se na sessão e acessar a área privada (*Dashboard*).

### SB-02: Criação de Projeto
- **Histórias Atendidas:** HU-04 e HU-05.
- **Sequência de Interação:**
  1. **[WF-03]** Usuário visualiza o *Dashboard* vazio (ou com projetos anteriores).
  2. **[WF-04]** Usuário clica no botão "Novo Projeto", abrindo um modal onde preenche o nome e a descrição.
  3. **[WF-03]** O sistema processa o *submit*, salva o projeto e atualiza dinamicamente a lista na tela.
  4. **[WF-03]** Usuário clica no *card* do projeto recém-criado para acessá-lo.
- **Resultado Esperado:** Projeto instanciado com sucesso e disponível para a adição de quadros.

### SB-03: Criação de Quadro Kanban
- **Histórias Atendidas:** HU-06 e HU-07.
- **Sequência de Interação:**
  1. **[WF-03]** Usuário seleciona o projeto desejado.
  2. **[WF-05]** Usuário clica em "Novo Quadro" e informa o título do quadro.
  3. **[WF-06]** O sistema redireciona o usuário para a interface principal do Quadro Kanban, já exibindo as três colunas padrão: `A FAZER`, `FAZENDO` e `FEITO`.
  4. **[WF-06]** A interface aguarda interações para a criação de raias e inserção de cartões.
- **Resultado Esperado:** O quadro é instanciado respeitando a arquitetura obrigatória do projeto.

### SB-04: Criação de Raia (*Swimlane*)
- **Histórias Atendidas:** HU-08 e HU-09.
- **Sequência de Interação:**
  1. **[WF-06]** Usuário acessa um quadro existente.
  2. **[WF-07]** Usuário aciona a funcionalidade "Adicionar Raia" e define o seu nome.
  3. **[WF-06]** O sistema atualiza o *layout* (UI), desenhando a raia horizontalmente, intercetando as três colunas verticais.
- **Resultado Esperado:** A segmentação visual do quadro é implementada corretamente.

### SB-05: Criação de Cartão de Atividade
- **Histórias Atendidas:** HU-10 e HU-11.
- **Sequência de Interação:**
  1. **[WF-06]** Usuário identifica a coluna (e raia) de destino e clica em "+ Cartão".
  2. **[WF-08]** Abre-se um formulário onde o usuário preenche: título, responsável, data limite, prioridade e descrição.
  3. **[WF-06]** O componente visualiza o novo cartão posicionado na respectiva coluna.
  4. **[WF-09]** O usuário pode clicar no cartão a qualquer momento para abrir os seus detalhes ou editá-los.
- **Resultado Esperado:** Atividade registada com os dados contextuais.

### SB-06: Movimentação de Cartão Entre Colunas (*Drag-and-Drop*)
- **Histórias Atendidas:** HU-12.
- **Sequência de Interação:**
  1. **[WF-06]** Usuário visualiza o cartão alocado na coluna `A FAZER`.
  2. **[WF-06]** Usuário clica, arrasta (*drag*) o cartão e o solta (*drop*) na área da coluna `FAZENDO`.
  3. **[WF-06]** O sistema atualiza a posição do *card* na interface e dispara a requisição à API para registar a transação.
  4. **[WF-06]** Posteriormente, o processo repete-se para mover o cartão para a coluna `FEITO`.
- **Resultado Esperado:** O ciclo de vida do cartão progride no fluxo, gerando as marcações temporais (histórico) que nutrem as métricas.

### SB-07: Movimentação de Cartão Entre Raias
- **Histórias Atendidas:** HU-13.
- **Sequência de Interação:**
  1. **[WF-06]** Usuário identifica a necessidade de reatribuir o contexto e arrasta verticalmente o cartão para uma nova raia (ou edita via formulário).
  2. **[WF-06]** A interface reposiciona o cartão.
  3. **[WF-06]** O sistema garante que a coluna atual (estado de progresso) e as propriedades originais permaneçam intactas.
- **Resultado Esperado:** Organização espacial ajustada sem a perda de *status* ou prazos.

### SB-08: Configuração e Alerta de Limite WIP
- **Histórias Atendidas:** HU-14, HU-15 e HU-15A.
- **Sequência de Interação:**
  1. **[WF-06]** Usuário visualiza o quadro e clica no ícone de configuração de uma coluna (ex: `FAZENDO`).
  2. **[WF-10]** No formulário, o usuário insere um limite WIP (ex: 3 cartões).
  3. **[WF-06]** A interface atualiza o cabeçalho da coluna mostrando algo como "(2/3)".
  4. **[WF-06]** Caso o limite seja excedido ao mover um 4º cartão, a coluna muda de cor (alerta visual) e o sistema bloqueia a ação, emitindo uma notificação **[WF-12]**.
- **Resultado Esperado:** O utilizador recebe *feedback* visual imediato sobre os gargalos da operação.

### SB-09: Visualização do Painel de Métricas
- **Histórias Atendidas:** HU-16.
- **Sequência de Interação:**
  1. **[WF-06]** Usuário navega por um quadro que já possui histórico de transações.
  2. **[WF-11]** Usuário clica no botão de "Métricas" (ou "Estatísticas").
  3. **[WF-11]** O sistema renderiza o modal ou página de *dashboard* apresentando os KPIs numéricos: *Lead Time, Cycle Time, Throughput* e estado atual do *WIP*.
- **Resultado Esperado:** Acesso às métricas ágeis baseadas na consistência real do banco de dados.

---

## Matriz de Rastreabilidade

Esta matriz atesta o alinhamento arquitetural ponta a ponta do projeto, ligando a Interface de Usuário (UX), as Regras de Negócio (HU) e o Modelo de Dados Físico (Banco).

| Itens de UX (Telas) | Histórias de Usuário | Entidades do Banco Relacionadas |
| :--- | :--- | :--- |
| **WF-01, WF-02** | HU-01, HU-02, HU-02A, HU-03 | `users` |
| **WF-03, WF-04** | HU-04, HU-05 | `projects`, `project_members` |
| **WF-05, WF-06** | HU-06, HU-07 | `boards`, `board_columns` |
| **WF-07** | HU-08, HU-09 | `swimlanes` |
| **WF-08, WF-09** | HU-10, HU-11 | `cards` |
| **WF-06, WF-09** | HU-12, HU-13 | `cards`, `card_movements` |
| **WF-10** | HU-14, HU-15, HU-15A | `board_columns` |
| **WF-11** | HU-16 | `cards`, `card_movements`, `board_columns` |

## Revisão de Coerência

A revisão de coerência completa encontra-se documentada de forma extensa no arquivo anexo `ux-revisao-coerencia.`. Esta revisão tem como premissa validar se o roteiro visual das telas atende satisfatoriamente às Histórias, se os dados ali ilustrados possuem representação física no banco e se os fluxos projetados estão suportados pelas restrições do Caderno de Arquitetura.