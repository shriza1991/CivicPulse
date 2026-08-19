import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, ShieldCheck } from 'lucide-react';
import { Avatar } from '../../primitives/foundation/Avatar';
import { cn } from '../../../lib/utils';

export interface ProfileMenuProps {
  userName: string;
  role?: string;
  avatarUrl?: string;
  onSettings?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userName,
  role = 'Verified Citizen',
  avatarUrl,
  onSettings,
  onLogout,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={menuRef} className={cn('relative inline-block text-left font-sans', className)}>
      <Avatar
        name={userName}
        src={avatarUrl}
        size="md"
        interactive
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 rounded-md bg-white border border-neutral-200 shadow-modal z-50 py-2 animate-fade"
        >
          <div className="px-4 py-2 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-900 truncate">{userName}</p>
            <p className="text-xs text-neutral-700 font-medium flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              {role}
            </p>
          </div>

          <button
            role="menuitem"
            onClick={() => {
              onSettings?.();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-900 hover:bg-neutral-100 flex items-center gap-2 min-h-[44px]"
          >
            <Settings className="w-4 h-4 text-neutral-700" />
            Account & Privacy Settings
          </button>

          <button
            role="menuitem"
            onClick={() => {
              onLogout?.();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-medium text-danger hover:bg-red-50 flex items-center gap-2 min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
