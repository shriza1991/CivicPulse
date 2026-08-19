import { useState, useEffect } from 'react';

export interface ModerationItem {
  id: string;
  caseId: string;
  reportType: 'flagged_photo' | 'spam' | 'duplicate_appeal' | 'offensive_comment';
  description: string;
  flaggedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  timestamp: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  entityId: string;
  hash: string;
}

export interface UserRoleItem {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'officer' | 'auditor' | 'admin';
  department?: string;
  status: 'active' | 'suspended';
}

const INITIAL_MODERATION: ModerationItem[] = [
  {
    id: 'MOD-101',
    caseId: 'CP-2026-881',
    reportType: 'flagged_photo',
    description: 'Photo flagged for low clarity / vehicle license plate blur check.',
    flaggedBy: 'Automated AI Moderator',
    status: 'pending',
    timestamp: '20 mins ago',
  },
  {
    id: 'MOD-102',
    caseId: 'CP-2026-884',
    reportType: 'duplicate_appeal',
    description: 'Citizen appealed automatic duplicate grouping with #CP-2026-882.',
    flaggedBy: 'User Appeal',
    status: 'pending',
    timestamp: '2 hours ago',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'LOG-9001',
    timestamp: '2026-07-21 20:45:12',
    actor: 'Officer R. Verma',
    role: 'officer',
    action: 'OFFICIAL_RESPONSE_PUBLISHED',
    entityId: 'CP-2026-881',
    hash: '0x7f8a...3d9b',
  },
  {
    id: 'LOG-9002',
    timestamp: '2026-07-21 20:30:04',
    actor: 'System AI Engine',
    role: 'system',
    action: 'SEVERITY_AUTO_TRIAGED',
    entityId: 'CP-2026-882',
    hash: '0x4c2e...8b1a',
  },
];

const INITIAL_USERS: UserRoleItem[] = [
  { id: 'USR-1', name: 'Priya Sharma', email: 'priya@noida.gov.in', role: 'citizen', status: 'active' },
  { id: 'USR-2', name: 'R. Verma', email: 'verma@pwddelhi.gov.in', role: 'officer', department: 'Public Works Dept', status: 'active' },
  { id: 'USR-3', name: 'S. Sharma', email: 'sharma@jalboard.gov.in', role: 'officer', department: 'Jal Board', status: 'active' },
  { id: 'USR-4', name: 'System Admin', email: 'admin@nivaran.gov.in', role: 'admin', status: 'active' },
];

export function useAdminStore() {
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>(() => {
    const saved = localStorage.getItem('nivaran_moderation_queue');
    return saved ? JSON.parse(saved) : INITIAL_MODERATION;
  });

  const [auditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('nivaran_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [users, setUsers] = useState<UserRoleItem[]>(() => {
    const saved = localStorage.getItem('nivaran_user_roles');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [featureFlags, setFeatureFlags] = useState({
    aiAutoTriaging: true,
    whatsAppIntegration: true,
    anonymousReporting: true,
    judgeEvaluationMode: true,
  });

  useEffect(() => {
    localStorage.setItem('nivaran_moderation_queue', JSON.stringify(moderationQueue));
  }, [moderationQueue]);

  useEffect(() => {
    localStorage.setItem('nivaran_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('nivaran_user_roles', JSON.stringify(users));
  }, [users]);

  const updateModerationStatus = (id: string, status: 'approved' | 'rejected' | 'archived') => {
    setModerationQueue((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const updateUserRole = (id: string, role: UserRoleItem['role']) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const toggleFeatureFlag = (key: keyof typeof featureFlags) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return {
    moderationQueue,
    auditLogs,
    users,
    featureFlags,
    updateModerationStatus,
    updateUserRole,
    toggleFeatureFlag,
  };
}
