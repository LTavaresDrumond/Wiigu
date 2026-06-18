# Requisitos Não Funcionais e Funcionais Complementares

## Finalidade

Este documento define os requisitos não funcionais (atributos de qualidade e restrições) do sistema Wiigu e registra os Requisitos Funcionais Complementares (RFCs) que são de natureza global e não estão restritos a uma única história de usuário. O conteúdo aqui especificado orienta as decisões de arquitetura, o *design* da interface, a implementação, os testes e a implantação.

---

## Requisitos Funcionais Complementares (RFC)

### RFC-01: Colunas Obrigatórias do Quadro
Cada quadro Kanban criado no sistema Wiigu deve possuir as colunas padrão: `A FAZER`, `FAZENDO` e `FEITO`.
**Critério de verificação:** Ao criar um novo quadro, as três colunas devem estar instanciadas automaticamente e disponíveis para receber cartões.

### RFC-02: Participação em Projetos
Cada usuário pode participar de um ou mais projetos cadastrados no sistema.
**Critério de verificação:** O sistema deve permitir a associação de usuários a projetos ou, no escopo do protótipo, representar e persistir corretamente essa relação no banco de dados.

### RFC-03: Identificação de Cartões
Cada cartão de atividade deve conter: identificador único, título/nome, responsável atribuído, data limite para término, prioridade e descrição detalhada.
**Critério de verificação:** O formulário de criação e a interface de visualização do cartão devem contemplar e exibir todos esses dados.

### RFC-04: Bloqueio por Limite WIP (*Work in Progress*)
Quando uma coluna possuir um limite WIP definido e esse limite já tiver sido atingido, o sistema deve impedir a entrada de novos cartões nessa referida coluna.
**Critério de verificação:** Ao tentar criar ou arrastar um cartão para uma coluna que já atingiu seu limite, o sistema deve exibir uma mensagem de erro/alerta e retornar o cartão para sua posição original.

### RFC-05: Login Google Configurável (OAuth)
O sistema pode oferecer a funcionalidade de *login* federado com o Google, desde que o *OAuth Client ID* esteja configurado nos ambientes de *frontend* e *backend*.
**Critério de verificação:** Sem as variáveis de ambiente, apenas o *login* local permanece disponível; com as variáveis corretamente configuradas, o *token* do Google deve ser recebido, decodificado e validado pelo servidor.

---

## Requisitos Não Funcionais (RNF)

### Atributos de Qualidade

### RNF-01: Usabilidade
O sistema deve apresentar uma interface clara e intuitiva, permitindo uma navegação simples entre projetos, quadros, raias, colunas e cartões.
**Critério de verificação:** Um usuário recém-cadastrado deve conseguir criar um projeto, acessar um quadro, cadastrar um cartão e movimentá-lo sem a necessidade de consultar documentações externas ou manuais.

### RNF-02: Legibilidade Visual
O quadro Kanban deve permitir a rápida identificação visual de colunas, raias, cartões, prioridades, responsáveis e datas limites.
**Critério de verificação:** As informações essenciais do cartão (título, responsável, prioridade) devem estar claramente visíveis na tela principal do quadro, sem a necessidade de abrir os detalhes do *card*.

### RNF-03: Desempenho
As operações comuns do protótipo devem responder em tempo adequado para proporcionar uma demonstração acadêmica fluida.
**Critério de verificação:** As ações de cadastro, *login*, consulta de quadros, criação de cartões e movimentação entre colunas devem ocorrer sem tempo de espera perceptível (*delay*) em um ambiente de execução local.

### RNF-04: Segurança
O sistema deve restringir o acesso às suas funcionalidades principais apenas a usuários devidamente autenticados.
**Critério de verificação:** Usuários anônimos (não autenticados) não devem conseguir acessar rotas privadas de quadros, projetos ou manipular cartões, sendo redirecionados para a tela de *login*.

### RNF-05: Persistência e Confiabilidade
Os dados principais do fluxo de trabalho devem ser armazenados de forma persistente e consistente em um banco de dados relacional para permitir consultas posteriores.
**Critério de verificação:** Projetos, quadros, raias, cartões e suas respectivas movimentações devem permanecer intactos e disponíveis mesmo após o encerramento da sessão ou reinicialização da aplicação.

### RNF-06: Manutenibilidade e Arquitetura
O código-fonte do protótipo deve respeitar o princípio da separação de responsabilidades (Interface, Regras de Negócio e Persistência).
**Critério de verificação:** A estrutura de diretórios do projeto deve permitir identificar claramente as camadas ou módulos relacionados à apresentação (*frontend/UI*), ao domínio (*backend/services*) e ao acesso a dados (*database/repositories*).

---

### Requisitos de Interface e Integração

### RNF-07: Interface com o Usuário
O sistema deve oferecer uma interface gráfica *web* padronizada para acesso a todos os serviços principais.
**Critério de verificação:** Todos os fluxos operacionais (autenticação, manipulação de quadros, raias, cartões, configuração de WIP e visualização de métricas) devem ser realizáveis através de telas interativas do protótipo.

### RNF-08: Compatibilidade
O sistema deve funcionar adequadamente nos navegadores *web* modernos voltados para ambiente *desktop*.
**Critério de verificação:** A demonstração final deve ser executada corretamente e sem quebras de *layout* em navegadores atualizados (como Google Chrome, Firefox ou Edge).

### RNF-09: Interface com Dispositivos Externos
O sistema não exige integração com dispositivos de *hardware* externos, dependendo apenas dos periféricos padrão de navegação (teclado, *mouse* e monitor).
**Critério de verificação:** O documento de infraestrutura deve declarar explicitamente a ausência de dependência de dispositivos físicos específicos (como leitor biométrico ou impressoras).

### RNF-10: Interface com Outros Sistemas
O protótipo deve operar de forma autônoma, não exigindo integração obrigatória com sistemas de terceiros para a execução dos seus fluxos críticos. A integração com o Google (OAuth) deve ser tratada como um módulo opcional.
**Critério de verificação:** A arquitetura do sistema deve permitir a inicialização e o uso local pleno como uma aplicação independente, documentando a integração do Google de forma isolada.

---

### Restrições de Projeto e Padrões

### RNF-11: Normas, Padrões e Terminologia
O projeto deve adotar terminologia técnica rigorosa e produzir artefatos perfeitamente compatíveis com a disciplina de Engenharia de Software (abrangendo requisitos, arquitetura, testes e gestão).
**Critério de verificação:** Toda a base documental deve fazer uso correto de termos fundamentados em referenciais teóricos consagrados, como SWEBOK, PMBOK, Sommerville e Pressman, sempre que aplicável.

### RNF-12: Documentação
O projeto deve manter um repositório documental completo e autossuficiente para explicar a Engenharia de Requisitos, Arquitetura, Modelagem de Dados, UX, Roteiros de Testes e Infraestrutura.
**Critério de verificação:** Cada exigência da matriz de avaliação acadêmica deve possuir o seu artefato (*PDF*) correspondente na pasta `docs/`.

### RNF-13: Licenciamento e Restrições Tecnológicas
O protótipo deve utilizar linguagens, bibliotecas e ferramentas de código aberto (*Open Source*) adequadas ao contexto educacional.
**Critério de verificação:** O documento de arquitetura não deve conter tecnologias pagas ou licenciadas que impeçam a avaliação, distribuição livre ou execução local do sistema pelos avaliadores.