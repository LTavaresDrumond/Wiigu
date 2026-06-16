# Revisao de Coerencia entre UX, Requisitos e Arquitetura

## Finalidade

Este documento registra a revisao do projeto de interface do Wiigu em relacao aos requisitos, arquitetura e projeto fisico do banco de dados.

## Coerencia com historias de usuario

| Historia | Cobertura na UX | Situacao |
| --- | --- | --- |
| HU-01 | WF-02 | Coberta |
| HU-02 | WF-01 | Coberta |
| HU-02A | WF-01 | Coberta |
| HU-03 | WF-01, WF-03 | Coberta |
| HU-04 | WF-03, WF-04 | Coberta |
| HU-05 | WF-03, WF-04 | Coberta |
| HU-06 | WF-05, WF-06 | Coberta |
| HU-07 | WF-05, WF-06 | Coberta |
| HU-08 | WF-06, WF-07 | Coberta |
| HU-09 | WF-06, WF-07 | Coberta |
| HU-10 | WF-06, WF-08 | Coberta |
| HU-11 | WF-08, WF-09 | Coberta |
| HU-12 | WF-06, WF-09 | Coberta |
| HU-13 | WF-06, WF-09 | Coberta |
| HU-14 | WF-10 | Coberta |
| HU-15 | WF-06, WF-10 | Coberta |
| HU-15A | WF-06, WF-10 | Coberta |
| HU-16 | WF-11 | Coberta |

## Coerencia com banco de dados

- Login e cadastro usam dados da tabela `users`.
- Login Google opcional usa `users.google_sub` quando houver credencial OAuth configurada.
- Dashboard e formulario de projeto usam `projects` e `project_members`.
- Formulario de quadro usa `boards` e inicializa `board_columns`.
- Quadro Kanban usa `boards`, `board_columns`, `swimlanes` e `cards`.
- Formulario de cartao usa os campos obrigatorios de `cards`.
- Movimentacao de cartao usa `cards` e `card_movements`.
- Limite WIP usa `board_columns.wip_limit`.
- Metricas usam `cards.created_at`, `cards.started_at`, `cards.completed_at` e `card_movements.moved_at`.

## Coerencia com arquitetura

- A UX pressupoe aplicacao web, coerente com a arquitetura.
- As telas separam apresentacao de regras de negocio, pois calculo de metricas e validacoes ficam no sistema, nao no desenho da tela.
- O fluxo de quadro respeita a criacao automatica das colunas `A FAZER`, `FAZENDO` e `FEITO`.
- O painel de metricas depende do registro de movimentacoes, conforme decisao arquitetural.

## Ajustes recomendados antes do prototipo

- Manter os nomes das colunas exatamente como `A FAZER`, `FAZENDO` e `FEITO`.
- Manter os campos obrigatorios do cartao no formulario.
- Exibir limite WIP no cabecalho da coluna e bloquear movimentacoes que ultrapassem o limite.
- Permitir arrastar cartoes no quadro, preservando as mesmas regras de movimentacao do formulario.
- Implementar painel de metricas como tela ou painel acessivel a partir do quadro.

## Conclusao

Os storyboards e wireframes cobrem os servicos obrigatorios do trabalho pratico e estao coerentes com requisitos, arquitetura e banco de dados.
