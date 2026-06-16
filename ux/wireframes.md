# Wireframes do Wiigu

Os wireframes abaixo sao esbocos simples das telas principais. Eles mostram estrutura, campos, comandos e informacoes essenciais, sem definir identidade visual final.

## WF-01: Login

Historias atendidas: HU-02, HU-02A, HU-03.

```text
+--------------------------------------------------+
| Wiigu                                            |
| Entrar no sistema                                |
|                                                  |
| Email                                            |
| [______________________________________________] |
| Senha                                            |
| [______________________________________________] |
|                                                  |
| [ Entrar ]                         [ Criar conta ]|
| [ Entrar com Google ]                            |
|                                                  |
| Mensagem de erro: email ou senha invalidos       |
+--------------------------------------------------+
```

## WF-02: Cadastro

Historias atendidas: HU-01.

```text
+--------------------------------------------------+
| Wiigu                                            |
| Criar conta                                      |
|                                                  |
| Nome                                             |
| [______________________________________________] |
| Email                                            |
| [______________________________________________] |
| Senha                                            |
| [______________________________________________] |
| Confirmar senha                                  |
| [______________________________________________] |
|                                                  |
| [ Criar conta ]                    [ Voltar ]     |
+--------------------------------------------------+
```

## WF-03: Dashboard de projetos

Historias atendidas: HU-04, HU-05.

```text
+--------------------------------------------------------------------------------+
| Wiigu                                      Usuario: Carlos   [Sair]             |
| Projetos                                                       [Novo projeto]   |
+--------------------------------------------------------------------------------+
| Buscar projeto                                                                  |
| [____________________________________________________________]                  |
|                                                                                |
| +----------------------+ +----------------------+ +----------------------+      |
| | Projeto ESW          | | Projeto Pesquisa     | | Projeto Pessoal      |      |
| | 2 quadros            | | 1 quadro             | | 3 quadros            |      |
| | [Abrir] [Editar]     | | [Abrir] [Editar]     | | [Abrir] [Editar]     |      |
| +----------------------+ +----------------------+ +----------------------+      |
+--------------------------------------------------------------------------------+
```

## WF-04: Formulario de projeto

Historias atendidas: HU-04, HU-05.

```text
+--------------------------------------------------+
| Novo projeto                                     |
|                                                  |
| Nome do projeto                                  |
| [______________________________________________] |
| Descricao                                        |
| [______________________________________________] |
| [______________________________________________] |
|                                                  |
| [Salvar]                            [Cancelar]   |
+--------------------------------------------------+
```

## WF-05: Formulario de quadro

Historias atendidas: HU-06, HU-07.

```text
+--------------------------------------------------+
| Novo quadro Kanban                               |
|                                                  |
| Nome do quadro                                   |
| [______________________________________________] |
| Descricao                                        |
| [______________________________________________] |
|                                                  |
| Colunas criadas automaticamente:                 |
| A FAZER | FAZENDO | FEITO                        |
|                                                  |
| [Criar quadro]                      [Cancelar]   |
+--------------------------------------------------+
```

## WF-06: Quadro Kanban

Historias atendidas: HU-06, HU-08, HU-10, HU-12, HU-13, HU-15.

```text
+------------------------------------------------------------------------------------------------+
| Wiigu > Projeto ESW > Quadro Principal       [Nova raia] [Novo cartao] [WIP] [Metricas] [Sair] |
+------------------------------------------------------------------------------------------------+
| Raia: Documentacao                                                                             |
| +--------------------------+ +--------------------------+ +--------------------------+          |
| | A FAZER        WIP 2/4   | | FAZENDO        WIP 1/2   | | FEITO          WIP 1/-   |          |
| | +----------------------+ | | +----------------------+ | | +----------------------+ |          |
| | | WIG-001              | | | | WIG-002              | | | | WIG-003              | |          |
| | | Vision               | | | | Banco fisico         | | | | Guia de escrita      | |          |
| | | Resp: Carlos         | | | | Resp: Carlos         | | | | Resp: Carlos         | |          |
| | | Alta | 10/06         | | | | Alta | 11/06         | | | | Media | 08/06        | |          |
| | +----------------------+ | | +----------------------+ | | +----------------------+ |          |
| | Cartoes podem ser arrastados para outra coluna ou raia                         |          |
| +--------------------------+ +--------------------------+ +--------------------------+          |
|                                                                                                |
| Raia: Desenvolvimento                                                                          |
| +--------------------------+ +--------------------------+ +--------------------------+          |
| | A FAZER                  | | FAZENDO                  | | FEITO                    |          |
| | [ + Cartao ]             | |                          | |                          |          |
| +--------------------------+ +--------------------------+ +--------------------------+          |
+------------------------------------------------------------------------------------------------+
```

