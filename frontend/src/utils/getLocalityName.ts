interface Locality {
  name: string;
  lat: number;
  lng: number;
  ward: string;
}

const localities: Locality[] = [
  { name: 'Andheri East, Mumbai, MH', lat: 19.1196, lng: 72.8791, ward: 'K/E Ward, Mumbai' },
  { name: 'Bandra West, Mumbai, MH', lat: 19.0607, lng: 72.8362, ward: 'H/W Ward, Mumbai' },
  { name: 'Juhu, Mumbai, MH', lat: 19.1000, lng: 72.8258, ward: 'K/W Ward, Mumbai' },
  { name: 'Powai, Mumbai, MH', lat: 19.1200, lng: 72.9050, ward: 'S Ward, Mumbai' },
  { name: 'Dadar West, Mumbai, MH', lat: 19.0178, lng: 72.8300, ward: 'G/N Ward, Mumbai' },
  { name: 'Colaba, Mumbai, MH', lat: 18.9067, lng: 72.8147, ward: 'A Ward, Mumbai' },
  { name: 'Kurla, Mumbai, MH', lat: 19.0726, lng: 72.8844, ward: 'L Ward, Mumbai' },
  { name: 'Chembur, Mumbai, MH', lat: 19.0622, lng: 72.8974, ward: 'M/W Ward, Mumbai' },
  { name: 'Ghatkopar, Mumbai, MH', lat: 19.0864, lng: 72.9082, ward: 'N Ward, Mumbai' },
  { name: 'Vikhroli, Mumbai, MH', lat: 19.1112, lng: 72.9276, ward: 'S Ward, Mumbai' },
  { name: 'Borivali, Mumbai, MH', lat: 19.2307, lng: 72.8567, ward: 'R/C Ward, Mumbai' },
  { name: 'Sion, Mumbai, MH', lat: 19.0373, lng: 72.8634, ward: 'F/N Ward, Mumbai' },
  // Multi-State India Geographic Nodes
  { name: 'Bellandur ORR, Bengaluru, KA', lat: 12.9304, lng: 77.6784, ward: 'Mahadevapura Zone, BBMP' },
  { name: 'Kankarbagh, Patna, BR', lat: 25.5941, lng: 85.1376, ward: 'Kankarbagh Circle, PMC' },
  { name: 'Gomti Nagar, Lucknow, UP', lat: 26.8467, lng: 80.9462, ward: 'Zone 4, LMC' },
  { name: 'Salt Lake Sector V, Kolkata, WB', lat: 22.5804, lng: 88.4378, ward: 'Bidhannagar Municipal Corp' },
  { name: 'Bharalu Catchment, Guwahati, AS', lat: 26.1820, lng: 91.7500, ward: 'Central Zone, GMC' },
  { name: 'Anna Nagar, Chennai, TN', lat: 13.0850, lng: 80.2100, ward: 'Zone 8, GCC' },
  { name: 'Elamakkara, Kochi, KL', lat: 9.9816, lng: 76.2999, ward: 'Central Division, KMC' },
  { name: 'C-Scheme, Jaipur, RJ', lat: 26.9124, lng: 75.7873, ward: 'Heritage Zone, JMC' },
];

export const getLocalityAndWard = (lat: number, lng: number): { locality: string; ward: string } => {
  let nearestLocality: Locality | null = null;
  let minDistance = Infinity;

  for (const locality of localities) {
    const distance = Math.sqrt(
      Math.pow(locality.lat - lat, 2) + Math.pow(locality.lng - lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestLocality = locality;
    }
  }

  if (nearestLocality && minDistance < 0.08) {
    return { locality: nearestLocality.name, ward: nearestLocality.ward };
  }

  return {
    locality: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    ward: 'Unknown Ward'
  };
};

export const getLocalityName = (lat: number, lng: number): string => {
  return getLocalityAndWard(lat, lng).locality;
};

