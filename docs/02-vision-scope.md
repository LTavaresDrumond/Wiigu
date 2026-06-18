# Visão & Escopo do Sistema Wiigu

## Finalidade

Este documento apresenta a visão geral do sistema Wiigu, descrevendo o problema que se propõe a resolver, o público interessado (*stakeholders*), o ambiente de uso, as necessidades principais, um resumo de suas funcionalidades e requisitos não funcionais, bem como as delimitações claras do escopo da solução.

## Problema

Equipes pequenas e grupos acadêmicos frequentemente acompanham atividades de projeto por meio de mensagens, planilhas ou anotações dispersas. Essa forma fragmentada de organização dificulta a visualização do andamento do trabalho, a identificação de gargalos, o controle de responsabilidades e a medição do fluxo das entregas.

Quando não existe um quadro visual compartilhado e integrado, tarefas podem ser esquecidas, as responsabilidades ficam pouco claras e a equipe perde a capacidade de acompanhar o progresso real e o estado atual do projeto.

## Posicionamento do Sistema

O Wiigu é uma aplicação *web* de apoio à gestão visual de projetos utilizando a abordagem Kanban. O sistema permite organizar projetos em quadros, dividir o trabalho em raias (*swimlanes*), registrar atividades em cartões, movimentar cartões entre colunas de fluxo e acompanhar métricas básicas do projeto.

O sistema não tem a pretensão de substituir plataformas profissionais completas e de grande escala para gestão de projetos (como Jira ou Azure DevOps). Seu objetivo principal é oferecer um protótipo funcional, com interface simples, coeso e estritamente alinhado aos conceitos de Engenharia de Software, sendo plenamente adequado ao escopo acadêmico do trabalho.

## Stakeholders (Partes Interessadas)

- **Usuário Comum:** Pessoa que acessa o sistema para visualizar projetos, consultar quadros Kanban e acompanhar a evolução geral das atividades.
- **Responsável por Atividade:** Pessoa associada (atribuída) a um cartão. Utiliza o sistema para acompanhar seus prazos, prioridades, descrições e o estado atual da atividade.
- **Gestor do Projeto:** Pessoa com autoridade para organizar quadros, estruturar raias e colunas, definir limites de trabalho em andamento (*WIP limits*) e analisar as métricas de fluxo.
- **Equipe de Desenvolvimento e Manutenção:** Grupo responsável por implementar, testar, manter e evoluir as funcionalidades do sistema e sua infraestrutura.
- **Professor Avaliador:** Parte interessada primária na verificação qualitativa dos artefatos de Engenharia de Software produzidos, na funcionalidade do protótipo e nas evidências de gerenciamento do projeto.

## Ambiente de Uso

O sistema será utilizado através de navegadores *web* modernos, com interface otimizada preferencialmente para ambientes *desktop* ou *notebooks*. O foco do protótipo é demonstrar os serviços principais operando de forma perfeitamente integrada, unindo interface de usuário (UI), regras de negócio e persistência de dados em um ambiente funcional.

## Necessidades Principais

- Autenticar usuários de forma segura.
- Permitir *login* federado com o Google (via OAuth) quando as credenciais estiverem configuradas.
- Criar, editar e gerenciar quadros Kanban.
- Criar, configurar e gerenciar raias verticais/horizontais.
- Cadastrar e detalhar cartões de atividade.
- Movimentar cartões de forma fluida entre colunas e raias.
- Configurar e impor limites de *Work in Progress* (WIP) por coluna.
- Calcular e exibir métricas fundamentais do método Kanban.

## Funcionalidades Resumidas

O Wiigu deve prover gestão de identidade através de cadastro local, *login* e *logout*. Como complemento, o sistema oferecerá a opção de *login* federado com contas Google (OAuth). 

Após a autenticação, o usuário poderá gerenciar seus projetos: criar novos quadros Kanban, definir a estrutura de raias, cadastrar cartões com informações detalhadas e promover a movimentação de atividades conforme a progressão do trabalho. 

Para aderência aos requisitos do domínio, cada quadro Kanban do protótipo deverá instanciar, por padrão, as colunas obrigatórias `A FAZER`, `FAZENDO` e `FEITO`. O sistema também registrará o histórico de eventos de cada cartão em nível de banco de dados, coletando informações suficientes para o cálculo das métricas: *Lead Time*, *Cycle Time*, *Throughput* (Vazão) e *WIP* (Trabalho em Progresso).

## Requisitos Não Funcionais Resumidos

O protótipo deve atender aos seguintes atributos de qualidade:
- **Usabilidade:** A interface deve ser simples, limpa e coerente com a proposta de gestão visual, facilitando o aprendizado rápido por novos usuários.
- **Desempenho (Eficiência):** O sistema deve responder de forma rápida e adequada para as operações comuns de movimentação de cards (drag-and-drop ou ações de clique).
- **Segurança:** O acesso às informações deve ser protegido por autenticação (sessões locais e federadas).
- **Confiabilidade:** Os dados devem ser consistentes e persistidos de forma segura no banco de dados, evitando perda de informações do fluxo de trabalho.

## Escopo da Solução

**Incluído no escopo (In-Scope):**
- Aplicação *web* funcional e navegável;
- Persistência de dados em banco relacional;
- Operações de CRUD (Criar, Ler, Atualizar, Excluir) das principais entidades;
- Implementação das colunas obrigatórias (`A FAZER`, `FAZENDO` e `FEITO`) nos quadros;
- Movimentação de cartões pelo fluxo;
- Implementação de limites WIP;
- Cálculo e exibição de métricas Kanban (*Lead/Cycle Time*);
- *Login* configurável via Google OAuth;
- Todos os documentos de Engenharia de Software exigidos;
- Vídeo demonstrativo com a execução técnica de testes de sistema.

**Fora do escopo (Out-of-Scope):**
- Notificações em tempo real (ex: *WebSockets* ou e-mails transacionais);
- Integrações complexas com sistemas externos (exceção feita apenas à API de autenticação do Google);
- Controle avançado e granular de permissões (RBAC complexo);
- Desenvolvimento de aplicativo móvel nativo (iOS/Android);
- Geração de relatórios analíticos avançados ou gráficos customizáveis.

## Critérios de Conclusão

Este documento será considerado concluído quando todos os elementos exigidos pela especificação da "Visão" estiverem descritos, revisados ortograficamente e quando suas funcionalidades macro estiverem corretamente rastreadas e mapeadas para as Histórias de Usuário, Documentação de Arquitetura, UX, Banco de Dados, Protótipo Funcional e Roteiros de Testes.