export interface GeocodeLocation {
  name: string;
  code: string;
  lat: number;
  lng: number;
  formattedAddress: string;
  type: 'hub' | 'landmark' | 'market' | 'station';
}

export const GEOCODING_DB: GeocodeLocation[] = [
  // Presets from villageNodes / MAP_NODES
  {
    name: 'Bhopal Hub Node',
    code: 'BPL-HUB',
    lat: 23.2599,
    lng: 77.4126,
    formattedAddress: 'Bhopal Central Hub Node, Near Hamidia Road, Bhopal, MP',
    type: 'hub'
  },
  {
    name: 'Sehore Terminal',
    code: 'SEH-TRM',
    lat: 23.2032,
    lng: 77.0844,
    formattedAddress: 'Sehore Terminal Depot, Highway Crossing, Sehore, MP',
    type: 'hub'
  },
  {
    name: 'Kurawar Gateway',
    code: 'KUR-GTW',
    lat: 23.6111,
    lng: 77.0258,
    formattedAddress: 'Kurawar Gateway Stand, Indore-Bhopal Highway, Kurawar, MP',
    type: 'hub'
  },
  {
    name: 'Vidisha Portal',
    code: 'VID-PRT',
    lat: 23.5251,
    lng: 77.8181,
    formattedAddress: 'Vidisha Portal Stand, Sanchi Road Area, Vidisha, MP',
    type: 'hub'
  },
  {
    name: 'Sonagir Depot',
    code: 'SON-DEP',
    lat: 25.7126,
    lng: 78.4111,
    formattedAddress: 'Sonagir Depot, Temple Access Junction, Sonagir, MP',
    type: 'hub'
  },
  {
    name: 'Mandideep Sector',
    code: 'MAN-SEC',
    lat: 23.1044,
    lng: 77.5250,
    formattedAddress: 'Mandideep Industrial Sector 1, Industrial Area, Mandideep, MP',
    type: 'hub'
  },
  {
    name: 'Dewas Connector',
    code: 'DEW-CON',
    lat: 22.9623,
    lng: 76.0508,
    formattedAddress: 'Dewas Connector Junction, AB Road, Dewas, MP',
    type: 'hub'
  },
  {
    name: 'Sagar Trunk Stop',
    code: 'SGR-TRK',
    lat: 23.8388,
    lng: 78.7378,
    formattedAddress: 'Sagar Trunk Stop, Civil Lines Crossing, Sagar, MP',
    type: 'hub'
  },
  {
    name: 'Guna Transit',
    code: 'GUN-TRN',
    lat: 24.6477,
    lng: 77.3076,
    formattedAddress: 'Guna Transit Point, bypass Junction, Guna, MP',
    type: 'hub'
  },
  {
    name: 'Hoshangabad Node',
    code: 'HOS-NOD',
    lat: 22.7533,
    lng: 77.7372,
    formattedAddress: 'Hoshangabad Node, Narmada Ghat Road, Hoshangabad, MP',
    type: 'hub'
  },
  // Landmarks and Markets in MP
  {
    name: 'New Market, Bhopal',
    code: 'BPL-NWM',
    lat: 23.2428,
    lng: 77.4020,
    formattedAddress: 'New Market Commercial Center, T.T. Nagar, Bhopal, MP',
    type: 'market'
  },
  {
    name: 'Arera Colony, Bhopal',
    code: 'BPL-ARA',
    lat: 23.2120,
    lng: 77.4325,
    formattedAddress: 'Arera Colony Sector E-7, Link Road 3, Bhopal, MP',
    type: 'landmark'
  },
  {
    name: 'Sehore Railway Station',
    code: 'SEH-RLW',
    lat: 23.1950,
    lng: 77.0910,
    formattedAddress: 'Sehore Junction Station Road, Station Area, Sehore, MP',
    type: 'station'
  },
  {
    name: 'Vidisha Bus Stand',
    code: 'VID-BUS',
    lat: 23.5300,
    lng: 77.8100,
    formattedAddress: 'Vidisha Central Bus Stand, Main Bypass Road, Vidisha, MP',
    type: 'station'
  },
  {
    name: 'Dewas Naka Hub',
    code: 'IND-DNK',
    lat: 22.7510,
    lng: 75.8950,
    formattedAddress: 'Dewas Naka Logistics hub, Ring Road, Indore, MP',
    type: 'market'
  },
  // User custom addresses support (e.g. Mehsana)
  {
    name: 'Mehsana Bus Stand',
    code: 'MSN-BUS',
    lat: 23.6010,
    lng: 72.4010,
    formattedAddress: 'Mehsana Central Bus Stand, Radhanpur Road, Mehsana, Gujarat',
    type: 'station'
  },
  {
    name: 'Mehsana Highway Toll Plaza',
    code: 'MSN-TOL',
    lat: 23.6420,
    lng: 72.4250,
    formattedAddress: 'Mehsana State Highway 41 Toll Plaza, Mehsana, Gujarat',
    type: 'landmark'
  },
  {
    name: 'Mehsana Junction Railway Station',
    code: 'MSN-RLW',
    lat: 23.5866,
    lng: 72.3995,
    formattedAddress: 'Mehsana Junction Station Road, Railway Area, Mehsana, Gujarat',
    type: 'station'
  },
  {
    name: 'Mehsana GIDC Industrial Area',
    code: 'MSN-GIDC',
    lat: 23.5650,
    lng: 72.3850,
    formattedAddress: 'Mehsana GIDC Sector 1, Ahmedabad-Mehsana Highway, Mehsana, Gujarat',
    type: 'hub'
  },
  {
    name: 'Radhanpur Road Crossing, Mehsana',
    code: 'MSN-RDHP',
    lat: 23.5975,
    lng: 72.3780,
    formattedAddress: 'Radhanpur Road Highway Junction, Radhanpur Road, Mehsana, Gujarat',
    type: 'landmark'
  },
  {
    name: 'Modhera Road Circle, Mehsana',
    code: 'MSN-MODR',
    lat: 23.5890,
    lng: 72.3850,
    formattedAddress: 'Modhera Road Circle, Modhera Road Crossing, Mehsana, Gujarat',
    type: 'landmark'
  },
  {
    name: 'D-Mart Mehsana',
    code: 'MSN-DMRT',
    lat: 23.6080,
    lng: 72.4150,
    formattedAddress: 'D-Mart Supermarket, Visnagar Link Road, Mehsana, Gujarat',
    type: 'market'
  },
  {
    name: 'Wide-Angle Multiplex, Mehsana',
    code: 'MSN-WANG',
    lat: 23.6120,
    lng: 72.4080,
    formattedAddress: 'Wide-Angle Multiplex Cinema, Visnagar Highway, Mehsana, Gujarat',
    type: 'landmark'
  },
  {
    name: 'Ahmedabad Kalupur Station',
    code: 'ADI-KLPR',
    lat: 23.0275,
    lng: 72.6002,
    formattedAddress: 'Kalupur Junction Central Railway Station, Ahmedabad, Gujarat',
    type: 'station'
  },
  {
    name: 'Ahmedabad Gita Mandir Bus Stand',
    code: 'ADI-GTND',
    lat: 23.0135,
    lng: 72.5925,
    formattedAddress: 'Gita Mandir Central Bus Terminus, ST Road, Ahmedabad, Gujarat',
    type: 'station'
  },
  {
    name: 'Ahmedabad Ring Road Plaza',
    code: 'ADI-RRPL',
    lat: 23.0485,
    lng: 72.6850,
    formattedAddress: 'Sardar Patel Ring Road Junction, Ahmedabad, Gujarat',
    type: 'landmark'
  },
  {
    name: 'Ahmedabad Airport Node',
    code: 'ADI-APRT',
    lat: 23.0734,
    lng: 72.6275,
    formattedAddress: 'Sardar Vallabhbhai Patel International Airport, Ahmedabad, Gujarat',
    type: 'hub'
  }
];

