# Roteiro de Testes de Sistema e Video

## Finalidade

Este documento define os cenarios de teste de sistema que devem ser executados e demonstrados no video final do prototipo Wiigu.

## Estrategia

Os testes cobrem um cenario de sucesso para cada servico principal provido pelo sistema. A execucao deve demonstrar que apresentacao, regras de negocio e persistencia funcionam de forma integrada.

O prototipo tambem possui um script de teste automatizado, executado pelo comando:

```bash
npm run test:system
```

Esse script gera o relatorio `docs/11-execucao-testes-sistema.md`.

## Cenarios de teste

### CT-01: Cadastro, login local e logout

Servicos cobertos:

- criar conta;
- autenticar usuario por email e senha;
- encerrar sessao.

Passos:

1. Criar usuario com nome, email e senha.
2. Encerrar sessao.
3. Fazer login com as credenciais cadastradas.
4. Verificar acesso a area principal.

Resultado esperado: usuario cadastrado consegue autenticar e acessar os servicos protegidos.

### CT-02: CRUD de projetos

Servicos cobertos:

- criar projeto;
- listar projeto;
- atualizar projeto;
- excluir projeto.

Passos:

1. Criar projeto.
2. Verificar projeto listado.
3. Atualizar nome e descricao.
4. Criar projeto temporario.
5. Excluir projeto temporario.

Resultado esperado: projetos sao criados, consultados, atualizados e excluidos corretamente.

### CT-03: CRUD de quadros Kanban

Servicos cobertos:

- criar quadro;
- listar quadro;
- atualizar quadro;
- excluir quadro;
- criar colunas obrigatorias.

Passos:

1. Criar quadro em um projeto.
2. Verificar as colunas `A FAZER`, `FAZENDO` e `FEITO`.
3. Atualizar dados do quadro.
4. Criar quadro temporario.
5. Excluir quadro temporario.

Resultado esperado: quadro Kanban e criado com as colunas obrigatorias e pode ser consultado, editado e excluido.

### CT-04: CRUD de raias

Servicos cobertos:

- criar raia;
- listar raia no quadro;
- atualizar raia;
- excluir raia.

Passos:

1. Criar raia em um quadro.
2. Verificar raia exibida no quadro.
3. Atualizar nome da raia.
4. Criar raia temporaria.
5. Excluir raia temporaria sem cartoes.

Resultado esperado: raias sao criadas, exibidas, atualizadas e excluidas quando nao possuem cartoes associados.

### CT-05: CRUD de cartoes

Servicos cobertos:

- criar cartao;
- listar cartao no quadro;
- atualizar cartao;
- excluir cartao.

Passos:

1. Criar cartao com identificador, nome, responsavel, data limite, prioridade e descricao.
2. Verificar cartao na coluna e raia selecionadas.
3. Atualizar dados do cartao.
4. Criar cartao temporario.
5. Excluir cartao temporario.

Resultado esperado: cartoes sao criados, exibidos, atualizados e excluidos corretamente.

### CT-06: Mover cartao entre colunas

Servicos cobertos:

- mover cartao entre colunas;
- registrar inicio;
- registrar conclusao;
- registrar movimentacao.

Passos:

1. Criar cartao em `A FAZER`.
2. Arrastar o cartao para `FAZENDO`.
3. Verificar registro de inicio.
4. Arrastar o cartao para `FEITO`.
5. Verificar registro de conclusao.

Resultado esperado: cartao muda de coluna e os dados necessarios para metricas sao atualizados.

### CT-07: Mover cartao entre raias

Servicos cobertos:

- mover cartao entre raias;
- preservar coluna atual;
- registrar movimentacao.

Passos:

1. Criar cartao em uma raia.
2. Criar ou selecionar outra raia.
3. Arrastar o cartao para a outra raia.
4. Verificar que a coluna atual foi preservada.

Resultado esperado: cartao muda de raia sem perder estado, responsavel, prazo ou prioridade.

### CT-08: Limite WIP

Servicos cobertos:

- definir limite WIP por coluna;
- persistir limite;
- sinalizar limite na interface;
- bloquear movimentacao quando a coluna de destino ja estiver no limite.

Passos:

1. Definir limite WIP para a coluna `FAZENDO`.
2. Verificar limite persistido.
3. Tentar mover ou criar novo cartao em `FAZENDO` quando a coluna ja estiver no limite.
4. Visualizar o limite no cabecalho da coluna no quadro.

Resultado esperado: sistema registra o limite WIP, exibe o limite no quadro e impede nova entrada quando a coluna de destino ja atingiu o limite.

### CT-09: Metricas Kanban

Servicos cobertos:

- calcular lead time;
- calcular cycle time;
- calcular throughput;
- calcular work-in-progress.

Passos:

1. Criar e movimentar cartoes.
2. Concluir ao menos um cartao.
3. Abrir painel de metricas.
4. Verificar lead time, cycle time, throughput e WIP.

Resultado esperado: sistema exibe metricas calculadas com base nos cartoes e movimentacoes.

### CT-10: Login com Google

Servico coberto:

- autenticar usuario por conta Google.

Condicao de execucao:

- executar apenas quando `VITE_GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_ID` estiverem configurados.

Passos:

1. Abrir tela de login.
2. Acionar `Entrar com Google`.
3. Selecionar conta Google valida.
4. Verificar acesso a area principal.

Resultado esperado: usuario autenticado pelo Google acessa os servicos protegidos do Wiigu.

## Roteiro sugerido para o video

1. Apresentar brevemente o objetivo do Wiigu.
2. Mostrar cadastro, login e acesso ao sistema.
3. Criar projeto.
4. Criar quadro e destacar as colunas `A FAZER`, `FAZENDO` e `FEITO`.
5. Criar raia.
6. Criar cartao com os campos obrigatorios.
7. Mover cartao entre colunas por arrastar e soltar.
8. Mover cartao entre raias por arrastar e soltar.
9. Definir limite WIP.
10. Tentar ultrapassar limite WIP e mostrar bloqueio.
11. Abrir painel de metricas.
12. Encerrar mostrando que os dados permanecem no sistema.

Se o ambiente OAuth estiver configurado, incluir o CT-10 no inicio do video. Se nao estiver configurado, o video deve executar o login local do CT-01.

## Criterio de cobertura

O video deve demonstrar um cenario de sucesso para cada servico provido pelo sistema. Se algum servico complementar for adicionado ao prototipo, ele tambem deve aparecer no roteiro de teste ou ser removido do escopo.
