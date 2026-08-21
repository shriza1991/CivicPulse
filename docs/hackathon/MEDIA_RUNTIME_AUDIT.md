# Media Runtime & Image Resolution Audit

## 1. Root Cause Analysis
- **Problem**: Overview demand cards and evidence gallery components displayed black rectangles / broken images for demo cases.
- **Root Cause**: 
  1. In `CaseCard.tsx` and `EvidenceCard.tsx` (design-system), `photo_url` / `mediaUrl` was fed directly to `<img>` without `getImageUrl()` resolution.
  2. In database seeder records, images are stored with paths such as `/static/uploads/demo_pothole1.jpg`.
  3. When accessing the frontend, `/static/uploads/demo_*.jpg` was unmapped in standalone frontend environments, whereas `getImageUrl` maps `demo_*` assets to the public root `/demo_*.jpg`.
  4. Containers used hardcoded `bg-neutral-900` with no `onError` fallback handlers, turning failed image loads into solid black boxes.

## 2. Solutions Implemented
- **URL Resolution**: All card and evidence components now route media paths through `getImageUrl(url)`.
- **Graceful Fallback**: Added `FALLBACK_PLACEHOLDER` data URI SVG ("Evidence Image Unavailable") in `onError` handlers across [CaseCard.tsx](file:///d:/Projects/CivicPulse/frontend/src/features/discovery/components/CaseCard.tsx), [EvidenceCard.tsx](file:///d:/Projects/CivicPulse/frontend/src/design-system/composites/evidence/EvidenceCard.tsx), and [IssueCard.tsx](file:///d:/Projects/CivicPulse/frontend/src/components/issue/IssueCard.tsx).
- **Background Styling**: Replaced `bg-neutral-900` with clean `bg-neutral-100` containers to avoid harsh black rectangular blocks.
- **Terminology**: Rebranded "View Case & Timeline" to "View Demand Intelligence" / "View Demand".
- **Default Filter**: [DiscoveryPage.tsx](file:///d:/Projects/CivicPulse/frontend/src/pages/public/DiscoveryPage.tsx) now filters out cross-border demo records by default to preserve the India-first overview.
