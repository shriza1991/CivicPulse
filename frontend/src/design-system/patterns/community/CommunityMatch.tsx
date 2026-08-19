import React from 'react';
import { Users } from 'lucide-react';
import { Surface } from '../../primitives/foundation/Surface';
import { Button } from '../../primitives/buttons/Button';
import { cn } from '../../../lib/utils';

export interface CommunityMatchProps {
  matchCount?: number;
  locality: string;
  explanation: string;
  onJoinGroup?: () => void;
  className?: string;
}

export const CommunityMatch: React.FC<CommunityMatchProps> = ({
  matchCount,
  locality,
  explanation,
  onJoinGroup,
  className,
}) => {
  return (
    <Surface
      variant="card"
      elevation={1}
      className={cn('p-4 border-l-4 border-l-community bg-violet-50/30 font-sans space-y-3', className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-community">
          <Users className="w-5 h-5" />
          <h4 className="text-base font-semibold text-neutral-900">
            {matchCount === undefined ? 'Nearby reports will be checked on submission' : `${matchCount} Similar Reports Grouped Nearby`}
          </h4>
        </div>

        <span className="text-xs font-medium text-community bg-violet-100 px-2 py-0.5 rounded-pill">
          {locality}
        </span>
      </div>

      <p className="text-xs text-neutral-900 leading-relaxed bg-white p-3 rounded-md border border-neutral-200">
        {explanation}
      </p>

      {onJoinGroup && (
        <div className="pt-1 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onJoinGroup} leadingIcon={<Users className="w-4 h-4 text-community" />}>
            Merge with Community Case Group
          </Button>
        </div>
      )}
    </Surface>
  );
};
