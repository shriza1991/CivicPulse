import React from 'react';
import { Home, FileText, PlusCircle, ChevronLeft, ChevronRight, ShieldAlert, BarChart3, Users, Settings } from 'lucide-react';
import { Logo } from '../../primitives/foundation/Logo';
import { useAuth } from '../../../core/providers/AuthProvider';
import { cn } from '../../../lib/utils';

export interface SidebarProps {
  activeDestination?: string;
  onNavigate?: (destId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeDestination = 'home',
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  className,
}) => {
  const { role, user } = useAuth();

  const getRoleDisplayName = (r: string) => {
    switch (r) {
      case 'officer': return 'Planning Officer';
      case 'department_admin': return 'District / State Planner';
      case 'auditor': return 'Policy Reviewer';
      case 'institution': return 'Community Facilitator';
      case 'admin': return 'System Administrator';
      case 'citizen': return 'Citizen';
      default: return 'Citizen';
    }
  };

  const getNavItems = () => {
    switch (role) {
      case 'officer':
      case 'department_admin':
        return [
          { id: 'government', label: 'Demand Hotspots', icon: <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" /> },
          { id: 'tracker', label: 'Priority Intelligence', icon: <FileText className="w-5 h-5 shrink-0 text-teal-600" /> },
          { id: 'home', label: 'Community Demand', icon: <Home className="w-5 h-5 shrink-0" /> },
          { id: 'discover', label: 'India Overview', icon: <Users className="w-5 h-5 shrink-0" /> },
          { id: 'report', label: 'Intake Need', icon: <PlusCircle className="w-5 h-5 shrink-0" /> },
        ];
      case 'auditor':
        return [
          { id: 'government', label: 'Demand Hotspots', icon: <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" /> },
          { id: 'evaluate', label: 'Policy & Evaluation Review', icon: <BarChart3 className="w-5 h-5 shrink-0 text-indigo-600" /> },
          { id: 'tracker', label: 'Priority Intelligence', icon: <FileText className="w-5 h-5 shrink-0 text-teal-600" /> },
          { id: 'discover', label: 'India Overview', icon: <Users className="w-5 h-5 shrink-0" /> },
          { id: 'home', label: 'Community Demand', icon: <Home className="w-5 h-5 shrink-0" /> },
        ];
      case 'admin':
        return [
          { id: 'government', label: 'Demand Hotspots', icon: <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" /> },
          { id: 'tracker', label: 'Priority Intelligence', icon: <FileText className="w-5 h-5 shrink-0 text-teal-600" /> },
          { id: 'evaluate', label: 'Policy & Evaluation Review', icon: <BarChart3 className="w-5 h-5 shrink-0 text-indigo-600" /> },
          { id: 'discover', label: 'India Overview', icon: <Users className="w-5 h-5 shrink-0" /> },
          { id: 'home', label: 'Community Demand', icon: <Home className="w-5 h-5 shrink-0" /> },
          { id: 'admin', label: 'System Admin', icon: <Settings className="w-5 h-5 shrink-0 text-purple-600" /> },
        ];
      default:
        return [
          { id: 'home', label: 'Community Demand', icon: <Home className="w-5 h-5 shrink-0 text-teal-600" /> },
          { id: 'report', label: 'Submit Need', icon: <PlusCircle className="w-5 h-5 shrink-0 text-primary-600" /> },
          { id: 'tracker', label: 'Priority Intelligence', icon: <FileText className="w-5 h-5 shrink-0" /> },
          { id: 'discover', label: 'India Overview', icon: <Users className="w-5 h-5 shrink-0" /> },
        ];
    }
  };

  const items = getNavItems();

  return (
    <aside
      aria-label="Desktop primary navigation"
      className={cn(
        'hidden md:flex flex-col bg-white border-r border-neutral-200 h-screen sticky top-0 font-sans transition-all duration-300 z-30 select-none shadow-sm',
        collapsed ? 'w-16 p-2' : 'w-64 p-4',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6 h-10 border-b border-slate-100 pb-3">
        {!collapsed && <Logo size="sm" />}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600 min-w-[36px] min-h-[36px] inline-flex items-center justify-center transition-colors cursor-pointer"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = activeDestination === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate?.(item.id)}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 min-h-[44px] px-3 py-2.5 rounded-md font-medium text-sm transition-all text-left cursor-pointer',
                isActive
                  ? 'bg-primary-500/10 text-primary-700 font-bold border-l-4 border-primary-600 shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
                collapsed && 'justify-center px-0 border-l-0'
              )}
            >
              {item.icon}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Role Badge Indicator at Sidebar Bottom */}
      {!collapsed && user && (
        <div className="pt-3 mt-auto border-t border-slate-100 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 rounded-medium p-2.5 space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Active Stakeholder</span>
            <span className="font-bold text-slate-800 text-xs block truncate">{user.name}</span>
            <span className="inline-block bg-teal-100 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
              {getRoleDisplayName(role)}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
