# 07 — Cross-Border Strategy

## Demonstration Countries
1. India — Mumbai
2. Brazil — São Paulo
3. South Africa — Johannesburg/Gauteng context

These are representative prototype contexts.

## Country-Neutral Core
Business logic must use:
- country
- administrative hierarchy
- localization
- infrastructure taxonomy
- data-source configuration

rather than hardcoded India-specific branches.

## Adapter Pattern

```text
CountryConfig
 ├─ GeographyAdapter
 ├─ LanguageAdapter
 ├─ DemographicDataAdapter
 ├─ InfrastructureDataAdapter
 └─ InvestmentDataAdapter
```

Common domain objects remain shared.

## Common Infrastructure Taxonomy
Use broad cross-border categories:
- Transport
- Water
- Sanitation
- Health
- Education
- Energy
- Public safety
- Resilience/environment

Country-specific terms can map to these canonical categories.

## Demo Data Rules
- Prefer verified public/open datasets.
- When sample/synthetic data is necessary, label it.
- Never present fabricated sample values as live government statistics.
- Preserve source metadata.

## Cross-Border Acceptance
A reviewer should be able to:
1. switch country
2. see relevant data layers
3. submit/inspect a localized demand
4. view the same pipeline
5. receive the same type of priority explanation.

The purpose is to demonstrate portability, not complete localization of every BRICS member.
