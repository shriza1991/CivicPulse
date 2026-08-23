import React from 'react';
import { StatCard } from '../../../design-system/patterns/analytics/StatCard';
import { MetricCard } from '../../../design-system/patterns/analytics/MetricCard';
import { ChartWrapper } from '../../../design-system/patterns/analytics/ChartWrapper';
import { Sparkles, Bot, Cpu, UserCheck } from 'lucide-react';

export const SLAAnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-5 font-sans py-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Community Demand & Policy Intelligence</h2>
          <p className="text-xs text-neutral-600">Cross-region spatial demand signals, Indian census demographics, and AI-grounded policy briefs</p>
        </div>

        <span className="text-xs font-mono font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
          Active India Demand Scope
        </span>
      </div>

      {/* AI Pipeline Provenance Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-neutral-900 to-teal-950 text-white rounded-xl border border-slate-800 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 font-bold text-teal-400">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase tracking-widest text-[10px]">AI Pipeline & Decision Support Provenance</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">STAGE 1 ➔ 4 VERIFIED ARCHITECTURE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
            <span className="p-1 rounded bg-teal-950 text-teal-300 shrink-0"><Bot className="w-4 h-4" /></span>
            <div>
              <strong className="block text-white text-[11px]">1. Sarvam AI STT</strong>
              <span className="text-[10px] text-slate-300">Indian voice transcription (Hindi, Marathi, English)</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
            <span className="p-1 rounded bg-teal-950 text-teal-300 shrink-0"><Sparkles className="w-4 h-4" /></span>
            <div>
              <strong className="block text-white text-[11px]">2. Google Gemini 3.6</strong>
              <span className="text-[10px] text-slate-300">Multimodal perception & policy brief reasoning</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
            <span className="p-1 rounded bg-teal-950 text-teal-300 shrink-0"><Cpu className="w-4 h-4" /></span>
            <div>
              <strong className="block text-white text-[11px]">3. Deterministic Engine</strong>
              <span className="text-[10px] text-slate-300">Mathematical priority score calculation (0–100)</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
            <span className="p-1 rounded bg-teal-950 text-teal-300 shrink-0"><UserCheck className="w-4 h-4" /></span>
            <div>
              <strong className="block text-white text-[11px]">4. Human Planner Review</strong>
              <span className="text-[10px] text-slate-300">Mandatory public official approval & sanction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Demand Hotspots"
          value="12"
          sourceText="Multi-State Spatial Clusters"
          dateRange="Current Planning Cycle"
        />

        <MetricCard
          title="Affected Population Scope"
          metricValue="184,000"
          denominatorText="Residents"
          methodologyNote="Fused from Indian Census demographics across active hotspots."
        />

        <MetricCard
          title="Avg Hotspot Priority"
          metricValue="76.8 / 100"
          methodologyNote="Computed deterministically from severity, volume, and demographic weights."
        />

        <MetricCard
          title="Policy Briefs Ready"
          metricValue="8 Briefs"
          methodologyNote="Grounded Gemini 3.6 recommendations awaiting planner sign-off."
        />
      </div>

      {/* Infrastructure Demand Distribution Chart */}
      <ChartWrapper
        title="Infrastructure Demand Distribution by Sector"
        unit="Demand Signals"
        methodology="Aggregated from validated citizen voice, text, and photo demand records."
        data={[
          { label: 'Water & Drainage', value: 38 },
          { label: 'Roads & Transit', value: 29 },
          { label: 'Waste Management', value: 18 },
          { label: 'Healthcare & Lighting', value: 15 },
        ]}
      />
    </div>
  );
};
