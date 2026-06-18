# Projeto Físico da Base de Dados

## Finalidade

Este documento descreve o projeto físico da base de dados do sistema Wiigu. O objetivo é registar a estrutura de persistência, detalhando tabelas, colunas, tipos de dados, chaves (Primárias e Estrangeiras), restrições de nulidade, relacionamentos e o propósito contextual de cada tabela.

## Visão Geral

A base de dados armazena informações relativas a utilizadores, projetos, associações de membros, quadros Kanban, colunas, raias, cartões e o histórico de movimentações. As métricas ágeis (Kanban) são calculadas dinamicamente a partir destes dados, dependendo sobretudo das marcações temporais (*timestamps*) dos cartões e dos registos cronológicos de transição.

> **Nota Arquitetural:** O protótipo utiliza o SGBD **SQLite**. Por conseguinte, os campos de data e hora são armazenados utilizando o tipo `TEXT` (no formato padrão ISO-8601), conforme a especificação do motor.

---

## Dicionário de Dados

### Tabela: `users`
**Propósito:** Armazenar os utilizadores cadastrados e credenciados no sistema.

| Coluna | Tipo | Chave | Obrigatório | Descrição |
| :--- | :--- | :--- | :---: | :--- |
| `id` | INTEGER | PK | Sim | Identificador interno e único do utilizador. |
| `name` | TEXT | - | Sim | Nome de exibição do utilizador. |
| `email` | TEXT | UNIQUE | Sim | Endereço de e-mail utilizado para autenticação. |
| `google_sub` | TEXT | UNIQUE | Não | Identificador da conta Google (usado no *login* federado OAuth). |
| `password_hash` | TEXT | - | Não | *Hash* criptográfico da senha (pode ser nulo se o registo for via Google). |
| `created_at` | TEXT | - | Sim | Data e hora de criação do registo. |

### Tabela: `projects`
**Propósito:** Representar os projetos geridos no ecossistema Wiigu.

| Coluna | Tipo | Chave | Obrigatório | Descrição |
| :--- | :--- | :--- | :---: | :--- |
| `id` | INTEGER | PK | Sim | Identificador interno do projeto. |
| `name` | TEXT | - | Sim | Nome comercial ou título do projeto. |
| `description` | TEXT | - | Não | Descrição detalhada do escopo do projeto. |
| `owner_id` | INTEGER | FK (`users.id`) | Sim | Utilizador criador ou responsável primário pelo projeto. |
| `created_at` | TEXT | - | Sim | Data e hora de criação do projeto. |

### Tabela: `project_members`
**Propósito:** Associar múltiplos utilizadores a múltiplos projetos (Relacionamento N:M).

| Coluna | Tipo | Chave | Obrigatório | Descrição |
| :--- | :--- | :--- | :---: | :--- |
| `id` | INTEGER | PK | Sim | Identificador da associação. |
| `project_id` | INTEGER | FK (`projects.id`) | Sim | Referência do projeto associado. |
| `user_id` | INTEGER | FK (`users.id`) | Sim | Referência do utilizador participante. |
| `role` | TEXT | - | Sim | Papel do utilizador no projeto (ex: *Gestor*, *Membro*). |
| `created_at` | TEXT | - | Sim | Data e hora de criação da associação. |

> **Restrição de Integridade:** A combinação combinada de `project_id` e `user_id` deve ser única (`UNIQUE`), impedindo que o mesmo utilizador seja associado repetidamente ao mesmo projeto.

### Tabela: `boards`
**Propósito:** Armazenar os quadros Kanban pertencentes a um projeto.

| Coluna | Tipo | Chave | Obrigatório | Descrição |
| :--- | :--- | :--- | :---: | :--- |
| `id` | INTEGER | PK | Sim | Identificador interno do quadro. |
| `project_id` | INTEGER | FK (`projects.id`) | Sim | Projeto ao qual o quadro pertence. |
| `name` | TEXT | - | Sim | Nome de identificação do quadro. |
| `description` | TEXT | - | Não | Descrição do propósito do quadro. |
| `created_at` | TEXT | - | Sim | Data e hora de criação do quadro. |

### Tabela: `board_columns`
**Propósito:** Representar as colunas (fases do fluxo de valor) de um quadro Kanban.

| Coluna | Tipo | Chave | Obrigatório | Descrição |
| :--- | :--- | :--- | :---: | :--- |
| `id` | INTEGER | PK | Sim | Identificador interno da coluna. |
| `board_id` | INTEGER | FK (`boards.id`) | Sim | Quadro ao qual a coluna pertence. |
| `name` | TEXT | - | Sim | Nome da coluna (ex: `A FAZER`, `FAZENDO`, `FEITO`). |
| `position` | INTEGER | - | Sim | Ordem de exibição sequencial da coluna da esquerda para a direita. |
| `wip_limit` | INTEGER | - | Não | Número máximo de cartões permitidos (Limite de *Work in Progress*). |
| `created_at` | TEXT | - | Sim | Data e hora de criação da coluna. |

### Tabela: `swimlanes`
**Propósito:** Representar as raias horizontais de separação dentro de um quadro Kanban.

