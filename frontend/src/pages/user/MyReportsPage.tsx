import React from 'react';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import { ReportsDashboard } from '../../features/account/components/ReportsDashboard';

export const MyReportsPage: React.FC = () => {
  usePageTitle('My Reports & Drafts — civicpulse');

  return <ReportsDashboard />;
};

export default MyReportsPage;
