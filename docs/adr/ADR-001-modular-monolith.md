# ADR-001: Modular Monolith als initiale Architektur

**Status:** Accepted  
**Date:** 2025-06  
**Deciders:** Head of Process & Digitalization

## Context

Das ERP-System wird von Grund auf neu aufgebaut für eine Reederei mit ~50 Schiffen und ~150 Daily Users. Die Anforderungen sind gut verstanden in den Kernmodulen (Vessel, Schedule, Booking, B/L), aber die genauen Lastprofile und Skalierungsanforderungen für zukünftige Module sind noch unklar.

## Decision

**Modular Monolith first.** Klarer, strukturierter Monolith mit definierten Domain-Grenzen (je ein Verzeichnis pro Modul: `vessel/`, `booking/`, `documentation/` etc.). Jedes Modul kommuniziert nur über definierte Interfaces — keine direkten Cross-Module-Imports.

Die Middleware-Schicht (EDIFACT-Adapter, Message Bus, externe Booking-Konnektoren) wird von Beginn an als **separate Services** betrieben, da sie eine klare Entkopplung von externer Verfügbarkeit erfordert.

## Consequences

**Positiv:**
- Geringer Betriebsaufwand zu Beginn (ein Deployment, eine Datenbank)
- Einfaches lokales Development (kein Service-Mesh)
- Domain-Grenzen bereits klar definiert → Extraktion zu Microservices später möglich

**Negativ:**
- Bei starkem Wachstum muss Extraktion aktiv getrieben werden
- Technologie-Heterogenität innerhalb des Monolithen begrenzt (Python FastAPI für AI-Services bereits ausgelagert)

## Extraktion-Trigger

Ein Modul wird extrahiert, wenn:
- Unabhängige Deployments erforderlich werden
- Skalierung eines Moduls über den Rest hinausgeht
- Unterschiedliche SLA-Anforderungen entstehen
