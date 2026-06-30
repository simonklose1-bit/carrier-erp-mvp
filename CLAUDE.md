# Carrier ERP — Claude Code Projektkontext

## Projektübersicht

ERP-System für eine Reederei (~50 Schiffe, ~150 Daily Users). Iterativer Aufbau: Session 1 hat Architektur und Kernprozesse definiert.

**Session-Protokoll:** `docs/ERP-System Reederei - Session 1.txt`

## Architektur

**Modular Monolith** — klare Domain-Grenzen, kein Cross-Module-Import, Extraktion zu Microservices wo operativ sinnvoll.

```
backend/src/modules/
├── vessel/          # Schiffe (50 Schiffe, IMO, TEU-Kapazität)
├── schedule/        # Voyages, Port Rotation, ETA-Management
├── booking/         # Buchungen, Rollover-Logik
├── documentation/   # Bill of Lading, Amendment-Prozess
├── customer/        # CRM (offen)
├── pricing/         # Tarife, Surcharges (offen)
├── equipment/       # Container-Positionierung (offen)
├── allocation/      # Kunden & Reisen (offen)
├── haulage/         # Vor-/Nachlauf (offen)
└── invoicing/       # Rechnungsstellung (offen)
```

## Tech Stack

| Layer | Technologie |
|---|---|
| Backend | Node.js 20 + TypeScript + Express + Prisma |
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| DB primär | PostgreSQL 16 |
| Cache/Queue | Redis 7 |
| Message Bus | RabbitMQ 3.13 |
| Dokumente | MinIO (S3-kompatibel) |
| AI Agents | Python FastAPI + Claude API / LangGraph |

## Implementierte Module (Session 1)

- **Vessel** — CRUD, IMO-Validierung, VesselStatus
- **Schedule** — Voyages, Port Rotation, `applyScheduleChange` (publiziert `schedule.change`)
- **Booking** — Create, Confirm, Cancel, BookingRef-Generierung
- **Documentation** — B/L-Lifecycle: DRAFT → ISSUED → SURRENDERED → AMENDED, Amendment-Log

## Kritische Domänenlogik

### Rollover-Algorithmus (schedule.service.ts → TODO: rollover.worker.ts)
1. `schedule.change` Event auf RabbitMQ
2. Betroffene Buchungen laden (POL/POD-Match)
3. Delay über Threshold? → Optimizer sucht nächste Voyage
4. Auto-Rollover oder manuelle Queue (konfigurierbar per Kundengruppe)
5. Audit Log mit `actor: SYSTEM`

### B/L-Amendment-Regeln
| Status | Aktion |
|---|---|
| DRAFT | Auto-Update ohne Kundenkontakt |
| ISSUED | Surrender aller 3 Originale zuerst (→ 409 bis erledigt) |
| SURRENDERED | Amendment Draft direkt erstellen |

**B/L-Nummerierung:** `HBLU123456789/A1` — `blNumber` bleibt, `amendmentSeq` wird erhöht, `parent_bl_id` für Traceability.

## Conventions

- **Commits:** Conventional Commits — `feat(booking): add rollover trigger`
- **Module-Struktur:** `routes.ts → controller.ts → service.ts → schema.ts`
- **Validation:** Zod-Schemas in `*.schema.ts`
- **Fehler:** `createError(message, statusCode, code)` aus `shared/middleware/errorHandler`
- **Pagination:** `paginate()` aus `shared/types/pagination`
- **Tests:** Vitest, Integration Tests beschreiben Geschäftslogik

## Nächste Sessions

1. **Epic: Booking Creation** — ERD, OpenAPI-Spec, vollständige Implementierung + Tests
2. **Rollover-Worker** — RabbitMQ-Subscriber, Optimizer-Job
3. **Epic-Map** für alle 12 Module aufspannen
4. Equipment & Allocation klären
5. GDPR / Sanktionslisten-Compliance

## Lokales Setup

```bash
cp .env.example .env
docker compose up -d postgres redis rabbitmq minio
cd backend && npm install && npm run db:migrate && npm run dev
cd frontend && npm install && npm run dev
```
