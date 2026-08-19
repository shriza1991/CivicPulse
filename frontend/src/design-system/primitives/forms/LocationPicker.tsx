import React, { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Button } from '../buttons/Button';
import { cn } from '../../../lib/utils';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  locality?: string;
  address?: string;
}

export interface LocationPickerProps {
  label?: string;
  value?: LocationCoordinates | null;
  onChange?: (coords: LocationCoordinates) => void;
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  label = 'Confirm Evidence Location',
  value,
  onChange,
  className,
}) => {
  const [coords, setCoords] = useState<LocationCoordinates | null>(value || null);
  const [isLocating, setIsLocating] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords: LocationCoordinates = {
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          locality: `Current Position (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
        };
        setCoords(newCoords);
        onChange?.(newCoords);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Could not auto-detect location. Please use manual address search below.');
        setIsLocating(false);
        setManualMode(true);
      }
    );
  };

  return (
    <div className={cn('w-full font-sans space-y-3', className)}>
      <label className="block text-sm font-medium text-neutral-900 select-none">
        {label}
      </label>

      <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-primary-500/10 rounded-pill text-primary-700 mt-0.5">
              <MapPin className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">
                {coords?.locality || 'No location selected'}
              </h4>
              <p className="text-xs font-mono text-neutral-700 mt-0.5">
                {coords ? `Lat: ${coords.latitude} | Lng: ${coords.longitude}` : 'Use Locate Me to add coordinates'}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            loading={isLocating}
            onClick={handleDetectLocation}
            leadingIcon={<Navigation className="w-4 h-4" />}
          >
            Locate Me
          </Button>
        </div>

        {!manualMode ? (
          <button
            type="button"
            onClick={() => setManualMode(true)}
            className="text-xs font-medium text-primary-700 underline underline-offset-2 hover:opacity-80 min-h-[44px] px-1 flex items-center"
          >
            Or search by landmark, ward or street address...
          </button>
        ) : (
          <div className="pt-2 border-t border-neutral-100 space-y-2">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Enter ward, street or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] pl-9 pr-3 text-xs border border-neutral-200 rounded-md font-sans focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <Search className="w-4 h-4 text-neutral-700 absolute left-3" />
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (searchQuery.trim()) {
                    if (!coords) return;
                    const updated = { ...coords, locality: searchQuery };
                    setCoords(updated);
                    onChange?.(updated);
                    setManualMode(false);
                  }
                }}
              >
                Set Location
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setManualMode(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
