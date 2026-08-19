import React, { useState } from 'react';
import { Map, List } from 'lucide-react';
import { Button } from '../../primitives/buttons/Button';
import { cn } from '../../../lib/utils';

export interface MapWrapperProps {
  children?: React.ReactNode;
  listFallback?: React.ReactNode;
  title?: string;
  className?: string;
}

export const MapWrapper: React.FC<MapWrapperProps> = ({
  children,
  listFallback,
  title = 'Civic Reports Map Context',
  className,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  return (
    <div className={cn('relative w-full font-sans rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100', className)}>
      <div className="bg-white px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between z-20 relative">
        <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>

        <div className="flex items-center gap-1.5">
          <Button
            variant={viewMode === 'map' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
            leadingIcon={<Map className="w-4 h-4" />}
          >
            Map View
          </Button>

          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            leadingIcon={<List className="w-4 h-4" />}
          >
            List Fallback
          </Button>
        </div>
      </div>

      <div className="relative min-h-[360px] flex items-center justify-center">
        {viewMode === 'map' ? (
          <div className="w-full h-full relative flex items-center justify-center bg-neutral-200">
            {children || (
              <div className="text-center p-6 space-y-2">
                <Map className="w-10 h-10 text-neutral-700 mx-auto" />
                <p className="text-sm font-medium text-neutral-900">Map Rendering Surface</p>
                <p className="text-xs text-neutral-700">
                  Interactive Leaflet/MapLibre adapter layers render markers here.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full p-4 bg-white min-h-[360px] animate-fade">
            {listFallback || (
              <p className="text-sm text-neutral-700 text-center py-8">
                Accessible list view fallback for civic reports.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
