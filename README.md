# Planejador de Dieta e Treino com Inteligência Artificial

Este projeto é um servidor backend que fornece planos de dieta e treino personalizados usando um modelo de IA generativa. É construído com Node.js, Fastify e TypeScript, e foi projetado para ser implantado na Vercel.

## 🚀 Funcionalidades

- Gerar planos de dieta personalizados.
- Gerar planos de treino personalizados.
- Documentação Swagger para a API.

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/) para validação
- [Google Gemini](https://ai.google.dev/) para IA generativa
- [Vercel](https://vercel.com/) para implantação

## 📦 Instalação

1. Clone este repositório (substitua com a URL do seu repositório):

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```

2. Navegue até o diretório do projeto:

    ```bash
    cd server
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Crie um arquivo `.env` no diretório raiz e adicione sua chave de API do Google Gemini:

    ```bash
    GOOGLE_GEMINI_API_KEY=sua_chave_de_api_aqui
    ```

## 🏃 Uso

### Desenvolvimento

Para executar o servidor em modo de desenvolvimento com recarregamento automático, use o seguinte comando:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

### Produção

Para construir o projeto para produção, use o seguinte comando:

```bash
npm run build
```

Para iniciar o servidor em modo de produção, use o seguinte comando:

```bash
npm start
```

## 📖 Endpoints da API

A documentação da API está disponível em `/docs` quando o servidor está em execução.

- **POST /diet-plan**: Gera um novo plano de dieta com base nas informações do usuário.
- **POST /training-plan**: Gera um novo plano de treino com base nas informações do usuário.

## 🚀 Implantação

Este projeto está configurado para fácil implantação na [Vercel](https://vercel.com/). O arquivo `vercel.json` contém a configuração necessária para as funções serverless.
