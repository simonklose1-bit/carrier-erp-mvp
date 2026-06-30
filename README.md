# Carrier ERP — MVP

ERP-System für Reederei-Operationen. Modular Monolith, Node.js/TypeScript Backend, Next.js Frontend.

## Schnellstart

```bash
cp .env.example .env
docker compose up -d
```

Backend: http://localhost:3001/health  
Frontend: http://localhost:3000  
RabbitMQ UI: http://localhost:15672 (erp/erp_secret)  
MinIO Console: http://localhost:9001

## Struktur

```
├── backend/          # Express + Prisma API
├── frontend/         # Next.js 14 App
├── docs/adr/         # Architecture Decision Records
├── docker-compose.yml
└── CLAUDE.md         # Claude Code Projektkontext
```

## Architektur-Entscheidungen

Siehe [docs/adr/](docs/adr/) für alle ADRs.

## Entwicklung

```bash
# Backend
cd backend && npm install
npm run db:migrate    # Prisma Migrations
npm run dev           # tsx watch auf Port 3001

# Frontend
cd frontend && npm install
npm run dev           # Next.js auf Port 3000
```
