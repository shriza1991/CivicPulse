import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { InstitutionalQueueLayout } from '../design-system/layouts/InstitutionalQueueLayout';
import { useAuth } from '../core/providers/AuthProvider';

export const GovernmentShell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return (localStorage.getItem('commonground_sidebar_collapsed') || localStorage.getItem('nivaran_sidebar_collapsed')) === 'true';
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('commonground_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'home') navigate('/');
    else if (tab === 'report') navigate('/report');
    else if (tab === 'tracker') navigate('/tracker');
    else if (tab === 'discover' || tab === 'my-reports') navigate('/discover');
    else if (tab === 'government') navigate('/government/queue');
    else if (tab === 'document-review') navigate('/government/queue');
    else if (tab === 'admin') navigate('/internal/admin');
    else if (tab === 'evaluate') navigate('/internal/evaluate');
    else if (tab === 'community') navigate('/community');
    else navigate('/');
  };

  return (
    <InstitutionalQueueLayout
      departmentName={user?.department || 'Public Planning Directorate'}
      queueCount={14}
      queueTable={<Outlet />}
      activeNav="government"
      onNavigate={handleNavigate}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={toggleSidebar}
    />
  );
};
