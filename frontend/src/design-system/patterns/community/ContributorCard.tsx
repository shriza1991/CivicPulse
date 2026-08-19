import React from 'react';
import { Avatar } from '../../primitives/foundation/Avatar';
import { cn } from '../../../lib/utils';

export interface ContributorCardProps {
  name?: string;
  isAnonymous?: boolean;
  role?: string;
  contributionsCount?: number;
  className?: string;
}

export const ContributorCard: React.FC<ContributorCardProps> = ({
  name,
  isAnonymous = false,
  role = 'Citizen Contributor',
  contributionsCount = 1,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-3 p-2.5 bg-neutral-50 rounded-md border border-neutral-200 font-sans', className)}>
      <Avatar identityLevel={isAnonymous ? 'anonymous' : 'person'} name={name} size="md" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 truncate">
          {isAnonymous ? 'Anonymous Contributor' : name || 'Local Resident'}
        </p>
        <p className="text-xs text-neutral-700">{role}</p>
      </div>

      <span className="text-xs font-mono font-medium text-neutral-700 bg-white px-2 py-0.5 rounded-sm border border-neutral-200">
        {contributionsCount} report{contributionsCount > 1 ? 's' : ''}
      </span>
    </div>
  );
};
