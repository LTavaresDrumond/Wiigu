# Infraestrutura de Implantacao

## Finalidade

Este documento descreve a infraestrutura necessaria para executar o Wiigu em ambiente de demonstracao e apresenta uma proposta de infraestrutura para producao.

## Ambiente de demonstracao

O prototipo foi construído como aplicacao web com frontend React, API Express e banco SQLite. Em demonstracao local, a aplicacao e executada em dois servicos:

- frontend servido pelo Vite em `http://127.0.0.1:5173`;
- API Express em `http://127.0.0.1:3001`;
- banco SQLite local em `prototype/data/wiigu.db`.

## Hardware necessario

Para demonstracao:

- computador ou notebook com processador moderno;
- pelo menos 4 GB de memoria RAM;
- espaco em disco para codigo, dependencias Node.js e arquivo SQLite;
- tela, teclado e mouse ou touchpad.

Para producao:

- servidor virtual ou fisico com recursos suficientes para executar aplicacao Node.js;
- armazenamento persistente para banco de dados;
- capacidade de backup do banco;
- acesso de rede estavel.

## Software necessario

Para demonstracao:

- sistema operacional Windows, Linux ou macOS;
- Node.js 24 ou superior;
- npm 11 ou superior;
- navegador web atualizado;
- Git para controle de versao;
- SQLite por meio do modulo `node:sqlite`;
- ferramenta para exportar documentos textuais em PDF.

Bibliotecas principais do prototipo:

- React;
- Vite;
- Express;
- lucide-react;
- google-auth-library;
- concurrently.

## Servicos necessarios

### Servico de frontend

Responsavel por apresentar a interface web do Wiigu. Na demonstracao, e executado pelo Vite. Em producao, pode ser empacotado e servido como arquivos estaticos.

### Servico de API

Responsavel por expor os servicos do sistema:

- autenticacao;
- autenticacao federada com Google, quando configurada;
- projetos;
- quadros;
- raias;
- cartoes;
- movimentacoes;
- limites WIP;
- metricas.

### Servico de banco de dados

Responsavel por persistir usuarios, projetos, membros, quadros, colunas, raias, cartoes e movimentacoes. No prototipo, usa SQLite local. Em producao, poderia ser mantido em SQLite com backup regular ou migrado para PostgreSQL, caso o volume de usuarios e dados aumente.

## Configuracao de execucao

Instalar dependencias:

```bash
cd prototype
npm install
```

Executar em desenvolvimento:

```bash
npm run dev
```

Configuracao opcional para login Google:

```bash
$env:VITE_GOOGLE_CLIENT_ID="client-id-web-do-google"
$env:GOOGLE_CLIENT_ID="client-id-web-do-google"
npm run dev
```

Sem essas variaveis, o sistema permanece funcional pelo cadastro e login locais.

Executar validacao:

```bash
npm run check
npm run test:system
```

## Requisitos de producao

Para colocar o sistema em producao, seriam necessarios:

- hospedagem da aplicacao Node.js;
- build do frontend React;
- configuracao de porta e variaveis de ambiente;
- banco de dados persistente;
- rotina de backup;
- configuracao HTTPS;
- controle de logs;
- monitoramento basico de disponibilidade;
- politica de atualizacao e manutencao.

## Observacao de escopo

No trabalho academico, a implantacao completa em producao nao e o foco principal. O prototipo deve ser executado em ambiente local e o documento registra a infraestrutura necessaria para demonstracao e para uma implantacao futura.
