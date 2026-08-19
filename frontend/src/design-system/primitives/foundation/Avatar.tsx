import React, { useState } from 'react';
import { User, Building2, ShieldCheck, UserX } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type IdentityLevel = 'anonymous' | 'person' | 'organization' | 'verified';
export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  identityLevel?: IdentityLevel;
  src?: string;
  name?: string;
  size?: AvatarSize;
  interactive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const iconSizes: Record<AvatarSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  identityLevel = 'person',
  src,
  name,
  size = 'md',
  interactive = false,
  className,
  onClick,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const isAnon = identityLevel === 'anonymous';
  const displayName = isAnon ? 'Anonymous Contributor' : name || 'User';
  const altText = isAnon ? 'Anonymous Contributor Avatar' : `${displayName} Avatar`;

  let content: React.ReactNode;

  if (isAnon) {
    content = (
      <div className="w-full h-full bg-neutral-200 text-neutral-700 flex items-center justify-center rounded-pill">
        <UserX size={iconSizes[size]} aria-hidden="true" />
      </div>
    );
  } else if (src && !imageError) {
    content = (
      <img
        src={src}
        alt={altText}
        onError={() => setImageError(true)}
        className="w-full h-full object-cover rounded-pill"
      />
    );
  } else {
    const initials = name ? getInitials(name) : null;
    const bgClass =
      identityLevel === 'verified'
        ? 'bg-success text-white'
        : identityLevel === 'organization'
        ? 'bg-government text-white'
        : 'bg-primary-700 text-white';

    content = (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center font-medium rounded-pill relative',
          bgClass
        )}
      >
        {initials ? (
          <span>{initials}</span>
        ) : identityLevel === 'organization' ? (
          <Building2 size={iconSizes[size]} aria-hidden="true" />
        ) : (
          <User size={iconSizes[size]} aria-hidden="true" />
        )}

        {identityLevel === 'verified' && (
          <span className="absolute -bottom-0.5 -right-0.5 bg-white text-success rounded-pill p-0.5 shadow-sm">
            <ShieldCheck size={12} aria-hidden="true" />
          </span>
        )}
      </div>
    );
  }

  const container = (
    <div
      className={cn(
        'relative inline-block rounded-pill select-none shrink-0',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {content}
    </div>
  );

  if (interactive || onClick) {
    return (
      <button
        type="button"
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        className="inline-flex items-center justify-center min-w-[48px] min-h-[48px] p-1 rounded-pill hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary-500 transition-opacity"
        aria-label={`View profile for ${displayName}`}
      >
        {container}
      </button>
    );
  }

  return container;
};
