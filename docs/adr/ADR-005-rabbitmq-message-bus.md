# ADR-005: RabbitMQ als Message Bus

**Status:** Accepted  
**Date:** 2025-06

## Context

Kernprozesse wie Vessel Rollover, EDIFACT-Verarbeitung und B/L-Generierung müssen von externen Abhängigkeiten entkoppelt werden. Ein `schedule.change`-Event muss zuverlässig den Rollover-Service auslösen, auch wenn dieser temporär nicht verfügbar ist.

## Decision

**RabbitMQ** als Standard-Message-Bus. Queues:
- `schedule.change` — Trigger für Rollover-Service
- `booking.inbound` — eingehende Buchungen (INTTRA, GT Nexus)
- `edi.terminal` — EDIFACT-Nachrichten von Terminals
- `rollover.jobs` — Rollover-Aufgaben für manuellen Queue
- `bl.generation` — B/L-PDF-Generierung
- `invoice.outbound` — Ausgehende Rechnungen

**Dead Letter Queue (DLQ):** Nach 3 Retries landen Nachrichten in `*.dlq` für manuelle Bearbeitung im Ops-Dashboard.

## Kafka als Alternative

Bei dauerhaft hohem Volumen (> 10.000 Events/Tag auf einzelnen Queues) wird Migration zu **Kafka** evaluiert. Die Adapter-Schicht im Code abstrahiert die Message-Bus-Implementierung.

## Consequences

**Positiv:**
- Rollover-Service läuft asynchron — kein blocking der API
- DLQ-Pattern ermöglicht lückenlose Fehlerbehandlung
- RabbitMQ Management UI für Ops-Team verfügbar (Port 15672)

**Negativ:**
- Eventual Consistency zwischen Booking-Status und Rollover-Ergebnis muss im UI kommuniziert werden
