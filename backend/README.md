# SIGDF Backend

Backend do projeto construído com FastAPI, SQLAlchemy, Alembic e PostgreSQL.

## Configuração Local

Requisitos:
- Python 3.11+
- PostgreSQL (pode usar o docker-compose na raiz)

1. Criar ambiente virtual:
```bash
python -m venv .venv
source .venv/bin/activate  # no windows: .venv\Scripts\activate
```

2. Instalar dependências:
```bash
pip install -r requirements.txt
```

3. Copiar `.env.example` para `.env` e ajustar caso necessário.

4. Gerar a primeira migration e correr (se aplicável):
```bash
alembic revision --autogenerate -m "Initial commit"
alembic upgrade head
```

5. Correr o servidor:
```bash
uvicorn app.main:app --reload
```

## Testes

Para executar os testes:
```bash
pytest
```
