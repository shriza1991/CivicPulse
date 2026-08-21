import type { IssueType, RiskLevel } from '../api/types';

export interface DemoScenario {
  id: string;
  title: string;
  issueType: IssueType;
  description: string;
  locationName: string;
  latitude: number;
  longitude: number;
  imagePath: string;
  reports: number;
  riskLevel: RiskLevel;
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'road-damage-mumbai',
    title: 'Arterial Road Damage (Mumbai, MH)',
    issueType: 'road_damage',
    description: 'Deep road sinkhole and degraded bitumen surface at Andheri East transit junction causing vehicular congestion.',
    locationName: 'Andheri East, Mumbai, Maharashtra',
    latitude: 19.1196,
    longitude: 72.8791,
    imagePath: 'demo_pothole1.jpg',
    reports: 4,
    riskLevel: 'high',
  },
  {
    id: 'water-bengaluru',
    title: 'Drinking Water Pipeline Burst (Bengaluru, KA)',
    issueType: 'water',
    description: 'Major drinking water distribution line rupture along Outer Ring Road corridor, Bellandur.',
    locationName: 'Bellandur, Bengaluru, Karnataka',
    latitude: 12.9304,
    longitude: 77.6784,
    imagePath: 'demo_leak1.jpg',
    reports: 6,
    riskLevel: 'high',
  },
  {
    id: 'drainage-patna',
    title: 'Stormwater Drainage Overhaul (Patna, BR)',
    issueType: 'water',
    description: 'Severely clogged municipal stormwater culvert causing monsoon waterlogging in Kankarbagh residential colony.',
    locationName: 'Kankarbagh, Patna, Bihar',
    latitude: 25.5941,
    longitude: 85.1376,
    imagePath: 'demo_drain1.jpg',
    reports: 5,
    riskLevel: 'high',
  },
  {
    id: 'lighting-lucknow',
    title: 'Arterial Corridor Street Lighting (Lucknow, UP)',
    issueType: 'street_lighting',
    description: 'Non-functional street illumination across 800m stretch near Gomti Nagar extension pedestrian crossing.',
    locationName: 'Gomti Nagar, Lucknow, Uttar Pradesh',
    latitude: 26.8467,
    longitude: 80.9462,
    imagePath: 'demo_streetlight1.jpg',
    reports: 3,
    riskLevel: 'moderate',
  },
  {
    id: 'waste-kolkata',
    title: 'Community Solid Waste Hub (Kolkata, WB)',
    issueType: 'garbage',
    description: 'Overburdened ward solid waste compactor overflow on Salt Lake Sector V perimeter requiring secondary bin installation.',
    locationName: 'Salt Lake Sector V, Kolkata, West Bengal',
    latitude: 22.5804,
    longitude: 88.4378,
    imagePath: 'demo_garbage1.jpg',
    reports: 5,
    riskLevel: 'high',
  },
  {
    id: 'footpath-chennai',
    title: 'Pedestrian Walkway & Footpath (Chennai, TN)',
    issueType: 'footpath',
    description: 'Broken concrete pavers and open drain slabs along Anna Nagar 2nd Avenue forcing school commuters onto motor lanes.',
    locationName: 'Anna Nagar, Chennai, Tamil Nadu',
    latitude: 13.0850,
    longitude: 80.2100,
    imagePath: 'demo_sidewalk.jpg',
    reports: 4,
    riskLevel: 'moderate',
  },
  {
    id: 'flood-assam',
    title: 'Embankment Flood Resilience (Guwahati, AS)',
    issueType: 'water',
    description: 'Erosion of localized stormwater embankment along Bharalu river catchment affecting 3,200 local households.',
    locationName: 'Bharalu Catchment, Guwahati, Assam',
    latitude: 26.1820,
    longitude: 91.7500,
    imagePath: 'demo_drain1.jpg',
    reports: 7,
    riskLevel: 'high',
  },
  {
    id: 'waste-kochi',
    title: 'Canal Waste Interception (Kochi, KL)',
    issueType: 'dumping',
    description: 'Illegal commercial waste deposition blocking Perandoor canal waterway and deteriorating water quality.',
    locationName: 'Elamakkara, Kochi, Kerala',
    latitude: 9.9816,
    longitude: 76.2999,
    imagePath: 'demo_dumping1.jpg',
    reports: 3,
    riskLevel: 'moderate',
  },
];
