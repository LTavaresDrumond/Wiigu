# Storyboards do Wiigu

## SB-01: Cadastro e login

Objetivo: permitir que o usuario crie conta e acesse o sistema.

Wireframes: WF-01, WF-02, WF-03.

Fluxo:

1. Visitante acessa login.
2. Visitante abre cadastro.
3. Visitante informa nome, email e senha.
4. Sistema cria usuario.
5. Usuario faz login por email e senha ou por Google, se o login federado estiver configurado.
6. Sistema exibe dashboard de projetos.

## SB-02: Criacao de projeto

Objetivo: criar um projeto para agrupar quadros.

Wireframes: WF-03, WF-04.

Fluxo:

1. Usuario acessa dashboard.
2. Usuario clica em novo projeto.
3. Usuario informa nome e descricao.
4. Sistema salva projeto.
5. Dashboard exibe o novo projeto.

## SB-03: Criacao de quadro Kanban

Objetivo: criar quadro com colunas obrigatorias.

Wireframes: WF-03, WF-05, WF-06.

Fluxo:

1. Usuario seleciona projeto.
2. Usuario cria quadro.
3. Sistema cria colunas A FAZER, FAZENDO e FEITO.
4. Quadro e exibido pronto para uso.

## SB-04: Criacao de raia

Objetivo: dividir o quadro por frente de trabalho.

Wireframes: WF-06, WF-07.

Fluxo:

1. Usuario acessa quadro.
2. Usuario cria raia.
3. Sistema adiciona raia nas colunas.
4. Usuario visualiza a nova divisao do quadro.

## SB-05: Criacao de cartao

Objetivo: registrar uma atividade no quadro.

Wireframes: WF-06, WF-08, WF-09.

Fluxo:

1. Usuario escolhe coluna e raia.
2. Usuario preenche dados do cartao.
3. Sistema cria cartao.
4. Cartao aparece no quadro.
5. Usuario abre detalhes do cartao se precisar revisar os dados.

## SB-06: Movimentacao entre colunas

Objetivo: atualizar estado da atividade no fluxo Kanban.

Wireframes: WF-06, WF-09.

Fluxo:

1. Usuario visualiza cartao em A FAZER.
2. Usuario arrasta o cartao para FAZENDO ou usa acao de mover.
3. Sistema registra inicio do trabalho.
4. Usuario arrasta o cartao para FEITO ou usa acao de mover.
5. Sistema registra conclusao.

## SB-07: Movimentacao entre raias

Objetivo: reorganizar uma atividade sem perder seu estado atual.

Wireframes: WF-06, WF-09.

Fluxo:

1. Usuario visualiza o cartao no quadro.
2. Usuario arrasta o cartao para outra raia ou seleciona outra raia no formulario.
3. Sistema move cartao para nova raia.
4. Cartao permanece na mesma coluna.

## SB-08: Limite WIP

Objetivo: controlar quantidade de trabalho por coluna.

Wireframes: WF-06, WF-10.

Fluxo:

1. Usuario abre configuracao WIP.
2. Usuario define limite por coluna.
3. Sistema salva limite.
4. Quadro mostra limite no cabecalho.
5. Sistema bloqueia nova movimentacao quando o limite WIP da coluna de destino ja foi atingido.

## SB-09: Metricas Kanban

Objetivo: acompanhar desempenho do fluxo.

Wireframes: WF-06, WF-11.

Fluxo:

1. Usuario acessa quadro com cartoes movimentados.
2. Usuario abre metricas.
3. Sistema calcula lead time, cycle time, throughput e WIP.
4. Usuario visualiza indicadores.
