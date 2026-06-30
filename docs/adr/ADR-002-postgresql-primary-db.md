# ADR-002: PostgreSQL als primäre Datenbank

**Status:** Accepted  
**Date:** 2025-06

## Context

Das ERP benötigt ACID-Transaktionen (Booking, B/L-Amendments), komplexe relationale Abfragen (Allokation, Rollover-Suche) und JSONB für flexible Strukturen (Port Rotation, Changed Fields in Amendment Logs).

## Decision

**PostgreSQL 16** als primäre Datenbank. Ergänzende Stores:
- **Redis** — Session-Cache, Queue-basierte Jobs, Real-time-Feeds
- **MinIO (S3-kompatibel)** — Dokumente (B/L PDFs, EDIFACT-Rohdaten)
- **TimescaleDB** — Vessel-Events, AIS-Daten, Zeitreihenanalyse (spätere Phase)

## Consequences

**Positiv:**
- JSONB für Port Rotation und Amendment-Diffs ohne Schema-Migration
- Starke Transaktionsgarantien für B/L-Lifecycle und Rollover-Operationen
- Prisma ORM unterstützt PostgreSQL nativ mit Type Safety

**Negativ:**
- Horizontale Skalierung komplexer als bei NoSQL
- TimescaleDB erfordert eigene Instanz

## Alternativen verworfen

- **MongoDB:** Keine ACID-Transaktionen über Dokumente hinweg — kritisch für B/L-Amendment-Prozess
- **MySQL:** Schlechtere JSONB-Unterstützung, weniger PostgreSQL-Extensions
