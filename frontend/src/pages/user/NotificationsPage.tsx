import React from 'react';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import { NotificationCenter } from '../../features/account/components/NotificationCenter';
import { NotificationPreferences } from '../../features/account/components/NotificationPreferences';

export const NotificationsPage: React.FC = () => {
  usePageTitle('Notification Center & Preferences — nivaran');

  return (
    <div className="space-y-6 font-sans py-2">
      <NotificationCenter />
      <NotificationPreferences />
    </div>
  );
};

export default NotificationsPage;
