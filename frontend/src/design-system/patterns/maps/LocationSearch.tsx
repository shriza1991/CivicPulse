import React from 'react';
import { Search } from '../../primitives/forms/Search';

export interface LocationSearchProps {
  onSelectLocation?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelectLocation,
  placeholder = 'Search ward, landmark or locality...',
  className,
}) => {
  return (
    <Search
      label="Search map location"
      placeholder={placeholder}
      onSearchChange={onSelectLocation}
      className={className}
    />
  );
};
