import React from 'react';
import { Surface } from '../../../design-system/primitives/foundation/Surface';
import { ShieldCheck, Award, CheckCircle2, Star } from 'lucide-react';

export interface CommunityTrustCardProps {
  className?: string;
}

export const CommunityTrustCard: React.FC<CommunityTrustCardProps> = ({ className }) => {
  return (
    <Surface variant="card" className={`p-6 space-y-4 font-sans ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2 text-primary-700 font-semibold">
          <Award className="w-5 h-5" />
          <h3 className="text-base text-neutral-900">Citizen Trust & Verification Reputation</h3>
        </div>

        <span className="text-xs font-mono font-bold text-success bg-green-100 px-2.5 py-1 rounded-pill flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Level 3 Verified Auditor
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md text-center">
          <span className="text-2xl font-bold text-neutral-900 font-sans">28</span>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mt-0.5">
            Physical Verifications
          </p>
        </div>

        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md text-center">
          <span className="text-2xl font-bold text-neutral-900 font-sans">98.4%</span>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mt-0.5">
            Audit Accuracy Score
          </p>
        </div>

        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md text-center">
          <span className="text-2xl font-bold text-neutral-900 font-sans">12</span>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 mt-0.5">
            Geotagged Evidence Uploads
          </p>
        </div>
      </div>

      <div className="pt-2 space-y-2 border-t border-neutral-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
          Earned Verification Badges
        </h4>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-900 bg-primary-500/10 px-2.5 py-1 rounded-md border border-primary-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary-700" /> Ground Auditor
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200">
            <Star className="w-3.5 h-3.5 text-amber-700" /> Ward 14 Top Contributor
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-green-100 px-2.5 py-1 rounded-md border border-green-200">
            <ShieldCheck className="w-3.5 h-3.5 text-success" /> Cryptographic Signer
          </span>
        </div>
      </div>
    </Surface>
  );
};
