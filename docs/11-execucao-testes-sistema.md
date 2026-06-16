# Relatorio de Execucao dos Testes de Sistema

## Finalidade

Este documento registra a execucao dos testes de sistema do prototipo Wiigu. Os testes foram executados contra a API do prototipo, usando banco SQLite separado para a rodada de teste.

## Ambiente

- Data da execucao: 2026-06-08T03:14:31.495Z
- API testada: http://127.0.0.1:3101/api
- Banco de teste: `C:\Users\carlo\OneDrive\Documentos\Wiigu\prototype\data\system-test-1780888470888.db`
- Comando: `npm run test:system`

## Resultado geral

- Cenarios executados: 9
- Cenarios aprovados: 9
- Cenarios com falha: 0

## Resultado por cenario

| ID | Cenario | Resultado | Evidencia |
| --- | --- | --- | --- |
| CT-01 | Cadastro, login local e logout | PASSOU | Usuario teste-1780888470888@wiigu.local cadastrado, logout executado e login validado. |
| CT-02 | CRUD de projetos | PASSOU | Projeto 1 criado, atualizado, listado e projeto temporario excluido. |
| CT-03 | CRUD de quadros Kanban | PASSOU | Quadro 1 criado com A FAZER, FAZENDO e FEITO; edicao, leitura e exclusao temporaria validadas. |
| CT-04 | CRUD de raias | PASSOU | Raias criadas, editadas, listadas no quadro e raia temporaria excluida. |
| CT-05 | CRUD de cartoes | PASSOU | Cartao WIG-001 criado e editado; cartao temporario excluido. |
| CT-06 | Movimentacao de cartao entre colunas | PASSOU | Cartao WIG-001 movido para FAZENDO e depois FEITO. |
| CT-07 | Movimentacao de cartao entre raias | PASSOU | Cartao WIG-002 movido para outra raia preservando coluna atual. |
| CT-08 | Limite WIP por coluna | PASSOU | Limite WIP da coluna FAZENDO definido como 1 e bloqueio acima do limite validado. |
| CT-09 | Metricas Kanban | PASSOU | Metricas calculadas: lead time 0, cycle time 0, throughput 1. |

## Conclusao

Todos os cenarios de sucesso definidos para os servicos principais foram executados com resultado aprovado.
