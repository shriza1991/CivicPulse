import React, { useState } from 'react';
import { EvidenceGallery } from '../../../design-system/composites/evidence/EvidenceGallery';
import { ImageComparison } from '../../../design-system/composites/evidence/ImageComparison';
import { EvidenceViewer } from '../../../design-system/composites/evidence/EvidenceViewer';
import type { Issue } from '../../../api/types';

export interface ComprehensiveEvidenceGalleryProps {
  issue: Issue;
  className?: string;
}

export const ComprehensiveEvidenceGallery: React.FC<ComprehensiveEvidenceGalleryProps> = ({
  issue,
  className,
}) => {
  const [viewerOpen, setViewerOpen] = useState(false);

  const items = [
    {
      id: issue.id,
      title: issue.description || `${issue.issue_type.replace('_', ' ').toUpperCase()} Evidence`,
      mediaUrl: issue.photo_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop',
      locality: `Lat: ${issue.latitude.toFixed(3)}, Lng: ${issue.longitude.toFixed(3)}`,
      timestamp: new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  return (
    <div className={`p-6 bg-white border border-neutral-200 rounded-lg shadow-subtle font-sans space-y-4 ${className || ''}`}>
      <h3 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">
        Evidence Asset Inspection Gallery
      </h3>

      <EvidenceGallery
        items={items}
        onInspectItem={() => setViewerOpen(true)}
      />

      {/* Before/After Repair Comparison Slider */}
      {issue.status === 'approved' && (
        <div className="pt-4 border-t border-neutral-100">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3">
            Before / After Repair Comparison Slider
          </h4>
          <ImageComparison
            beforeUrl={issue.photo_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop'}
            afterUrl="https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop"
            beforeLabel="Initial Hazard Report"
            afterLabel="Verified Municipal Repair"
          />
        </div>
      )}

      {/* Full Screen Evidence Viewer Modal */}
      <EvidenceViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        title={issue.description || 'Civic Evidence Asset Inspection'}
        mediaUrl={issue.photo_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop'}
        altText={issue.description || 'Civic evidence image asset'}
        locality={`Lat: ${issue.latitude.toFixed(3)}, Lng: ${issue.longitude.toFixed(3)}`}
        timestamp={new Date(issue.created_at).toLocaleString()}
      />
    </div>
  );
};
