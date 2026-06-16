# Requisitos Nao Funcionais

## Finalidade

Este documento define os requisitos nao funcionais do Wiigu e registra requisitos funcionais complementares que nao estejam suficientemente detalhados nas historias de usuario. O conteudo orienta arquitetura, interface, implementacao, testes e implantacao.

## Requisitos funcionais complementares

### RFC-01: Colunas obrigatorias do quadro

Cada quadro Kanban criado no Wiigu deve possuir as colunas `A FAZER`, `FAZENDO` e `FEITO`.

Criterio de verificacao: ao criar um quadro, as tres colunas devem estar disponiveis para receber cartoes.

### RFC-02: Participacao em projetos

Cada usuario pode participar de um ou mais projetos.

Criterio de verificacao: o sistema deve permitir associar usuarios a projetos ou, no prototipo, representar essa relacao de forma persistida.

### RFC-03: Identificacao de cartoes

Cada cartao de atividade deve conter identificador, nome, responsavel, data limite para termino, prioridade e descricao.

Criterio de verificacao: o formulario de cartao e a visualizacao do cartao devem contemplar esses dados.

### RFC-04: Bloqueio por limite WIP

Quando uma coluna possui limite WIP definido e esse limite ja foi atingido, o sistema deve impedir a entrada de novos cartoes nessa coluna.

Criterio de verificacao: ao tentar criar ou mover cartao para uma coluna no limite, o sistema deve exibir erro e manter o cartao na posicao anterior.

### RFC-05: Login Google configuravel

O sistema pode oferecer login com Google quando houver OAuth Client ID configurado no frontend e no backend.

Criterio de verificacao: sem as variaveis de ambiente, o login local permanece disponivel; com as variaveis configuradas, o token Google deve ser validado no servidor.

## RNF-01: Usabilidade

O sistema deve apresentar interface clara, com navegacao simples entre projetos, quadros, raias, colunas e cartoes.

Criterio de verificacao: um usuario deve conseguir criar um projeto, acessar um quadro, criar um cartao e mover esse cartao sem consultar documentacao externa.

## RNF-02: Legibilidade visual

O quadro Kanban deve permitir identificar rapidamente colunas, raias, cartoes, prioridade, responsavel e data limite.

Criterio de verificacao: as informacoes essenciais do cartao devem estar visiveis na tela principal do quadro.

## RNF-03: Desempenho

As operacoes comuns do prototipo devem responder em tempo adequado para demonstracao academica.

Criterio de verificacao: cadastro, login, consulta de quadro, criacao de cartao e movimentacao devem ocorrer sem espera perceptivel em ambiente local.

## RNF-04: Seguranca

O sistema deve restringir o acesso as funcionalidades principais a usuarios autenticados.

Criterio de verificacao: usuarios nao autenticados nao devem acessar quadros, projetos ou cartoes.

## RNF-04A: Interface com usuario

O sistema deve oferecer interface grafica web para acesso aos servicos principais.

Criterio de verificacao: os fluxos de autenticacao, quadro, raia, cartao, WIP e metricas devem estar acessiveis por telas do prototipo.

## RNF-05: Persistencia

Os dados principais devem ser armazenados de forma persistente para permitir consulta posterior.

Criterio de verificacao: projetos, quadros, raias, cartoes e movimentacoes devem permanecer disponiveis apos recarregar a aplicacao.

## RNF-06: Manutenibilidade

O codigo do prototipo deve separar interface, regras de negocio e persistencia.

Criterio de verificacao: a estrutura do projeto deve permitir identificar claramente camadas ou modulos relacionados a apresentacao, dominio e acesso a dados.

## RNF-07: Compatibilidade

O sistema deve funcionar em navegador web moderno.

Criterio de verificacao: a demonstracao deve executar corretamente em navegador desktop atualizado.

## RNF-07A: Interface com dispositivos externos

O sistema nao exige integracao com dispositivos externos alem dos dispositivos padrao usados pelo navegador, como teclado, mouse e tela.

Criterio de verificacao: a infraestrutura deve declarar que nao ha dependencia de dispositivo externo especifico.

## RNF-07B: Interface com outros sistemas

O prototipo nao exige integracao obrigatoria com sistemas externos para executar os servicos principais. O login com Google e uma integracao opcional.

Criterio de verificacao: a arquitetura deve tratar o sistema como aplicacao autonoma para fins de demonstracao e documentar a configuracao opcional do Google OAuth.

## RNF-07C: Normas, padroes e metricas

O projeto deve adotar terminologia e artefatos compatíveis com a disciplina de Engenharia de Software, considerando requisitos, arquitetura, design, testes, qualidade, processo e gerenciamento.

Criterio de verificacao: os documentos devem usar termos coerentes com SWEBOK, PMBOK, Sommerville e Pressman quando aplicavel.

## RNF-08: Documentacao

O projeto deve manter documentos suficientes para explicar requisitos, arquitetura, banco de dados, UX, testes e infraestrutura.

Criterio de verificacao: cada bloco avaliativo deve possuir artefato correspondente.

## RNF-09: Licenciamento e restricoes

O prototipo deve usar ferramentas e bibliotecas adequadas ao contexto academico, evitando dependencias que impeçam demonstracao, distribuicao ou execucao local.

Criterio de verificacao: as tecnologias usadas devem ser listadas no documento de arquitetura e infraestrutura.
