import { useState, useEffect } from 'react';

export interface CommunityActivityItem {
  id: string;
  caseId: string;
  caseTitle: string;
  authorName: string;
  type: 'verification' | 'evidence' | 'duplicate' | 'volunteer';
  content: string;
  timestamp: string;
  badgeLabel?: string;
}

export interface VolunteerItem {
  id: string;
  name: string;
  ward: string;
  skills: string[];
  status: 'available' | 'assigned';
}

const INITIAL_ACTIVITIES: CommunityActivityItem[] = [
  {
    id: 'ACT-1',
    caseId: 'CP-2026-881',
    caseTitle: 'Severe Pothole Hazard on Sector 62 Main Road',
    authorName: 'Rohan Mehta',
    type: 'verification',
    content: 'Confirmed repair is complete. Road surface restored and asphalt sealed.',
    timestamp: '15 mins ago',
    badgeLabel: 'Verified Contributor',
  },
  {
    id: 'ACT-2',
    caseId: 'CP-2026-882',
    caseTitle: 'Water Leakage Near Ward 14 Community Center',
    authorName: 'Ananya Roy',
    type: 'evidence',
    content: 'Uploaded 2 supplemental ground photos showing active valve seepage.',
    timestamp: '1 hour ago',
    badgeLabel: 'Community Auditor',
  },
  {
    id: 'ACT-3',
    caseId: 'CP-2026-883',
    caseTitle: 'Broken Streetlight Grid on Expressway Service Lane',
    authorName: 'Karan Singh',
    type: 'volunteer',
    content: 'Volunteered for physical site inspection and night visibility audit.',
    timestamp: '3 hours ago',
    badgeLabel: 'Local Volunteer',
  },
];

const INITIAL_VOLUNTEERS: VolunteerItem[] = [
  {
    id: 'VOL-1',
    name: 'Vikram Malhotra',
    ward: 'Ward 14 (Sector 62)',
    skills: ['Physical Site Audit', 'Photography', 'Night Patrol'],
    status: 'available',
  },
  {
    id: 'VOL-2',
    name: 'Sunita Rao',
    ward: 'Ward 18 (Indirapuram)',
    skills: ['Water Quality Testing', 'Community Outreach'],
    status: 'available',
  },
];

export function useCommunityStore() {
  const [activities, setActivities] = useState<CommunityActivityItem[]>(() => {
    const saved = localStorage.getItem('nivaran_community_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [volunteers, setVolunteers] = useState<VolunteerItem[]>(() => {
    const saved = localStorage.getItem('nivaran_volunteers');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  useEffect(() => {
    localStorage.setItem('nivaran_community_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('nivaran_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  const addActivity = (item: Omit<CommunityActivityItem, 'id' | 'timestamp'>) => {
    const newItem: CommunityActivityItem = {
      ...item,
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
    };
    setActivities((prev) => [newItem, ...prev]);
  };

  const registerVolunteer = (name: string, ward: string, skills: string[]) => {
    const newVol: VolunteerItem = {
      id: `VOL-${Date.now()}`,
      name,
      ward,
      skills,
      status: 'available',
    };
    setVolunteers((prev) => [newVol, ...prev]);
  };

  return {
    activities,
    volunteers,
    addActivity,
    registerVolunteer,
  };
}
