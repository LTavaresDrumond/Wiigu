# Guia de Escrita e Padronizacao

## Objetivo

Este guia define o padrao de redacao dos documentos do projeto Wiigu. A finalidade e manter unidade entre os artefatos, mesmo quando partes diferentes forem produzidas por frentes distintas de trabalho.

## Tom e estilo

Os documentos devem usar linguagem tecnica simples, direta e academica. O texto deve explicar decisoes de projeto sem excesso de adjetivos e sem tentar parecer mais complexo do que o necessario.

Preferir frases medias, com uma ideia principal por paragrafo. Evitar repeticoes mecanicas, listas longas sem explicacao e conclusoes genericas.

## Vocabulário comum

Usar sempre os mesmos termos:

- Sistema: Wiigu.
- Metodo de acompanhamento: Kanban.
- Ciclo de desenvolvimento: iterativo e incremental.
- Cadencia de planejamento: sprints curtas, inspiradas em Scrum.
- Artefatos principais: Vision, requisitos nao funcionais, historias de usuario, Architecture Notebook, projeto fisico do banco, storyboards, wireframes, prototipo, roteiro de testes e infraestrutura.
- Entidades do sistema: usuario, projeto, quadro, raia, coluna, cartao, movimentacao e metrica.
- Colunas obrigatorias do prototipo: A FAZER, FAZENDO e FEITO.
- Colunas do gerenciamento no Agiflow: Planning, Todo, In Progress, Testing, Review, Done e Blocked.

## Referencias conceituais

O texto deve se apoiar em termos de Engenharia de Software:

- PMBOK: escopo, cronograma, recursos, qualidade, comunicacoes, riscos, partes interessadas e acompanhamento do trabalho.
- SWEBOK: requisitos de software, arquitetura, design, construcao, testes, qualidade, configuracao, processo e gerenciamento de projeto.
- Agil: iteracoes, incremento, priorizacao, feedback, transparencia e limite de trabalho em progresso.

## Padrão de secoes

Cada documento deve seguir a estrutura:

1. Finalidade do artefato.
2. Contexto do Wiigu.
3. Conteudo tecnico principal.
4. Relacao com outros artefatos.
5. Criterios de conclusao ou verificacao.

## Regra de coerencia

Nenhum documento deve criar uma funcionalidade, entidade ou regra que nao apareca nos demais artefatos. Se o Vision citar uma funcionalidade, ela deve aparecer nas historias de usuario, no banco, na UX, no prototipo e nos testes.

## Revisao final

Antes da entrega, revisar:

- se os nomes das entidades estao iguais em todos os arquivos;
- se a linguagem esta consistente;
- se as funcionalidades obrigatorias aparecem em todos os blocos;
- se as decisoes de arquitetura justificam o prototipo implementado;
- se os testes cobrem os servicos demonstrados no video.
- se os documentos textuais estao prontos para exportacao em PDF;
- se existe documento indicando quais artefatos foram construidos por cada membro da equipe.
