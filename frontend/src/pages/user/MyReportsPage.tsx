import React from 'react';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import { ReportsDashboard } from '../../features/account/components/ReportsDashboard';

export const MyReportsPage: React.FC = () => {
  usePageTitle('My Demands & Drafts — CommonGround');

  return <ReportsDashboard />;
};

export default MyReportsPage;
