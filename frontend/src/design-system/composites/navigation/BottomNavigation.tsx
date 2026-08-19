import React from 'react';
import { Home, FileText } from 'lucide-react';
import { FAB } from '../../primitives/buttons/FAB';
import { cn } from '../../../lib/utils';

export interface BottomNavigationProps {
  activeTab?: 'home' | 'report' | 'my-reports';
  onNavigate?: (tab: 'home' | 'report' | 'my-reports') => void;
  onReportClick?: () => void;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'home',
  onNavigate,
  onReportClick,
  className,
}) => {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 min-h-[64px] px-6 flex items-center justify-around font-sans md:hidden shadow-modal',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onNavigate?.('home')}
        aria-current={activeTab === 'home' ? 'page' : undefined}
        className={cn(
          'flex flex-col items-center justify-center min-w-[64px] min-h-[48px] p-1 transition-colors text-xs font-medium',
          activeTab === 'home' ? 'text-primary-700 font-semibold' : 'text-neutral-700 hover:text-neutral-900'
        )}
      >
        <Home className="w-5 h-5 mb-0.5" aria-hidden="true" />
        <span>Home</span>
      </button>

      <div className="-mt-6">
        <FAB
          label="Report"
          expanded={false}
          onClick={() => {
            onReportClick?.();
            onNavigate?.('report');
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => onNavigate?.('my-reports')}
        aria-current={activeTab === 'my-reports' ? 'page' : undefined}
        className={cn(
          'flex flex-col items-center justify-center min-w-[64px] min-h-[48px] p-1 transition-colors text-xs font-medium',
          activeTab === 'my-reports' ? 'text-primary-700 font-semibold' : 'text-neutral-700 hover:text-neutral-900'
        )}
      >
        <FileText className="w-5 h-5 mb-0.5" aria-hidden="true" />
        <span>My Reports</span>
      </button>
    </nav>
  );
};
