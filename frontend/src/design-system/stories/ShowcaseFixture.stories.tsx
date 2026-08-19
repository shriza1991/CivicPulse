import React, { useState } from 'react';
import { Typography } from '../primitives/foundation/Typography';
import { Divider } from '../primitives/foundation/Divider';
import { Avatar } from '../primitives/foundation/Avatar';
import { Logo } from '../primitives/foundation/Logo';
import { Surface } from '../primitives/foundation/Surface';
import { Button } from '../primitives/buttons/Button';
import { FAB } from '../primitives/buttons/FAB';
import { IconButton } from '../primitives/buttons/IconButton';
import { SplitButton } from '../primitives/buttons/SplitButton';
import { TextField } from '../primitives/forms/TextField';
import { Checkbox } from '../primitives/forms/Checkbox';
import { Switch } from '../primitives/forms/Switch';
import { StatusChip } from '../composites/status/StatusChip';
import { Alert } from '../primitives/feedback/Alert';
import { Progress } from '../primitives/feedback/Progress';
import { EvidenceCard } from '../composites/evidence/EvidenceCard';
import { GovernmentEvent } from '../composites/timeline/GovernmentEvent';
import { VerificationEvent } from '../composites/timeline/VerificationEvent';
import { QueueRow } from '../patterns/government/QueueRow';
import { StatCard } from '../patterns/analytics/StatCard';
import { CheckCircle2 } from 'lucide-react';

export const SystemComponentShowcase: React.FC = () => {
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <div className="p-8 bg-neutral-50 min-h-screen font-sans space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <Logo size="lg" />
          <Typography variant="caption" tone="muted" className="mt-1">
            Phase 13 Production Design System Showcase
          </Typography>
        </div>
        <StatusChip category="verified" label="System Production Ready" />
      </div>

      {/* 1. Foundation Primitives */}
      <Surface variant="card" className="p-6 space-y-4">
        <Typography variant="heading">1. Foundation Primitives</Typography>
        <Divider />
        <div className="flex flex-wrap gap-4 items-center">
          <Avatar identityLevel="verified" name="Official Admin" size="lg" />
          <Avatar identityLevel="person" name="Priya Sharma" size="md" />
          <Avatar identityLevel="anonymous" size="md" />
          <Avatar identityLevel="organization" name="Municipal Corp" size="md" />
        </div>
      </Surface>

      {/* 2. Action Controls */}
      <Surface variant="card" className="p-6 space-y-4">
        <Typography variant="heading">2. Action Controls & Buttons</Typography>
        <Divider />
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="danger">Danger Action</Button>
          <Button variant="tertiary">Tertiary Action</Button>
          <IconButton icon={<CheckCircle2 className="w-5 h-5" />} label="Approve" tone="success" />
          <FAB label="Report Issue" />
          <SplitButton
            primaryLabel="Dispatch Team"
            onPrimaryClick={() => alert('Dispatched')}
            items={[
              { id: '1', label: 'Escalate to Mayor', onSelect: () => alert('Escalated') },
              { id: '2', label: 'Hold Case', onSelect: () => alert('Held') },
            ]}
          />
        </div>
      </Surface>

      {/* 3. Forms */}
      <Surface variant="card" className="p-6 space-y-4">
        <Typography variant="heading">3. Form Primitives</Typography>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField name="demo" label="Location Address" placeholder="Enter landmark or street" required />
          <div className="space-y-2 pt-6">
            <Checkbox label="Acknowledge EXIF Privacy Policy" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            <Switch label="Enable Realtime Offline Push Sync" checked={switchOn} onChange={setSwitchOn} />
          </div>
        </div>
      </Surface>

      {/* 4. Feedback & Status */}
      <Surface variant="card" className="p-6 space-y-4">
        <Typography variant="heading">4. Feedback & Status Chips</Typography>
        <Divider />
        <div className="flex flex-wrap gap-2">
          <StatusChip category="verified" label="Verified Repair" />
          <StatusChip category="government" label="Official Acknowledged" />
          <StatusChip category="community" label="12 Matched Nearby" />
          <StatusChip category="ai" label="AI Suggested Category" />
          <StatusChip category="danger" label="SLA Breached" />
        </div>
        <Progress value={75} showPercentage label="Evidence Dispatch Queue" />
        <Alert tone="success" title="Dispatch Successful">
          Official ticket reference CP-2026-8812 has been acknowledged by Road Maintenance Authority.
        </Alert>
      </Surface>

      {/* 5. Evidence & Timeline */}
      <Surface variant="card" className="p-6 space-y-4">
        <Typography variant="heading">5. Evidence & Narrative Timeline</Typography>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EvidenceCard
            id="EVID-881"
            title="Road Pothole Inspection"
            timestamp="10:14 AM"
            locality="Sector 62, Noida"
            mediaUrl="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop"
          />
          <StatCard label="Total Resolved Issues" value="14,892" dateRange="FY 2026" />
        </div>
        <div className="space-y-4 pt-2">
          <GovernmentEvent
            title="Official Dispatch Issued"
            department="Public Works Dept"
            officerName="Officer Verma"
            timestamp="11:30 AM"
            officialDirective="Heavy machinery dispatched for asphalt repaving."
          />
          <VerificationEvent
            verifierName="Community Audit Board"
            timestamp="02:15 PM"
            criteriaChecked={['Physical pothole sealed', 'Surrounding road leveled', 'Traffic safety restored']}
          />
        </div>
      </Surface>

      {/* 6. Institutional Queue */}
      <Surface variant="card" className="p-6 space-y-4">
        <Typography variant="heading">6. Executive Institutional Queue Table</Typography>
        <Divider />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b font-semibold text-xs text-neutral-700">
                <th className="p-2">Case ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Department</th>
                <th className="p-2">Status</th>
                <th className="p-2">SLA</th>
              </tr>
            </thead>
            <tbody>
              <QueueRow
                caseId="CP-102"
                title="Broken Water Pipe Leak"
                department="Water Supply Board"
                ageDays={1}
                slaDueHours={18}
                statusLabel="In Progress"
                isHighRisk
              />
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
};
