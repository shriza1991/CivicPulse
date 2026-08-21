import React, { useState } from 'react';
import { Surface } from '../../../design-system/primitives/foundation/Surface';
import { Button } from '../../../design-system/primitives/buttons/Button';
import { Award, Play, CheckCircle2, RotateCcw, Bot, ShieldCheck, Landmark, CheckCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FULL_E2E_SIMULATION_STEPS = [
  {
    id: 'step-1',
    role: 'Citizen / Community',
    title: '1. Multilingual Voice & Evidence Demand Intake',
    description: 'Citizen speaks in Marathi/Hindi or uploads photo demand for drainage & stormwater upgrades in Kurla/Dharavi corridor.',
    icon: Bot,
    statusBadge: 'VOICE CAPTURED & TRANSCRIBED',
    details: 'Sarvam AI Speech-to-Text transcribed spoken audio. EXIF GPS coordinates locked at 19.068° N, 72.877° E. Structured demand record initialized.',
    actionLabel: 'Trigger Gemini Demand Perception',
  },
  {
    id: 'step-2',
    role: 'Google Gemini 2.5',
    title: '2. Multimodal Demand Understanding & Category Extraction',
    description: 'Gemini 2.5 processes spoken transcript and photo evidence, structuring need into category, urgency, and affected community scope.',
    icon: ShieldCheck,
    statusBadge: 'AI PERCEPTION: 96% CONFIDENCE',
    details: 'Extracted: Category=Drainage/Stormwater, Subcategory=Monsoon Waterlogging, Estimated Beneficiaries=4,500 residents. Evidence Trust Score=0.92.',
    actionLabel: 'Correlate with Spatial Demand Hotspot',
  },
  {
    id: 'step-3',
    role: 'Spatial Intelligence',
    title: '3. Semantic & Spatial Correlation → Demand Hotspot',
    description: 'Correlation engine links 6 nearby citizen demand signals within 300m into a unified Community Demand Hotspot.',
    icon: Landmark,
    statusBadge: 'HOTSPOT FORMED (#HOT-MUM-01)',
    details: 'Grouped 6 distinct citizen demands across Kurla West ward. Combined urgency elevated to High Community Priority.',
    actionLabel: 'Fuse Indian Demographic & Infra Data',
  },
  {
    id: 'step-4',
    role: 'Data Fusion Engine',
    title: '4. Indian Demographic, Infrastructure & Investment Fusion',
    description: 'Fuses census demographics (pop density: 38,500/km²), municipal infrastructure gap metrics, and current fiscal budget allocations.',
    icon: Landmark,
    statusBadge: 'DATA FUSION COMPLETE',
    details: 'Demographic vulnerability multiplier: 1.4x. Existing drain capacity deficit: 65%. Ward budget utilization: ₹4.2 Cr remaining.',
    actionLabel: 'Calculate Deterministic Priority Score',
  },
  {
    id: 'step-5',
    role: 'Deterministic Engine',
    title: '5. Deterministic Priority Score Calculation (0–100)',
    description: 'Computes objective, auditable priority score using mathematical weights (Severity 35%, Volume 25%, Demographics 20%, Investment Gap 20%).',
    icon: ShieldCheck,
    statusBadge: 'DETERMINISTIC SCORE: 88.4 / 100',
    details: 'Mathematical audit trail: Severity(29.5) + SignalVolume(22.0) + VulnerablePop(18.4) + InfraGap(18.5) = 88.4 (Tier 1 Critical Priority).',
    actionLabel: 'Generate Gemini Policy Brief',
  },
  {
    id: 'step-6',
    role: 'Gemini Policy Advisor',
    title: '6. Grounded Gemini 2.5 Policy & Budget Recommendation',
    description: 'Gemini generates evidence-grounded policy intervention brief with estimated CAPEX, ward scheme mapping, and execution timelines.',
    icon: CheckCircle,
    statusBadge: 'POLICY BRIEF GENERATED',
    details: 'Intervention: Box-drain culvert widening (450m). Scheme: AMRUT 2.0 / Municipal Stormwater Capex. Estimated Cost: ₹1.85 Cr. ROI: 4,500 residents protected.',
    actionLabel: 'Submit for Human Planner Authority',
  },
  {
    id: 'step-7',
    role: 'Planning Officer',
    title: '7. Human Planner Review & Infrastructure Sanction',
    description: 'Public Planning Officer inspects hotspot intelligence, verifies mathematical scores, and signs off on budget sanction.',
    icon: Bell,
    statusBadge: 'SANCTION APPROVED BY PLANNER',
    details: 'Human-in-the-loop sign-off complete. Project approved for FY26 Q2 capital works tender. Immutable audit trail registered.',
    actionLabel: 'Restart Simulation',
  },
];

export const EvaluationWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const activeStep = FULL_E2E_SIMULATION_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < FULL_E2E_SIMULATION_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setCurrentStepIdx(0);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
  };

  return (
    <div className="space-y-6 font-sans py-2">
      {/* Hackathon Evaluation Banner */}
      <Surface variant="card" className="p-6 space-y-4 border-l-4 border-l-amber-500 bg-white shadow-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-pill">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">CommonGround Judge & Evaluator Workspace</h2>
              <p className="text-xs text-neutral-700">Interactive walkthrough of the 7-stage Community Demand to Policy Intelligence pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-pill">
              STEP {currentStepIdx + 1} OF 7
            </span>
            <Button variant="ghost" size="sm" onClick={handleReset} leadingIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Flow
            </Button>
          </div>
        </div>

        {/* E2E Simulation Progress Tracker Bar */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {FULL_E2E_SIMULATION_STEPS.map((s, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStepIdx(idx)}
                className={`p-2 rounded text-left border text-[10px] font-bold transition-all ${
                  isCurrent
                    ? 'border-primary-500 bg-primary-50 text-primary-900 ring-2 ring-primary-500/20'
                    : isDone
                    ? 'border-green-300 bg-green-50 text-green-800'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                }`}
              >
                <div className="truncate">{idx + 1}. {s.role}</div>
              </button>
            );
          })}
        </div>
      </Surface>

      {/* Active Step Interactive Player Card */}
      <Surface variant="card" className="p-6 space-y-6 bg-white shadow-subtle border border-neutral-200">
        <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-pill">
                Role: {activeStep.role}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-pill">
                {activeStep.statusBadge}
              </span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">{activeStep.title}</h3>
            <p className="text-xs text-neutral-600">{activeStep.description}</p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            leadingIcon={currentStepIdx === FULL_E2E_SIMULATION_STEPS.length - 1 ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {activeStep.actionLabel}
          </Button>
        </div>

        {/* Live Simulation Details Surface */}
        <div className="p-4 rounded-lg bg-neutral-900 text-white font-mono text-xs space-y-2 border border-neutral-800">
          <div className="flex items-center justify-between text-teal-400 font-bold border-b border-neutral-800 pb-2">
            <span>[E2E SIMULATION RUNTIME ENGINES]</span>
            <span>STATUS: ACTIVE_VERIFIED</span>
          </div>
          <p className="text-neutral-300 leading-relaxed pt-1">
            {activeStep.details}
          </p>
        </div>

        {/* Interactive Workspace Deep-Link Shortcuts */}
        <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-neutral-500 font-medium">
            Jump to corresponding live application view:
          </span>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/report')}>
              Voice & Demand Intake
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/government/queue')}>
              Demand Hotspots & Advisor
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/tracker')}>
              Priority Intelligence Map
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/discover')}>
              India Demand Overview
            </Button>
          </div>
        </div>
      </Surface>

      {/* Complete Flow Stepper Timeline */}
      <Surface variant="card" className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">
          End-to-End Governance Audit Trail Checklist
        </h3>

        <div className="space-y-3">
          {FULL_E2E_SIMULATION_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div
                key={step.id}
                onClick={() => setCurrentStepIdx(idx)}
                className={`p-4 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                  isCurrent
                    ? 'border-primary-500 bg-primary-50/20 ring-2 ring-primary-500/20'
                    : isDone
                    ? 'border-green-200 bg-green-50/60 text-neutral-900'
                    : 'border-neutral-200 bg-neutral-50/50 text-neutral-500 opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-pill flex items-center justify-center text-xs font-bold shrink-0 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-primary-700 text-white'
                      : 'bg-neutral-300 text-neutral-700'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-neutral-900">{step.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">{step.role}</span>
                  </div>
                  <p className="text-xs text-neutral-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Surface>
    </div>
  );
};

