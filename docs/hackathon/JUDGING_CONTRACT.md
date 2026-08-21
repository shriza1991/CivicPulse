# JUDGING CONTRACT — Official Rubric & Evidence Alignment

**Track**: Track 1 — AI for Digital Public Infrastructure & Governance  
**Document Authority**: Level 3 (Evaluation Strategy)  

---

## 1. Official Judging Breakdown & Scoring Strategy

### Criterion 1: Problem-Solution Fit (20%)
- **Official Focus**: Addressing the disconnect between fragmented citizen requests and high-level infrastructure investment planning.
- **Nivaran Evidence**:
  - Shifts the hero object from isolated complaints to **Demand Hotspots**.
  - Eliminates administrative blind spots by surfacing verified citizen demand directly into policymaker planning workflows.
  - Transparent human-in-the-loop governance ensures AI assists rather than displaces public officials.

### Criterion 2: AI / Technical Execution (25%)
- **Official Focus**: Deep, meaningful Google AI integration combined with sound engineering architecture.
- **Nivaran Evidence**:
  - **Google Gemini 2.5 Flash**: Multimodal visual evidence verification, structured demand extraction, and evidence-grounded policy reasoning with schema enforcement.
  - **Sarvam AI**: Multilingual voice speech-to-text for Indian regional languages.
  - **Deterministic Engine**: Mathematical PostGIS spatial clustering and demographic data fusion — LLMs are never used to fabricate scores or numbers.
  - **Full Test Suite**: 108 backend tests (100% passing) and complete frontend smoke suite.

### Criterion 3: Depth & Reach Across India (20%)
- **Official Focus**: Accessibility across diverse Indian languages, geographies, and socio-economic demographics.
- **Nivaran Evidence**:
  - **Multilingual Voice Intake**: Voice recording and audio upload in Hindi, Marathi, and English.
  - **Indian Hierarchy**: Scalable mapping across Ward, District, and State levels.
  - **Demographic Vulnerability Weighting**: Fuses Census of India metrics (population density, poverty index, vulnerable ratio) to prioritize underserved communities.

### Criterion 4: Impact Potential (15%)
- **Official Focus**: Tangible governance improvements, evidence-backed public spending, and infrastructure ROI.
- **Nivaran Evidence**:
  - Quantifiable demand prioritization score directly informs annual capital budget allocations.
  - Accelerates policy drafting from weeks to seconds with structured intervention summaries and funding pathways.
  - Audit trail of citizen demand signals provides verifiable public accountability.

### Criterion 5: Deployability & Scalability (20%)
- **Official Focus**: Real-world cloud deployability, performance, security, and architectural scalability.
- **Nivaran Evidence**:
  - **Cloud Ready**: Render (Backend Docker), Vercel (React 19 Vite SPA), and Neon (PostgreSQL).
  - **Zero Local Dependency**: Clean fallback storage abstractions (`LocalStorageProvider` / `CloudinaryStorageProvider`).
  - **Cross-Border Portability**: Decoupled country and language adapters (`country_adapters.py`) demonstrating future BRICS extensibility.
