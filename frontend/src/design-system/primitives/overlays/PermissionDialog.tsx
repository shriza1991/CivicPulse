import React from 'react';
import { Camera, MapPin, Bell, HardDrive, Shield } from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from '../buttons/Button';

export type PermissionType = 'camera' | 'location' | 'notifications' | 'storage';

export interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissionType: PermissionType;
  purpose: string;
  onContinue: () => void;
  onSkip?: () => void;
}

const permissionConfig: Record<PermissionType, { title: string; icon: React.ReactNode; defaultPurpose: string }> = {
  camera: {
    title: 'Camera Access Needed',
    icon: <Camera className="w-8 h-8 text-primary-700" aria-hidden="true" />,
    defaultPurpose: 'nivaran needs camera access to capture evidence photos with privacy metadata.',
  },
  location: {
    title: 'Location Services Needed',
    icon: <MapPin className="w-8 h-8 text-primary-700" aria-hidden="true" />,
    defaultPurpose: 'We use your location to pin civic reports accurately on municipal maps.',
  },
  notifications: {
    title: 'Notifications Permission',
    icon: <Bell className="w-8 h-8 text-primary-700" aria-hidden="true" />,
    defaultPurpose: 'Receive updates when government officers respond or community verifications occur.',
  },
  storage: {
    title: 'Local Storage Access',
    icon: <HardDrive className="w-8 h-8 text-primary-700" aria-hidden="true" />,
    defaultPurpose: 'Save offline draft reports locally when connectivity is unavailable.',
  },
};

export const PermissionDialog: React.FC<PermissionDialogProps> = ({
  open,
  onOpenChange,
  permissionType,
  purpose,
  onContinue,
  onSkip,
}) => {
  const config = permissionConfig[permissionType];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={config.title}
      size="sm"
      actions={
        <>
          {onSkip && (
            <Button
              variant="ghost"
              onClick={() => {
                onSkip();
                onOpenChange(false);
              }}
            >
              Skip for Now
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => {
              onContinue();
              onOpenChange(false);
            }}
          >
            Allow Access
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-2 space-y-3">
        <div className="p-4 bg-primary-500/10 rounded-pill">{config.icon}</div>
        <p className="text-sm text-neutral-700 leading-relaxed font-sans">
          {purpose || config.defaultPurpose}
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-700 pt-2 border-t border-neutral-100 w-full">
          <Shield className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
          <span>Your privacy is protected. You can revoke access anytime.</span>
        </div>
      </div>
    </Dialog>
  );
};
