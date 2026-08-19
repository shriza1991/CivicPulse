# 05 — Data Architecture

## Core Entity Model

```text
Country
  └─ Region
      └─ Locality
          ├─ DemandCluster
          │   └─ DemandRequest
          │       └─ Evidence
          ├─ DemographicMetric
          ├─ InfrastructureMetric
          └─ InvestmentProject

DemandCluster
  ├─ PriorityAssessment
  └─ Recommendation
       └─ PolicyBrief
```

## Required Entities

### Country
- id
- name
- ISO/code
- default language
- supported languages
- administrative hierarchy configuration

### Region
- country_id
- external source ID
- name
- type
- geometry reference

### Locality
- region_id
- external source ID
- name
- type
- geometry reference

### DemandRequest
- id
- source_channel
- raw_text/transcript reference
- normalized_summary
- language
- location
- locality_id
- category
- timestamp
- processing_status
- evidence references

### Evidence
- id
- type
- storage reference
- validation status
- validation metadata
- provenance

### DemandCluster
- id
- locality_id
- category
- centroid
- member count
- verified member count
- semantic/spatial correlation metadata
- time window

### DemographicMetric
- locality/region ID
- metric
- value
- unit
- source
- retrieved_at

### InfrastructureMetric
- geography
- category
- metric
- value
- unit
- source
- retrieved_at

### InvestmentProject
- geography
- category
- project_name
- amount
- currency
- status
- start/end
- source
- retrieved_at

### PriorityAssessment
- cluster_id
- score
- factor breakdown
- model/version
- calculated_at

### Recommendation
- cluster_id
- title
- intervention
- rationale
- supporting facts
- uncertainty
- generated_by
- status

### PolicyBrief
- recommendation_id
- generated_content
- format
- language
- generated_at

### Decision
- recommendation_id
- reviewer
- action
- notes
- timestamp

## Data Integrity Rules
- External facts require provenance.
- Missing data is null/unknown, never fabricated.
- Units/currencies are explicit.
- Geographic IDs use source-neutral internal IDs with source mappings.
- Demo data is flagged in metadata.
