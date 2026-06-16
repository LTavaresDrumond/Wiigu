# Plano de Execucao do Trabalho

## Objetivo

Este plano organiza a execucao do trabalho de Engenharia de Software do sistema Wiigu. O objetivo e concluir todos os artefatos avaliativos, manter coerencia entre documentacao, UX e prototipo, e produzir evidencias de gerenciamento no Agiflow.

## Estrategia geral

O trabalho sera conduzido em quatro sprints curtas, com fluxo Kanban continuo. A divisao em sprints ajuda a planejar entregas incrementais, enquanto o Kanban registra o estado real das atividades.

## Sprint 1: Fundamentacao

Entregas:

- guia de escrita e padronizacao;
- processo de gerenciamento do projeto;
- Vision & Scope;
- requisitos nao funcionais;
- primeiras historias de usuario.

Resultado esperado: escopo comum aprovado para orientar UX, arquitetura e desenvolvimento.

## Sprint 2: Modelagem

Entregas:

- historias de usuario completas;
- Architecture Notebook;
- arquitetura tecnica do prototipo;
- projeto fisico do banco de dados;
- diagrama fisico do banco.

Resultado esperado: base tecnica consistente para orientar prototipo e testes.

## Sprint 3: UX e Prototipo

Entregas:

- storyboards dos cenarios principais;
- wireframes das telas;
- prototipo funcional com CRUDs, movimentacao de cartoes, limite WIP e metricas Kanban.

Resultado esperado: sistema demonstravel, coerente com requisitos e interface.

## Sprint 4: Consolidacao

Entregas:

- roteiro de teste de sistema;
- execucao dos testes;
- documento de infraestrutura;
- video demonstrativo;
- documento de distribuicao dos artefatos por membro da equipe;
- revisao cruzada dos artefatos;
- ZIP final.

Resultado esperado: entrega completa, revisada e alinhada aos criterios de avaliacao.

## Frentes de trabalho

### Documentacao

Responsavel por produzir e revisar os artefatos textuais:

- gerenciamento do projeto;
- Vision;
- requisitos nao funcionais;
- historias de usuario;
- Architecture Notebook;
- infraestrutura;
- roteiro de testes.

### UX

Responsavel por transformar requisitos em fluxos visuais:

- storyboards;
- wireframes;
- mensagens de erro e validacao;
- coerencia entre telas, historias e entidades do banco.

### Desenvolvimento

Responsavel pelo prototipo funcional:

- autenticacao;
- CRUD de projetos;
- CRUD de quadros;
- CRUD de raias;
- CRUD de cartoes;
- movimentacao entre colunas e raias;
- limite WIP;
- metricas de lead time, cycle time, throughput e WIP.

## Dependencias principais

1. UX depende de Vision e historias de usuario.
2. Banco depende de requisitos e entidades definidas.
3. Prototipo depende de arquitetura, banco e wireframes.
4. Testes dependem do prototipo implementado.
5. Video depende dos testes de sistema.
6. Documentos em PDF dependem da revisao textual final.
7. ZIP depende da revisao final de todos os artefatos.

## Entrega final

Os documentos textuais devem ser exportados em PDF. Todos os artefatos construidos devem ser incluidos em arquivo ZIP nomeado no formato `ESW-A-B-C-D-E-F.ZIP`, substituindo as letras pelos numeros de matricula dos autores do trabalho, conforme quantidade de integrantes.

Antes do envio, o ZIP deve ser testado quanto a descompactacao e deve conter, no minimo:

- documentos em PDF;
- prototipo;
- video ou link do video;
- evidencias do gerenciamento;
- documento informando a distribuicao dos artefatos por membro da equipe.
