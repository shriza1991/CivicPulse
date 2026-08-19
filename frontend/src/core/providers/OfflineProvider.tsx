import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OfflineDraft {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  payload: unknown;
}

export interface OfflineContextType {
  pendingDrafts: OfflineDraft[];
  pendingCount: number;
  saveDraft: (draft: Omit<OfflineDraft, 'id' | 'createdAt'>) => void;
  removeDraft: (id: string) => void;
  syncPendingQueue: () => Promise<void>;
  isSyncing: boolean;
  syncError: string | null;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingDrafts, setPendingDrafts] = useState<OfflineDraft[]>(() => {
    const saved = localStorage.getItem('nivaran_offline_queue');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('nivaran_offline_queue', JSON.stringify(pendingDrafts));
  }, [pendingDrafts]);

  const saveDraft = (draft: Omit<OfflineDraft, 'id' | 'createdAt'>) => {
    const newDraft: OfflineDraft = {
      ...draft,
      id: `DRAFT-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPendingDrafts((prev) => [...prev, newDraft]);
  };

  const removeDraft = (id: string) => {
    setPendingDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const syncPendingQueue = async () => {
    if (pendingDrafts.length === 0) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      throw new Error('Offline submission is not supported by the current API. Review and submit this report while online.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Offline submission is unavailable.';
      setSyncError(message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        pendingDrafts,
        pendingCount: pendingDrafts.length,
        saveDraft,
        removeDraft,
        syncPendingQueue,
        isSyncing,
        syncError,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
