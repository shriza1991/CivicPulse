import React from 'react';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import { CitizenProfileForm } from '../../features/account/components/CitizenProfileForm';
import { OfflineQueueInspector } from '../../features/account/components/OfflineQueueInspector';
import { NotificationPreferences } from '../../features/account/components/NotificationPreferences';

export const SettingsPage: React.FC = () => {
  usePageTitle('Account, Privacy & Offline Settings — nivaran');

  return (
    <div className="space-y-6 font-sans py-2">
      <CitizenProfileForm />
      <OfflineQueueInspector />
      <NotificationPreferences />
    </div>
  );
};

export default SettingsPage;
