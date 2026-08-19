# Antigravity Prompt — Build a Data Adapter

Implement one external/sample data adapter.

Before coding:
- read `05_DATA_ARCHITECTURE.md`
- read `07_CROSS_BORDER.md`
- inspect existing adapter patterns.

Input:
**SOURCE: <dataset/source>**
**COUNTRY: <country>**
**DATA TYPE: <population/infrastructure/investment>**

Requirements:
- normalize source-specific fields into the internal contract
- preserve source metadata
- preserve units and currency
- preserve retrieval date
- handle missing records
- never invent missing values
- include tests with representative fixtures
- expose deterministic behavior.

Do not couple the core domain logic to this source's schema.
