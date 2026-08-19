import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = async (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('internal evaluation is not mounted in the citizen shell', async () => {
  const router = await source('src/core/router/AppRouter.tsx');
  assert.match(router, /path: 'evaluate'/);
  assert.match(router, /requiredFeatureFlag="enableInternalEvaluation"/);
  assert.match(router, /allowedRoles=\{\['auditor', 'admin'\]\}/);
});

test('report submission has no fabricated offline case id or location', async () => {
  const store = await source('src/features/reporting/state/useReportingFlowStore.ts');
  const intake = await source('src/pages/public/IntakePage.tsx');
  assert.match(store, /latitude: null/);
  assert.match(store, /longitude: null/);
  assert.doesNotMatch(intake, /OFFLINE-\$\{Date\.now\(\)\}/);
  assert.doesNotMatch(intake, /CP-2026-9041/);
});

test('offline provider never clears queued work without an API contract', async () => {
  const provider = await source('src/core/providers/OfflineProvider.tsx');
  assert.match(provider, /Offline submission is not supported by the current API/);
  assert.doesNotMatch(provider, /setPendingDrafts\(\[\]\)/);
});

test('API failures use an Error-compatible normalized type and the shared token key', async () => {
  const client = await source('src/api/client.ts');
  assert.match(client, /class ApiError extends Error/);
  assert.match(client, /localStorage\.getItem\('nivaran_token'\)/);
});
