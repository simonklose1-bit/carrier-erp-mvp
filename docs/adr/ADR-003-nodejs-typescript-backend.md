# ADR-003: Node.js / TypeScript für Backend-Services

**Status:** Accepted  
**Date:** 2025-06

## Context

Das Backend muss JSON-APIs, Event-Handling (RabbitMQ), und Business-Logik (Rollover-Algorithmus, B/L-Amendment) abbilden. KI-nahe und datenintensive Services (AI Agents) werden separat in Python/FastAPI implementiert.

## Decision

**Node.js 20 mit TypeScript 5** für alle ERP-Kern-Services. Framework: **Express** (leichtgewichtig, gut verstanden). ORM: **Prisma** (typsicheres Schema, Migrations, Code Generation). Validation: **Zod** (Type-safe Schemas mit Laufzeit-Validierung).

## Consequences

**Positiv:**
- Geteilte Typen zwischen Frontend (Next.js) und Backend möglich
- Großes Ökosystem für Shipping-Utilities und EDI-Libraries
- Prisma generiert TypeScript-Typen direkt aus dem Datenbankschema

**Negativ:**
- Single-threaded — CPU-intensive Berechnungen (z.B. Rollover-Optimizer) müssen in Worker Threads oder separate Services ausgelagert werden

## Python FastAPI für AI-Services

Sales Agent, Booking Agent, Operations Agent, Equipment Agent, Finance Agent werden als separate FastAPI-Services implementiert und kommunizieren via REST/gRPC mit dem Node.js-Core.
