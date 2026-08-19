# DATA MIGRATION AUDIT — Schema Alignment

## Current vs Target Schema Mapping

| Current Model / Table | Target Model / Entity | Schema Changes Needed | Migration Strategy |
|---|---|---|---|
| `users` (`id`, `email`, `role`, `hashed_password`) | `users` (`id`, `email`, `role`, `organization`, `country_code`) | Add `role` enum values (`planner`, `policymaker`), `organization`, `country_code` | Alembic migration script to add columns |
| `issues` (`id`, `title`, `description`, `category`, `latitude`, `longitude`, `credibility_score`, `photo_url`, `status`) | `demand_signals` (`id`, `title`, `description`, `category`, `lat`, `lng`, `trust_score`, `photo_url`, `audio_url`, `cluster_id`, `status`) | Rename fields for clarity (`credibility_score` → `trust_score`), add `cluster_id` FK, `audio_url` | Add `demand_signals` table / view and migrate existing `issues` rows |
| *(None)* | `demand_clusters` (`id`, `title`, `category`, `centroid_lat`, `centroid_lng`, `signal_count`, `priority_score`, `demographic_impact_score`, `status`) | **NEW TABLE REQUIRED** | Create table & indexes |
| *(None)* | `census_demographics` (`id`, `ward_id`, `population_density`, `vulnerable_ratio`, `poverty_rate`, `geometry`) | **NEW TABLE REQUIRED** | Create table & seed with open government census fixtures |
| *(None)* | `policy_recommendations` (`id`, `cluster_id`, `title`, `summary`, `action_type`, `estimated_budget`, `evidence_json`, `created_by`) | **NEW TABLE REQUIRED** | Create table for storing planner policy dossiers |
