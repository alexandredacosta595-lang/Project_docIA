<<<<<<< HEAD
# SIGDF - Sistema Inteligente de Gestão de Documentos Financeiros

Este repositório contém o código fonte do SIGDF, separado em `frontend` e `backend`.

## Estrutura do Projeto

- `/frontend`: Aplicação em React/Vite.
- `/backend`: API em FastAPI conectada a PostgreSQL.

## Como correr o projeto completo

Na raiz do projeto, existe um `docker-compose.yml` que orquestra o backend e a base de dados:

```bash
docker-compose up --build
```

A API ficará disponível em `http://localhost:8000`.
A documentação Swagger em `http://localhost:8000/docs`.

### Frontend

Para correr o frontend localmente (fora do docker nesta fase):

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.
=======
# Project_docIA
Sistema inteligente de Gestão e análise de documentos financeiro para PMEs angolanas
>>>>>>> 478bb85425761135f12bd81b330250703c0c8e2b
