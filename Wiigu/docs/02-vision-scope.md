# Vision & Scope do Sistema Wiigu

## Finalidade

Este documento apresenta a visao geral do sistema Wiigu, seu problema, publico interessado, ambiente de uso, necessidades, funcionalidades principais, requisitos nao funcionais resumidos e escopo da solucao.

## Problema

Equipes pequenas e grupos academicos frequentemente acompanham atividades de projeto por mensagens, planilhas ou anotacoes dispersas. Essa forma de organizacao dificulta visualizar o andamento do trabalho, identificar gargalos, controlar responsabilidades e medir o fluxo das entregas.

Quando nao existe um quadro visual compartilhado, tarefas podem ficar esquecidas, responsabilidades ficam pouco claras e a equipe perde capacidade de acompanhar o progresso real do projeto.

## Posicionamento do sistema

O Wiigu e uma aplicacao web de apoio a gestao visual de projetos por Kanban. O sistema permite organizar projetos em quadros, dividir o trabalho em raias, registrar atividades em cartoes, mover cartoes entre colunas e acompanhar metricas basicas do fluxo.

O sistema nao pretende substituir plataformas profissionais completas de gestao de projetos. Seu objetivo e oferecer um prototipo funcional, simples e coerente com os conceitos de Engenharia de Software, adequado ao escopo academico do trabalho.

## Stakeholders

### Usuario comum

Pessoa que acessa o sistema para visualizar projetos, consultar quadros e acompanhar atividades.

### Responsavel por atividade

Pessoa associada a um cartao. Usa o sistema para acompanhar prazos, prioridade, descricao e estado da atividade.

### Gestor do projeto

Pessoa que organiza quadros, raias, colunas, limites WIP e acompanha metricas de fluxo.

### Equipe de desenvolvimento e manutencao

Responsavel por implementar, testar, manter e evoluir o sistema.

### Professor avaliador

Parte interessada na verificacao dos artefatos de Engenharia de Software, do prototipo funcional e das evidencias de gerenciamento.

## Ambiente de uso

O sistema sera usado em navegador web, preferencialmente em ambiente desktop ou notebook. O foco do prototipo e demonstrar os servicos principais de forma integrada, com interface, regra de negocio e persistencia funcionando em conjunto.

## Necessidades principais

- Autenticar usuarios.
- Permitir login federado com Google quando houver credenciais configuradas.
- Criar e gerenciar quadros Kanban.
- Criar e gerenciar raias.
- Criar e gerenciar cartoes de atividade.
- Mover cartoes entre colunas.
- Mover cartoes entre raias.
- Definir limite WIP por coluna.
- Visualizar metricas Kanban.

## Funcionalidades resumidas

O Wiigu deve permitir cadastro, login local e logout. Quando houver credenciais OAuth configuradas, o sistema tambem pode permitir login federado com Google. Apos autenticado, o usuario deve acessar projetos, criar quadros Kanban, configurar raias, cadastrar cartoes e movimentar atividades conforme o andamento do trabalho.

Cada quadro Kanban do prototipo deve conter as colunas obrigatorias `A FAZER`, `FAZENDO` e `FEITO`. O sistema tambem deve registrar informacoes suficientes para calcular lead time, cycle time, throughput e work-in-progress.

## Requisitos nao funcionais resumidos

O prototipo deve ser simples de usar, responder de forma adequada para operacoes comuns, proteger o acesso por autenticacao basica e manter os dados persistidos. A interface deve ser coerente, legivel e compativel com a proposta de gestao visual.

## Escopo da solucao

Incluido no escopo:

- aplicacao web funcional;
- persistencia de dados;
- CRUD das principais entidades;
- colunas obrigatorias A FAZER, FAZENDO e FEITO em cada quadro;
- movimentacao de cartoes;
- limite WIP;
- metricas Kanban;
- login Google configuravel como complemento de autenticacao;
- documentos de Engenharia de Software exigidos;
- video demonstrativo com testes de sistema.

Fora do escopo:

- notificacoes em tempo real;
- integracoes externas obrigatorias para executar os servicos principais;
- controle avancado de permissoes;
- aplicativo movel nativo;
- relatorios analiticos avancados.

## Criterios de conclusao

Este documento estara concluido quando todos os elementos exigidos pelo Vision estiverem descritos e quando suas funcionalidades estiverem rastreadas para historias de usuario, UX, banco, prototipo e testes.
