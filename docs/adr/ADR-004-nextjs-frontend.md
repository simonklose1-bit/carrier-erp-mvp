# ADR-004: Next.js als Frontend-Framework

**Status:** Accepted  
**Date:** 2025-06

## Context

Das ERP wird von ~150 Daily Users genutzt: Operations, Sales, Docs-Team, Finance. Zugang auch über Tablets und Terminal-PCs (Hafenlogistik). Rollenbasierte UI erforderlich (UserRole: ADMIN, OPS, SALES, DOCS, FINANCE).

## Decision

**Next.js 14 (App Router)** mit **Tailwind CSS** und **TanStack Query** für Server-State-Management.

PWA-Manifest wird von Beginn an konfiguriert, damit die App auf Tablets als Standalone-App installiert werden kann.

## Consequences

**Positiv:**
- App Router ermöglicht Server Components — geringere Client-Bundle-Größe für Listenseiten
- Tailwind CSS beschleunigt UI-Entwicklung ohne Design-System-Overhead
- TanStack Query löst Caching, Refetching und Optimistic Updates out-of-the-box

**Negativ:**
- App Router noch relativer Reifegrad — Breaking Changes in Routing-Conventions möglich

## Rollback

Falls App Router sich als Blocker erweist: Migration zu Pages Router ist mit begrenztem Aufwand möglich da keine komplexen Server Actions genutzt werden.