## WF-07: Formulario de raia

Historias atendidas: HU-08, HU-09.

```text
+--------------------------------------------------+
| Nova raia                                        |
|                                                  |
| Nome da raia                                     |
| [______________________________________________] |
| Ordem                                            |
| [ 1 ]                                            |
|                                                  |
| [Salvar raia]                       [Cancelar]   |
+--------------------------------------------------+
```

## WF-08: Formulario de cartao

Historias atendidas: HU-10, HU-11.

```text
+--------------------------------------------------+
| Novo cartao                                      |
|                                                  |
| Nome                                             |
| [______________________________________________] |
| Responsavel                                      |
| [______________________________________________] |
| Data limite                                      |
| [____/____/______]                               |
| Prioridade                                       |
| ( ) Baixa   ( ) Media   ( ) Alta                 |
| Coluna                                           |
| [A FAZER v]                                      |
| Raia                                             |
| [Documentacao v]                                 |
| Descricao                                        |
| [______________________________________________] |
| [______________________________________________] |
|                                                  |
| [Salvar cartao]                     [Cancelar]   |
+--------------------------------------------------+
```

## WF-09: Detalhe do cartao

Historias atendidas: HU-11, HU-12, HU-13.

```text
+--------------------------------------------------+
| WIG-002 - Banco fisico                           |
| Prioridade: Alta        Data limite: 11/06       |
| Responsavel: Carlos                              |
|                                                  |
| Descricao                                        |
| Projetar tabelas, chaves e relacionamentos.      |
|                                                  |
| Coluna atual                                     |
| [FAZENDO v]                                      |
| Raia atual                                       |
| [Documentacao v]                                 |
|                                                  |
| [Salvar alteracoes] [Mover] [Excluir] [Fechar]   |
+--------------------------------------------------+
```

## WF-10: Configuracao WIP

Historias atendidas: HU-14, HU-15, HU-15A.

```text
+--------------------------------------------------+
| Limites WIP do quadro                            |
|                                                  |
| A FAZER                                          |
| [ 4 ] cartoes                                    |
| FAZENDO                                          |
| [ 2 ] cartoes                                    |
| FEITO                                            |
| [ sem limite ]                                   |
|                                                  |
| [Salvar limites]                    [Cancelar]   |
+--------------------------------------------------+
```

## WF-11: Painel de metricas

Historias atendidas: HU-16.

```text
+--------------------------------------------------------------------------------+
| Metricas do quadro: Quadro Principal                         [Voltar ao quadro] |
+--------------------------------------------------------------------------------+
| Lead time medio        | Cycle time medio       | Throughput                   |
| 3,2 dias               | 1,8 dias               | 7 cartoes/semana             |
+--------------------------------------------------------------------------------+
| Work-in-progress                                                             |
| A FAZER: 2 cartoes     FAZENDO: 1 cartao      FEITO: 1 cartao                 |
|                                                                                |
| Cartoes concluidos no periodo                                                  |
| +----------+----------------+------------+-------------+                       |
| | Codigo   | Nome           | Lead time  | Cycle time  |                       |
| | WIG-003  | Guia de escrita| 2 dias     | 1 dia       |                       |
| +----------+----------------+------------+-------------+                       |
+--------------------------------------------------------------------------------+
```

## WF-12: Estados de erro e validacao

Historias atendidas: HU-01 a HU-16.

```text
+--------------------------------------------------+
| Exemplo de validacao                             |
|                                                  |
| Nome                                             |
| [______________________________________________] |
| Erro: o nome e obrigatorio.                      |
|                                                  |
| Data limite                                      |
| [32/13/2026____________________________________] |
| Erro: informe uma data valida.                   |
|                                                  |
| Coluna FAZENDO                                   |
| Erro: limite WIP atingido.                       |
+--------------------------------------------------+
```
