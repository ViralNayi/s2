export interface ShipmentHistory {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
}

export interface Shipment {
  id: string;
  sender: string;
  receiver: string;
  parcelType: string;
  eta: string;
  status: 'Created' | 'Picked Up' | 'In Transit' | 'Delayed' | 'Out For Delivery' | 'Delivered';
  currentStep: number; // 1 to 8
  progress: number; // 0 to 100
  origin: string;
  destination: string;
  distance: number; // km
  timeRemaining: string;
  currentHub: string;
  route: string[]; // Journey points
  coordinates: {
    origin: [number, number]; // [lat, lng] percentage from top-left for mock rendering (e.g., [x, y])
    destination: [number, number];
    current: [number, number];
  };
  history: ShipmentHistory[];
}

export const mockShipments: Shipment[] = [
  {
    id: "SH123456",
    sender: "Rahul Sharma",
    receiver: "Priya Patel",
    parcelType: "Medicines & Healthcare",
    eta: "June 27, 2026 - 04:00 PM",
    status: "In Transit",
    currentStep: 5,
    progress: 60,
    origin: "Ahmedabad, Gujarat",
    destination: "Delhi NCR",
    distance: 950,
    timeRemaining: "14 Hours",
    currentHub: "Jaipur Regional Hub",
    route: ["Ahmedabad GPO", "Udaipur Local Hub", "Jaipur Regional Hub", "Gurugram Dist Center", "Delhi NCR Hub"],
    coordinates: {
      origin: [20, 75],
      destination: [80, 25],
      current: [56, 45]
    },
    history: [
      { date: "2026-06-25", time: "10:30 AM", location: "Jaipur Regional Hub", status: "In Transit", description: "Shipment departed from regional hub. Heading towards next distribution node." },
      { date: "2026-06-25", time: "05:15 AM", location: "Jaipur Regional Hub", status: "Reached Hub", description: "Parcel arrived at Jaipur Hub. Sorted and loaded for highway transit." },
      { date: "2026-06-24", time: "08:00 PM", location: "Udaipur Local Hub", status: "In Transit", description: "Departed local transit warehouse via highway carrier." },
      { date: "2026-06-24", time: "11:30 AM", location: "Ahmedabad GPO", status: "Picked Up", description: "Security dispatch validation complete. Handed over to route partner." },
      { date: "2026-06-24", time: "09:00 AM", location: "Ahmedabad, Gujarat", status: "Created", description: "Order created successfully. Pickup coordinates scheduled." }
    ]
  },
  {
    id: "SH789012",
    sender: "Vijay Kumar",
    receiver: "Neha Gupta",
    parcelType: "Artisanal Sweets & Food",
    eta: "June 25, 2026 - 06:30 PM",
    status: "Out For Delivery",
    currentStep: 7,
    progress: 90,
    origin: "Sehore Town, MP",
    destination: "Bhopal Indrapuri, MP",
    distance: 45,
    timeRemaining: "45 Mins",
    currentHub: "Bhopal Main Distribution Node",
    route: ["Sehore Stand Office", "Ashta Local Hub", "Bhopal West Hub", "Bhopal Main Dist Center", "Indrapuri Residential Stand"],
    coordinates: {
      origin: [15, 60],
      destination: [85, 40],
      current: [78, 42]
    },
    history: [
      { date: "2026-06-25", time: "11:45 AM", location: "Bhopal Main Dist Center", status: "Out For Delivery", description: "Out for delivery. Route partner Vikram Singh (+91 88899 00112) is en route." },
      { date: "2026-06-25", time: "09:30 AM", location: "Bhopal West Hub", status: "In Transit", description: "Departed local hub. Sorting complete for final urban mile segment." },
      { date: "2026-06-25", time: "08:15 AM", location: "Ashta Local Hub", status: "Picked Up", description: "OTP validated. Commuter took custody of sweets container." },
      { date: "2026-06-25", time: "07:00 AM", location: "Sehore Town, MP", status: "Created", description: "Sweets packaged and order registered in route matcher database." }
    ]
  },
  {
    id: "SH990214",
    sender: "Deepak Mehta",
    receiver: "Amit Verma",
    parcelType: "Legal Documents",
    eta: "June 26, 2026 - 12:00 PM",
    status: "Created",
    currentStep: 1,
    progress: 10,
    origin: "Indore GPO, MP",
    destination: "Dewas Industrial Area, MP",
    distance: 38,
    timeRemaining: "1 Day",
    currentHub: "Indore GPO Office",
    route: ["Indore GPO Office", "Manglia Crossing", "Dewas Bypass Node", "Dewas City Hub", "Dewas Industrial Sector"],
    coordinates: {
      origin: [30, 20],
      destination: [70, 80],
      current: [30, 20]
    },
    history: [
      { date: "2026-06-25", time: "11:00 AM", location: "Indore GPO Office", status: "Created", description: "Waybill printed. Awaiting traveler pickup request confirmation." }
    ]
  },
  {
    id: "SH445588",
    sender: "Rajesh Patil",
    receiver: "Sunita Deshmukh",
    parcelType: "Electronic Spare Parts",
    eta: "June 24, 2026 - 02:00 PM",
    status: "Delivered",
    currentStep: 8,
    progress: 100,
    origin: "Pune Tech Zone",
    destination: "Mumbai Airport Terminal",
    distance: 140,
    timeRemaining: "Delivered",
    currentHub: "Mumbai Airport Terminal",
    route: ["Pune Tech Office", "Lonavala Local Node", "Panvel Express Hub", "Vashi Main Hub", "Mumbai Terminal"],
    coordinates: {
      origin: [10, 85],
      destination: [90, 15],
      current: [90, 15]
    },
    history: [
      { date: "2026-06-24", time: "01:45 PM", location: "Mumbai Terminal", status: "Delivered", description: "Package successfully hand-delivered. OTP signature verified." },
      { date: "2026-06-24", time: "10:30 AM", location: "Vashi Main Hub", status: "Out For Delivery", description: "Commuter left hub heading towards delivery coordinates." },
      { date: "2026-06-24", time: "06:15 AM", location: "Panvel Express Hub", status: "In Transit", description: "Arrived at Panvel gate. Checked for container verification." },
      { date: "2026-06-23", time: "04:00 PM", location: "Pune Tech Office", status: "Created", description: "Order booked by distributor." }
    ]
  },
  {
    id: "SH556677",
    sender: "Aarav Rawat",
    receiver: "Komal Sethi",
    parcelType: "Organic Cotton Textiles",
    eta: "June 28, 2026 - 11:00 AM",
    status: "In Transit",
    currentStep: 4,
    progress: 45,
    origin: "Surat Textile Hub",
    destination: "Jaipur Bazar, Rajasthan",
    distance: 540,
    timeRemaining: "1 Day 4 Hours",
    currentHub: "Vadodara Sorting Node",
    route: ["Surat Central Office", "Vadodara Sorting Node", "Godhra Route Hub", "Udaipur Junction", "Jaipur Bazar"],
    coordinates: {
      origin: [15, 40],
      destination: [85, 80],
      current: [42, 55]
    },
    history: [
      { date: "2026-06-25", time: "08:45 AM", location: "Vadodara Sorting Node", status: "Reached Hub", description: "Sorting completed. Staged in North-bound route loading lane." },
      { date: "2026-06-24", time: "06:30 PM", location: "Surat Central Office", status: "Picked Up", description: "Vetted traveler accepted courier bag." },
      { date: "2026-06-24", time: "02:00 PM", location: "Surat Textile Hub", status: "Created", description: "Order dispatched from merchant inventory." }
    ]
  },
  {
    id: "SH889900",
    sender: "Sandeep Mishra",
    receiver: "Vivek Joshi",
    parcelType: "Hardware Tools",
    eta: "June 25, 2026 - 10:00 AM",
    status: "Delayed",
    currentStep: 5,
    progress: 55,
    origin: "Kanpur Gorkha",
    destination: "Lucknow Chowk",
    distance: 90,
    timeRemaining: "Delayed (Rain)",
    currentHub: "Unnao Highway Stop",
    route: ["Kanpur Depot", "Unnao Highway Stop", "Lucknow Outskirts", "Lucknow Chowk Hub"],
    coordinates: {
      origin: [10, 25],
      destination: [90, 75],
      current: [45, 48]
    },
    history: [
      { date: "2026-06-25", time: "09:00 AM", location: "Unnao Highway Stop", status: "Delayed", description: "Severe monsoon waterlogging on highway. Transit temporarily paused for safety." },
      { date: "2026-06-25", time: "06:30 AM", location: "Kanpur Depot", status: "In Transit", description: "Departed Kanpur depot. Rain conditions noted." },
      { date: "2026-06-24", time: "08:00 PM", location: "Kanpur Depot", status: "Created", description: "Registered in system directory." }
    ]
  },
  {
    id: "SH332211",
    sender: "Meera Nair",
    receiver: "Anjali Menon",
    parcelType: "Home Decor & Crafts",
    eta: "June 26, 2026 - 05:00 PM",
    status: "Picked Up",
    currentStep: 3,
    progress: 30,
    origin: "Kochi Port Office",
    destination: "Trivandrum Central",
    distance: 210,
    timeRemaining: "18 Hours",
    currentHub: "Alappuzha Local Junction",
    route: ["Kochi Terminal", "Alappuzha Local Junction", "Kollam Gateway Hub", "Trivandrum City Office"],
    coordinates: {
      origin: [20, 15],
      destination: [80, 85],
      current: [38, 36]
    },
    history: [
      { date: "2026-06-25", time: "10:15 AM", location: "Alappuzha Local Junction", status: "Picked Up", description: "Traveler confirmed courier check-in at local railway checkpoint." },
      { date: "2026-06-25", time: "07:30 AM", location: "Kochi Terminal", status: "Created", description: "Shipment packaged and labeled." }
    ]
  },
  {
    id: "SH112233",
    sender: "Vikram Sen",
    receiver: "Rohan Das",
    parcelType: "Laptops & Electronics",
    eta: "June 25, 2026 - 01:00 PM",
    status: "Delivered",
    currentStep: 8,
    progress: 100,
    origin: "Kolkata Salt Lake",
    destination: "Howrah Railway Colony",
    distance: 18,
    timeRemaining: "Delivered",
    currentHub: "Howrah Railway Colony",
    route: ["Salt Lake Dist Node", "Sealdah Station Box", "Howrah Bridge Gate", "Howrah Colony Hub"],
    coordinates: {
      origin: [15, 15],
      destination: [85, 85],
      current: [85, 85]
    },
    history: [
      { date: "2026-06-25", time: "12:15 PM", location: "Howrah Colony Hub", status: "Delivered", description: "Delivered to receiver. Digital OTP signature captured." },
      { date: "2026-06-25", time: "10:30 AM", location: "Howrah Bridge Gate", status: "Out For Delivery", description: "Out for delivery on commuter backseat." },
      { date: "2026-06-25", time: "09:00 AM", location: "Sealdah Station Box", status: "In Transit", description: "Transferred to railway crossing segment." },
      { date: "2026-06-25", time: "08:00 AM", location: "Salt Lake Dist Node", status: "Created", description: "Registered by IT distributor." }
    ]
  },
  {
    id: "SH445566",
    sender: "Sneha Nair",
    receiver: "Gautam Rao",
    parcelType: "Custom Ceramics",
    eta: "June 28, 2026 - 03:00 PM",
    status: "Created",
    currentStep: 1,
    progress: 5,
    origin: "Chennai Craft Center",
    destination: "Bengaluru Whitefield",
    distance: 350,
    timeRemaining: "3 Days",
    currentHub: "Chennai Craft Center",
    route: ["Chennai Craft Center", "Kanchipuram Hub", "Vellore Transit GPO", "Hosur Border Gate", "Bengaluru Whitefield Hub"],
    coordinates: {
      origin: [40, 90],
      destination: [20, 10],
      current: [40, 90]
    },
    history: [
      { date: "2026-06-25", time: "11:20 AM", location: "Chennai Craft Center", status: "Created", description: "Ceramics boxed in double bubble-wrap. Staged for route partner pickup." }
    ]
  },
  {
    id: "SH778899",
    sender: "Mohit Bansal",
    receiver: "Karan Johar",
    parcelType: "Designer Apparel",
    eta: "June 25, 2026 - 03:30 PM",
    status: "Delivered",
    currentStep: 8,
    progress: 100,
    origin: "Mumbai Juhu",
    destination: "Mumbai Bandra",
    distance: 12,
    timeRemaining: "Delivered",
    currentHub: "Mumbai Bandra Hub",
    route: ["Juhu Terminal Office", "Khar Crossing Station", "Bandra Residential Node"],
    coordinates: {
      origin: [10, 20],
      destination: [90, 80],
      current: [90, 80]
    },
    history: [
      { date: "2026-06-25", time: "03:15 PM", location: "Bandra Residential Node", status: "Delivered", description: "Successfully delivered. Secure checkout OTP matches." },
      { date: "2026-06-25", time: "01:30 PM", location: "Khar Crossing Station", status: "Out For Delivery", description: "Commuter en route." },
      { date: "2026-06-25", time: "11:00 AM", location: "Juhu Terminal Office", status: "Created", description: "Order booked by seller." }
    ]
  }
];