export const searchLocations = (query: string): GeocodeLocation[] => {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];
  return GEOCODING_DB.filter(
    (loc) =>
      loc.name.toLowerCase().includes(clean) ||
      loc.formattedAddress.toLowerCase().includes(clean) ||
      loc.code.toLowerCase().includes(clean)
  );
};

export const getDbLocationDistance = (loc1: string, loc2: string): number => {
  const findLoc = (name: string) => {
    const clean = name.trim().toLowerCase();
    return GEOCODING_DB.find(
      (l) => l.name.toLowerCase() === clean || l.name.toLowerCase().startsWith(clean) || clean.includes(l.name.toLowerCase())
    );
  };

  const l1 = findLoc(loc1);
  const l2 = findLoc(loc2);

  if (l1 && l2) {
    if (l1.name === l2.name) return 5;
    // Haversine distance formula
    const R = 6371;
    const dLat = ((l2.lat - l1.lat) * Math.PI) / 180;
    const dLng = ((l2.lng - l1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((l1.lat * Math.PI) / 180) *
        Math.cos((l2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.max(5, Math.round(d));
  }

  // Fallback to villageNodes mock indices if they are matched in index form, otherwise return default fallback
  const villageNodes = [
    'Bhopal Hub Node',
    'Sehore Terminal',
    'Kurawar Gateway',
    'Vidisha Portal',
    'Sonagir Depot',
    'Mandideep Sector',
    'Dewas Connector',
    'Sagar Trunk Stop'
  ];

  const pIdx = villageNodes.findIndex(n => loc1.toLowerCase().includes(n.toLowerCase()));
  const dIdx = villageNodes.findIndex(n => loc2.toLowerCase().includes(n.toLowerCase()));
  if (pIdx !== -1 && dIdx !== -1) {
    const diff = Math.abs(pIdx - dIdx);
    return diff === 0 ? 12 : diff * 15;
  }

  return 24;
};
