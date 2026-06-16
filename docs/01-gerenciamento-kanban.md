# Gerenciamento do Projeto Wiigu no Kanban

## Finalidade

Este documento descreve como o trabalho de desenvolvimento do Wiigu sera gerenciado. O objetivo e registrar o processo usado pela equipe, as colunas do quadro Kanban, os tipos de cartoes e os criterios usados para acompanhar a evolucao do projeto.

## Contexto

O Wiigu e um sistema de apoio a gestao de projetos por Kanban. O nome foi adotado pela equipe por remeter a ideia de uniao, colaboracao e trabalho em conjunto. No contexto do sistema, essa ideia representa pessoas, atividades e projetos reunidos em um fluxo visual de acompanhamento.

O projeto sera conduzido de forma iterativa e incremental. Cada ciclo de trabalho deve gerar um incremento verificavel: um documento revisado, uma decisao arquitetural registrada, uma tela especificada, uma funcionalidade implementada ou uma evidencia de teste.

Neste trabalho, existem dois usos do termo Kanban. O primeiro e o Kanban usado pela equipe para gerenciar a execucao do trabalho academico no Agiflow. O segundo e o Kanban implementado pelo proprio sistema Wiigu, no qual cada quadro do usuario deve possuir as colunas obrigatorias `A FAZER`, `FAZENDO` e `FEITO`.

## Abordagem de gerenciamento

A equipe usa o Agiflow como quadro Kanban do projeto. O quadro registra as atividades do trabalho academico e funciona como evidencia de gerenciamento.

A abordagem combina:

- Kanban, para visualizar fluxo, gargalos e estado de cada atividade;
- praticas ageis inspiradas em Scrum, principalmente planejamento em sprints curtas e revisao ao final de cada ciclo;
- conceitos do PMBOK, como controle de escopo, acompanhamento de prazo, gestao de qualidade, comunicacao e riscos;
- areas do SWEBOK, como requisitos, design, construcao, testes, qualidade e gerenciamento de projeto.

O processo nao e tratado como Scrum completo, pois nao ha definicao formal de papeis como Scrum Master e Product Owner. A escolha foi usar um processo simples, adequado ao tamanho do trabalho, com foco em rastreabilidade e entrega dos artefatos avaliativos.

## Colunas do quadro

As colunas descritas abaixo pertencem ao quadro de gerenciamento do trabalho academico no Agiflow.

### Planning

Representa atividades planejadas, mas ainda nao prontas para execucao. Nesta coluna ficam itens que precisam de refinamento, criterios de aceite ou confirmacao de prioridade.

### Todo

Representa atividades prontas para serem executadas. Um cartao so deve entrar em `Todo` quando tiver descricao suficiente, prioridade definida e criterio claro de conclusao.

### In Progress

Representa atividades em execucao. A equipe deve evitar manter muitas tarefas simultaneas nesta coluna, pois isso aumenta o risco de atraso e retrabalho.

### Testing

Representa atividades que precisam de verificacao. Para documentos, essa coluna indica revisao de consistencia, linguagem e aderencia ao enunciado. Para o prototipo, indica execucao de testes funcionais.

### Review

Representa atividades prontas para revisao final. Nesta etapa, o foco e conferir se o item atende aos criterios de avaliacao e se esta coerente com os demais artefatos.

### Done

Representa atividades concluidas e verificadas. Um cartao so deve ir para `Done` quando houver evidencia produzida e quando os criterios de aceite forem atendidos.

### Blocked

Representa atividades impedidas por falta de informacao, dependencia externa, decisao pendente ou problema tecnico.

## Tipos de cartao

Os cartoes do projeto foram organizados por frente de trabalho:

- gerenciamento;
- requisitos;
- arquitetura;
- banco de dados;
- UX;
- desenvolvimento;
- testes;
- entrega final.

Cada cartao deve conter titulo, descricao, prioridade, tags, frente de trabalho e criterio de conclusao. Essa padronizacao permite acompanhar o progresso e facilita a divisao entre as frentes de documentacao, UX e desenvolvimento.

## Work units no Agiflow

As tarefas foram agrupadas em seis unidades de trabalho:

1. Gestao do Projeto ESW.
2. Requisitos do Sistema Wiigu.
3. Arquitetura e Projeto Fisico.
4. Projeto de Interface e UX.
5. Prototipo Funcional do Wiigu.
6. Testes, Video e Entrega Final.

Essa divisao separa as responsabilidades sem perder a integracao entre os artefatos. A frente de requisitos orienta arquitetura e UX. A arquitetura e o banco orientam o desenvolvimento. O prototipo implementado orienta testes, video e infraestrutura.

## Criterios de conclusao do gerenciamento

O gerenciamento do projeto sera considerado concluido quando:

- o quadro Kanban estiver criado no Agiflow;
- as colunas do fluxo estiverem descritas;
- os cartoes principais do trabalho estiverem registrados;
- cada cartao tiver descricao, prioridade e frente de trabalho;
- os documentos finais citarem o mesmo processo de gerenciamento.

## Informacao registrada em cada cartao

Cada cartao do Agiflow deve registrar:

- titulo da atividade;
- descricao do trabalho;
- frente de trabalho;
- prioridade;
- status;
- criterios de aceite;
- artefato relacionado, quando aplicavel.

Esse registro atende a instrucao de prover informacao sobre cada cartao criado para o gerenciamento do projeto.
