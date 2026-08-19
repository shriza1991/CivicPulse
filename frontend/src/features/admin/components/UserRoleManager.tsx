import React from 'react';
import { useAdminStore } from '../state/useAdminStore';
import type { UserRoleItem } from '../state/useAdminStore';
import { Select } from '../../../design-system/primitives/forms/Select';
import { UserCheck } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'citizen', label: 'Citizen User' },
  { value: 'officer', label: 'Government Officer' },
  { value: 'auditor', label: 'Independent Auditor' },
  { value: 'admin', label: 'System Administrator' },
];

export const UserRoleManager: React.FC = () => {
  const { users, updateUserRole } = useAdminStore();

  return (
    <div className="space-y-4 font-sans py-2">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-500/10 text-primary-700 rounded-pill">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">User Identity & Role Authorization Console</h3>
            <p className="text-xs text-neutral-700">Manage citizen accounts, officer assignments, and role permission boundaries</p>
          </div>
        </div>

        <span className="text-xs font-mono font-semibold text-primary-700 bg-primary-500/10 px-2.5 py-1 rounded-pill">
          {users.length} Registered Accounts
        </span>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-subtle overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 font-semibold text-neutral-700">
              <th className="p-3">User ID</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email Address</th>
              <th className="px-4 py-3">Assigned Department</th>
              <th className="px-4 py-3">Role Authorization</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                <td className="p-3 font-mono font-bold text-neutral-900">{user.id}</td>
                <td className="px-4 py-3 font-semibold text-neutral-900">{user.name}</td>
                <td className="px-4 py-3 font-mono text-neutral-700">{user.email}</td>
                <td className="px-4 py-3 text-neutral-900 font-medium">{user.department || '—'}</td>
                <td className="px-4 py-3 w-56">
                  <Select
                    name={`role-${user.id}`}
                    label={`Role for ${user.name}`}
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as UserRoleItem['role'])}
                    options={ROLE_OPTIONS}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
