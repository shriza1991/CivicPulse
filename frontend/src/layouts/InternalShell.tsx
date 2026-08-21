import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../design-system/composites/navigation/Sidebar';
import { AppBar } from '../design-system/composites/navigation/AppBar';
import { Container } from '../design-system/primitives/foundation/Container';

export const InternalShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path.startsWith('/internal/evaluate')) return 'evaluate';
    if (path.startsWith('/internal/admin')) return 'admin';
    if (path.startsWith('/internal/document-review')) return 'document-review';
    return 'admin';
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
    <div className="min-h-screen bg-neutral-50 flex font-sans text-neutral-900">
      <Sidebar
        activeDestination={getActiveTab()}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AppBar
          title="CommonGround Policy Intelligence & Administration"
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 py-6">
          <Container width="wide">
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
};
