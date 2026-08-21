# 12 — Technology Decisions

## Principle
Use the cheapest reliable technology that supports the hackathon requirement.

## Google AI
Required integration:
**Gemini API** as a real intelligence component.

Do not make the entire stack Google-only unless a service materially improves the result.

## Application
Frontend:
React + Vite + TypeScript + Tailwind.

Backend:
FastAPI + Python.

## Database
Preferred:
Supabase-managed PostgreSQL for prototype simplicity.

Why:
- relational domain
- joins/aggregations
- structured data model
- convenient auth/storage/realtime options
- easy migration path.

Firebase is not required merely because it is a Google product.

## Geospatial
Start with:
MapLibre + OpenStreetMap and server-side Python geospatial processing where suitable.

Use Google Maps/Earth Engine if/when they materially improve a demonstrated requirement and budget/credits permit.

## Storage
Use a managed low-cost/free object storage option for evidence files.

## Deployment
Start with an economical reliable deployment.
Keep deployment provider abstracted.
Use Google Cloud services when they provide measurable value or credits are available.

## Data Processing
Python/Pandas/GeoPandas/Shapely as appropriate.

## Secrets
Never commit:
- Gemini keys
- database passwords
- provider tokens
- webhook secrets.

Use environment configuration.

## Architecture
Adapters should isolate:
- AI provider
- data source
- map provider
- storage provider
- deployment provider.

This preserves portability and Digital Public Good positioning.