| Coluna | Tipo | Chave | Obrigatório | Descrição |
| :--- | :--- | :--- | :---: | :--- |
| `id` | INTEGER | PK | Sim | Identificador interno da raia. |
| `board_id` | INTEGER | FK (`boards.id`) | Sim | Quadro ao qual a raia pertence. |
| `name` | TEXT | - | Sim | Nome de identificação da raia. |
| `position` | INTEGER | - | Sim | Ordem de exibição vertical da raia. |
| `created_at` | TEXT | - | Sim | Data e hora de criação da raia. |

### Tabela: `cards`
**Propósito:** Armazenar os cartões de atividades (unidades de trabalho).

| Coluna | Tipo | Chave | Obrigatório | Descrição |
| :--- | :--- | :--- | :---: | :--- |
| `id` | INTEGER | PK | Sim | Identificador interno do cartão. |
| `code` | TEXT | UNIQUE | Sim | Código de identificação visual (ex: WIG-101). |
| `board_id` | INTEGER | FK (`boards.id`) | Sim | Quadro ao qual o cartão pertence. |
| `column_id` | INTEGER | FK (`board_columns.id`) | Sim | Coluna atual onde o cartão se encontra. |
| `swimlane_id` | INTEGER | FK (`swimlanes.id`) | Não | Raia atual do cartão (pode não estar atribuído a uma). |
| `title` | TEXT | - | Sim | Nome/Título sumário do cartão. |
| `description` | TEXT | - | Não | Descrição detalhada da atividade. |
| `assignee_id` | INTEGER | FK (`users.id`) | Não | Utilizador responsável pela execução da tarefa. |
| `assignee_name` | TEXT | - | Não | Desnormalização para facilitar a demonstração simples sem *JOIN*. |
| `priority` | TEXT | - | Sim | Nível de prioridade (ex: Baixa, Média, Alta). |
| `due_date` | TEXT | - | Não | Data limite pretendida para conclusão (*Deadline*). |
| `created_at` | TEXT | - | Sim | Data e hora em que o cartão foi instanciado. |
| `started_at` | TEXT | - | Não | Marcação da primeira entrada numa coluna de execução (ex: `FAZENDO`). |
| `completed_at` | TEXT | - | Não | Marcação temporal de entrada na coluna de finalização (ex: `FEITO`). |

### Tabela: `card_movements`
**Propósito:** Registar transações imutáveis de movimentação para garantir a rastreabilidade e permitir a extração de métricas.

| Coluna | Tipo | Chave | Obrigatório | Descrição |
| :--- | :--- | :--- | :---: | :--- |
| `id` | INTEGER | PK | Sim | Identificador interno da movimentação. |
| `card_id` | INTEGER | FK (`cards.id`) | Sim | Referência ao cartão que foi movimentado. |
| `from_column_id` | INTEGER | FK (`board_columns.id`) | Não | Coluna de origem (nulo se for criação). |
| `to_column_id` | INTEGER | FK (`board_columns.id`) | Não | Coluna de destino (nulo se for exclusão). |
| `from_swimlane_id` | INTEGER | FK (`swimlanes.id`) | Não | Raia de origem. |
| `to_swimlane_id` | INTEGER | FK (`swimlanes.id`) | Não | Raia de destino. |
| `moved_at` | TEXT | - | Sim | Marcação temporal exata da transação de movimentação. |

---

## Relacionamentos Principais (Cardinalidade)

- **1:N** – Um utilizador (`users`) pode ser detentor de vários projetos (`projects`).
- **N:M** – Um projeto possui vários membros e um utilizador participa em vários projetos (resolvido pela tabela associativa `project_members`).
- **1:N** – Um projeto (`projects`) pode conter múltiplos quadros (`boards`).
- **1:N** – Um quadro (`boards`) contém múltiplas colunas (`board_columns`) e múltiplas raias (`swimlanes`).
- **1:N** – Um quadro (`boards`) contém múltiplos cartões (`cards`).
- **1:N** – Um cartão (`cards`) tem uma chave estrangeira para uma coluna e uma raia específica.
- **1:N** – Um cartão (`cards`) gera vários registos históricos de transição (`card_movements`).

## Diagrama Físico de Entidade-Relacionamento (ERD)

```mermaid
erDiagram
    users ||--o{ projects : "owns (1:N)"
    users ||--o{ project_members : "participates (1:N)"
    projects ||--o{ project_members : "has (1:N)"
    projects ||--o{ boards : "contains (1:N)"
    boards ||--o{ board_columns : "has (1:N)"
    boards ||--o{ swimlanes : "has (1:N)"
    boards ||--o{ cards : "contains (1:N)"
    board_columns ||--o{ cards : "holds (1:N)"
    swimlanes ||--o{ cards : "holds (1:N)"
    users ||--o{ cards : "assigned_to (1:N)"
    cards ||--o{ card_movements : "generates (1:N)"
    board_columns ||--o{ card_movements : "from_or_to (1:N)"
    swimlanes ||--o{ card_movements : "from_or_to (1:N)"