import React, { useState } from 'react';
import { useAdminStore } from '../state/useAdminStore';
import { Button } from '../../../design-system/primitives/buttons/Button';
import { ShieldCheck, Download, Search } from 'lucide-react';

export const AuditLogExplorer: React.FC = () => {
  const { auditLogs } = useAdminStore();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.actor.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.entityId.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Timestamp,Actor,Role,Action,EntityID,Hash']
        .concat(
          auditLogs.map(
            (l) => `${l.id},${l.timestamp},${l.actor},${l.role},${l.action},${l.entityId},${l.hash}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nivaran_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-sans py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-500/10 text-primary-700 rounded-pill">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Cryptographic Immutable Audit Log Explorer</h3>
            <p className="text-xs text-neutral-700">Chronological verification ledger of all municipal dispatches and citizen votes</p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          leadingIcon={<Download className="w-4 h-4" />}
        >
          Export Audit Log (CSV)
        </Button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Filter audit log by actor, action, or case ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full min-h-[44px] pl-10 pr-4 text-sm border border-neutral-200 rounded-md font-sans focus:ring-2 focus:ring-primary-500 outline-none"
        />
        <Search className="w-4 h-4 text-neutral-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-subtle overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 font-semibold text-neutral-700">
              <th className="p-3">Log ID</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Actor / Role</th>
              <th className="px-4 py-3">Audit Action</th>
              <th className="px-4 py-3">Target Entity</th>
              <th className="px-4 py-3 text-right">Cryptographic Hash</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                <td className="p-3 font-mono font-bold text-neutral-900">{log.id}</td>
                <td className="px-4 py-3 font-mono text-neutral-700">{log.timestamp}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {log.actor}{' '}
                  <span className="text-[10px] font-mono text-primary-700 bg-primary-500/10 px-1 py-0.5 rounded-sm">
                    {log.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-900">{log.action}</td>
                <td className="px-4 py-3 font-mono text-neutral-700">{log.entityId}</td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-700 text-right">{log.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
