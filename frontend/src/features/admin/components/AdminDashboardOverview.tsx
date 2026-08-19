import React from 'react';
import { StatCard } from '../../../design-system/patterns/analytics/StatCard';
import { MetricCard } from '../../../design-system/patterns/analytics/MetricCard';
import { Surface } from '../../../design-system/primitives/foundation/Surface';
import { ShieldCheck, Activity } from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6 font-sans py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Platform Governance & Administration Overview</h2>
          <p className="text-xs text-neutral-700">System health telemetry, moderation queues, and operational controls</p>
        </div>

        <span className="text-xs font-mono font-semibold text-success bg-green-100 px-2.5 py-1 rounded-pill flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> All Services Operational
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered Citizens"
          value="1,420"
          sourceText="Verified Citizen Identities"
          dateRange="Ward 14 & 18"
        />

        <MetricCard
          title="Flagged Content Queue"
          metricValue="2 Items"
          methodologyNote="Pending evidence moderation inspection."
        />

        <MetricCard
          title="Cryptographic Ledger Integrity"
          metricValue="99.98%"
          methodologyNote="Immutable audit chain verification rate."
        />

        <MetricCard
          title="System Uptime"
          metricValue="100.0%"
          methodologyNote="Vite frontend & FastAPI gateway latency."
        />
      </div>

      <Surface variant="card" className="p-6 space-y-3 border-l-4 border-l-primary-500">
        <div className="flex items-center gap-2 text-primary-700 font-semibold">
          <Activity className="w-5 h-5" />
          <h3 className="text-base text-neutral-900">System Broadcast Announcement Banner</h3>
        </div>
        <p className="text-xs text-neutral-700 leading-relaxed">
          Active Municipal Dispatch Order #2026-07: Jal Board emergency crews dispatched to Indirapuram Sector 14 water main burst. Public ledger updates enabled.
        </p>
      </Surface>
    </div>
  );
};
