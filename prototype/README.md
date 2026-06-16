# Prototipo Wiigu

## Requisitos

- Node.js 24 ou superior.
- npm 11 ou superior.

O prototipo usa React no frontend, Express na API e SQLite por meio do modulo `node:sqlite`.
O login local usa email e senha. O login com Google pode ser habilitado por variaveis de ambiente.

## Como executar

Instalar dependencias:

```bash
npm install
```

Executar em desenvolvimento:

```bash
npm run dev
```

Enderecos:

- Frontend: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:3001`

## Validacao

Executar build e teste basico do schema:

```bash
npm run check
```

Executar testes de sistema:

```bash
npm run test:system
```

## Login com Google

Para habilitar o botao real do Google Sign-In, criar um OAuth Client ID do tipo Web e executar o prototipo com as variaveis:

```bash
$env:VITE_GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
$env:GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
npm run dev
```

Sem essas variaveis, o prototipo continua funcionando pelo cadastro e login locais.

## Banco local

O banco local e criado em `prototype/data/wiigu.db`.
