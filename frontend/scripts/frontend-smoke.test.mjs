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
  const intake = await source('src/pages/IntakePage.tsx');
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

test('citizen intake integrates the Sarvam and Gemini voice-analysis endpoint', async () => {
  const queries = await source('src/api/queries.ts');
  const intake = await source('src/pages/IntakePage.tsx');
  const voiceModal = await source('src/components/issue/VoiceRecorderModal.tsx');

  assert.match(queries, /apiClient\.post<VoiceAnalyzeResponse>\('\/voice\/analyze'/);
  assert.match(queries, /timeout: 60000/);
  assert.match(intake, /VoiceRecorderModal/);
  assert.match(intake, /Voice Note Captured/);
  assert.match(intake, /Step 3: Demand Context/);
  assert.match(intake, /Speak Note \(STT\)/);
  assert.match(intake, /Speech-to-Text Voice Input \(Sarvam AI\)/);
  assert.match(intake, /Voice Evidence Attached/);
  assert.match(intake, /useCallback\(\(coords/);
  assert.match(voiceModal, /navigator\.mediaDevices\.getUserMedia/);
  assert.match(voiceModal, /Sarvam Speech-to-Text & Gemini Demand Extraction/);
});

test('photo upload validation matches the JPEG and PNG backend contract', async () => {
  const uploader = await source('src/components/issue/PhotoUploader.tsx');
  assert.match(uploader, /const validTypes = \['image\/jpeg', 'image\/jpg', 'image\/png'\]/);
  assert.doesNotMatch(uploader, /image\/webp/);
});

test('intake surfaces normalized API errors instead of calling them network failures', async () => {
  const intake = await source('src/pages/IntakePage.tsx');
  assert.match(intake, /err instanceof Error/);
  assert.match(intake, /\? err\.message/);
});

