# Gerenciamento do Projeto Wiigu no Kanban

## Finalidade

Este documento descreve como o trabalho de desenvolvimento do sistema Wiigu será gerenciado. O objetivo é registrar o processo metodológico adotado pela equipe, a configuração das colunas do quadro Kanban, as tipologias de cartões de trabalho e os critérios utilizados para acompanhar e auditar a evolução do projeto acadêmico.

## Contexto

O Wiigu é um sistema de apoio à gestão de projetos baseado na metodologia Kanban. O nome foi adotado pela equipe por remeter à ideia de união, colaboração e trabalho em conjunto. No contexto do sistema, essa ideia representa pessoas, atividades e projetos reunidos em um fluxo visual de acompanhamento transparente.

O projeto será conduzido de forma iterativa e incremental. Cada ciclo de trabalho deve gerar um incremento verificável: um documento revisado, uma decisão arquitetural registrada, uma tela especificada, uma funcionalidade implementada ou uma evidência de teste executado.

Neste trabalho, é fundamental distinguir dois usos do termo "Kanban":
1. **Kanban de Gerenciamento:** O quadro adotado pela equipe para gerenciar a execução do trabalho acadêmico (operacionalizado na ferramenta Agiflow).
2. **Kanban do Sistema:** A funcionalidade central implementada pelo próprio software Wiigu, no qual cada quadro de usuário deve possuir as colunas obrigatórias `A FAZER`, `FAZENDO` e `FEITO`.

## Abordagem de Gerenciamento

A equipe utiliza a ferramenta Agiflow como quadro Kanban do projeto. O quadro registra todas as atividades do escopo acadêmico e funciona como o principal artefato de evidência de gerenciamento.

A abordagem combina práticas consagradas na Engenharia de Software:
- **Kanban:** Para visualização do fluxo de valor, identificação de gargalos e monitoramento do estado de cada atividade.
- **Práticas Ágeis (inspiradas no *Scrum*):** Planejamento estruturado em iterações curtas (*sprints*) e revisão técnica ao final de cada ciclo de entrega.
- **Conceitos do PMBOK:** Controle de escopo, acompanhamento de prazos, gestão da qualidade, plano de comunicação e mitigação de riscos.
- **Áreas de Conhecimento do SWEBOK:** Requisitos, *design*, construção, testes, qualidade e gerenciamento de projeto.

O processo adota uma abordagem adaptada e enxuta, sem a atribuição formal de papéis rígidos (como *Scrum Master* ou *Product Owner*). A escolha priorizou um modelo ágil adequado ao escopo e tempo do trabalho acadêmico, com foco na rastreabilidade e na qualidade da entrega dos artefatos avaliativos.

## Colunas do Quadro (Fluxo de Trabalho)

As etapas descritas abaixo compõem o quadro de gerenciamento do trabalho acadêmico no Agiflow, mapeando o ciclo de vida das tarefas:

- **Planning (Planejamento):** Representa atividades mapeadas, mas que ainda não estão prontas para execução. Contém itens que necessitam de refinamento, definição de critérios de aceite ou confirmação de prioridade.
- **Todo (A Fazer):** Representa atividades refinadas e prontas para execução. Um cartão só avança para `Todo` quando possui descrição suficiente, prioridade estabelecida e critério claro de conclusão.
- **In Progress (Em Progresso):** Representa atividades atualmente em execução pela equipe. Mantém-se um limite de trabalho em andamento (*WIP - Work in Progress*) para evitar gargalos, atrasos e retrabalho.
- **Testing (Em Verificação/Testes):** Representa atividades concluídas que exigem verificação. Para documentos textuais, indica a etapa de revisão de consistência, coesão, ortografia e aderência aos requisitos. Para o protótipo, indica a execução dos testes sistêmicos e funcionais.
- **Review (Revisão Final):** Representa atividades prontas para aprovação final. O foco nesta etapa é assegurar que o artefato atende plenamente aos critérios de avaliação da disciplina e mantém coerência com a base documental e o código.
- **Done (Concluído):** Representa atividades finalizadas e validadas. O cartão só é movido para `Done` após a geração da evidência correspondente e validação total dos critérios de aceite.
- **Blocked (Impedido):** Representa atividades paralisadas temporariamente devido à falta de informações, dependências externas a outras tarefas, decisões pendentes ou impedimentos técnicos.

## Tipos de Cartão e Frentes de Trabalho

Os cartões (tarefas) do projeto foram categorizados logicamente por frentes de atuação para facilitar a rastreabilidade:

- Gestão e Gerenciamento;
- Engenharia de Requisitos;
- Arquitetura de Software;
- Modelagem de Banco de Dados;
- *Design* de Interface (UX/UI);
- Desenvolvimento (Construção);
- Qualidade e Testes;
- Empacotamento e Entrega Final.

Essa taxonomia padronizada permite segmentar o progresso, otimizando a divisão de responsabilidades entre documentação, prototipação e verificação.

## Work Units (Unidades de Trabalho) no Agiflow

Para fins de organização macro, as frentes de trabalho foram agrupadas em seis Épicos ou Unidades de Trabalho (*Work Units*):

1. Gestão do Projeto ESW.
2. Requisitos do Sistema Wiigu.
3. Arquitetura e Projeto Físico.
4. Projeto de Interface e UX.
5. Protótipo Funcional do Wiigu.
6. Testes, Vídeo e Entrega Final.

Essa estruturação assegura a integração contínua. Por exemplo: o refinamento de Requisitos orienta diretamente a Arquitetura e a UX; as decisões de Arquitetura e Banco de Dados balizam o Desenvolvimento; e a implementação do Protótipo serve de base estrita para a elaboração dos Testes e da Infraestrutura.

## Informações Registradas em Cada Cartão

Para garantir clareza e conformidade com as boas práticas, todo cartão criado no Agiflow deve obrigatoriamente registrar os seguintes metadados:

- **Título:** Identificação clara e objetiva da atividade.
- **Descrição:** Detalhamento técnico do que precisa ser realizado.
- **Frente de Trabalho:** A categoria à qual a tarefa pertence (Ex: Requisitos, Banco de Dados).
- **Prioridade:** Nível de urgência e importância no ciclo atual.
- **Status:** Coluna atual no fluxo de trabalho.
- **Critérios de Aceite:** Condições exatas para que a tarefa seja considerada pronta (*Definition of Done*).
- **Artefato Relacionado:** *Link* ou indicação do arquivo no repositório gerado pela atividade (quando aplicável).

## Critérios de Conclusão do Gerenciamento

O gerenciamento do projeto (como meta avaliativa) será considerado satisfatoriamente documentado e implementado quando:

- O quadro Kanban estiver instanciado e configurado na plataforma Agiflow;
- As colunas e o fluxo de trabalho estiverem mapeados e em conformidade com este documento;
- Os cartões fundamentais do escopo acadêmico estiverem registrados;
- Todos os cartões possuírem título, descrição, prioridade, frentes de trabalho e critérios de aceite preenchidos;
- Os documentos finais e apresentações apresentarem rastreabilidade e refletirem o processo iterativo e de controle estabelecido.