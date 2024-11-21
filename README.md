# Hospitalização UI

Gestão da hospitalização dos pacientes.

### Requisitos

-   [Node.js](https://nodejs.org)
-   [npmjs](https://npmjs.com/)
-   [Docker](https:www.docker.com)

## Guia de Implementação

-   [Ambiente de produção](#docker---ambiente-de-produção)
-   [Ambiente de desenvolvimento](#ambiente-de-desenvolvimento)

## Baixar repositório

1. Clone o repositório do projecto

```bash
git clone git@github.com:veticolibri/hospitalization-ui.git
```

2. Mude para o diretório da aplicação:

```bash
cd hospitalizacao-ui
```

## Docker - Ambiente de produção

Para executar a aplicação atráves de uma imagem em Docker siga os seguintes passos:

1. Construção da imagem

Para construção da imagem é necessário fornecer as seguintes váriaveis de ambiente, `VITE_SERVER_URL` e `VITE_WS_URL`:

```bash
docker build --build-arg VITE_SERVER_URL="server-url" --build-arg VITE_WS_URL="websocket-url" -f ./.build/Dockerfile -t hospitalizacao-ui .
```

> NOTA: Substitua `server-url` e `websocket-url` pelos valores reais do servidor de backoffice.
> NOTA: Tanto do `server-url` e o `websocket-url` apontam para o ROOT na rota do servidor de backoffice.

2. Execução do container

Para executar o container com a sua imagem docker criada no passo acima, execute o comando abaixo:

```bash
docker run -d -p 3000:8080 hospitalizacao-ui
```

Depois de executar o comando acima a aplicação estará disponível no seguinte endereço: <http://localhost:3000>

## Ambiente de desenvolvimento

Se deseja executar a sua aplicação em ambiente de desenvolvimento siga os seguintes passos:

1. Instalação das dependências:

```bash
npm install
```

2. Variáveis de ambiente:

```bash
cp .env.example .env.development
```

> NOTA: Depois de copiar os dados do arquivo `.env.example` para o `.env.development`, abra o arquivo `.env.development` com o seu editor de texto preferido e atualize as informações das variáveis de ambiente `VITE_SERVER_URL` e `VITE_WS_URL` para apontarem ao servidor de backoffice.

3. Executar servidor de desenvolvimente:

```bash
npm run dev
```

Para o ambiente de desenvolvimento a aplicação estará disponível no seguinte endereço: <http://localhost:5173>
