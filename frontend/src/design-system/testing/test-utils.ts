/**
 * nivaran Design System — Testing Utilities & Mock Data Fixtures
 */

export interface AccessibilityCheckResult {
  hasLabel: boolean;
  hasRole: boolean;
  touchTargetPass: boolean;
}

export function validateComponentAccessibility(element: HTMLElement): AccessibilityCheckResult {
  const rect = element.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  const hasLabel = Boolean(
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent?.trim()
  );

  const hasRole = Boolean(element.getAttribute('role') || element.tagName.toLowerCase() === 'button' || element.tagName.toLowerCase() === 'a');

  // Min 48x48px target requirement
  const touchTargetPass = width >= 48 && height >= 48;

  return {
    hasLabel,
    hasRole,
    touchTargetPass,
  };
}

export const mockEvidenceItems = [
  {
    id: 'EVID-001',
    title: 'Pothole Hazard Photo',
    timestamp: '2026-07-22 10:14 AM',
    locality: 'Sector 62, Noida',
    mediaUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop',
    restricted: false,
  },
  {
    id: 'EVID-002',
    title: 'Water Leak Inspection',
    timestamp: '2026-07-22 11:30 AM',
    locality: 'Connaught Place, New Delhi',
    mediaUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop',
    restricted: false,
  },
];

export const mockTimelineEvents = [
  {
    id: 'EVT-01',
    title: 'Citizen Report Submitted',
    timestamp: '10:14 AM',
    actorName: 'Anonymous Citizen',
  },
  {
    id: 'EVT-02',
    title: 'Assigned to Public Works Department',
    timestamp: '11:00 AM',
    actorName: 'Executive Officer Sharma',
  },
];
