import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Package, 
  ShieldCheck, 
  Clock, 
  Truck, 
  AlertCircle, 
  Navigation, 
  Layers, 
  Globe, 
  RefreshCw, 
  FileText, 
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockShipments } from '../utils/mockShipments';
import type { Shipment, ShipmentHistory } from '../utils/mockShipments';

export const TrackingPage: React.FC = () => {
  const { t, orders, selectedOrderId, setSelectedOrderId } = useApp();
  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Shipment | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSimulating] = useState(true);
  const [simulationStep, setSimulationStep] = useState(0);

  const mapOrderToShipment = (order: any): Shipment => {
    let mappedStatus: Shipment['status'] = 'Created';
    let currentStep = 1;
    let progress = 10;
    
    if (order.status === 'matched') {
      mappedStatus = 'Picked Up';
      currentStep = 3;
      progress = 30;
    } else if (order.status === 'picked_up') {
      mappedStatus = 'Picked Up';
      currentStep = 3;
      progress = 35;
    } else if (order.status === 'in_transit') {
      mappedStatus = 'In Transit';
      currentStep = 5;
      progress = 60;
    } else if (order.status === 'near_destination') {
      mappedStatus = 'Out For Delivery';
      currentStep = 7;
      progress = 85;
    } else if (order.status === 'delivered') {
      mappedStatus = 'Delivered';
      currentStep = 8;
      progress = 100;
    }

    return {
      id: order.id,
      sender: order.receiverName === 'Ramesh Patel' ? 'Vijay Kirana Store' : 'Ramesh Patel',
      receiver: order.receiverName,
      parcelType: order.category,
      eta: order.eta || 'June 26, 2026',
      status: mappedStatus,
      currentStep,
      progress,
      origin: order.pickup,
      destination: order.destination,
      distance: order.distance,
      timeRemaining: order.eta || '1 Hour',
      currentHub: order.pickup.split(',')[0],
      route: [order.pickup.split(',')[0], 'Route Checkpoint', order.destination.split(',')[0]],
      coordinates: {
        origin: [20, 70],
        destination: [80, 30],
        current: [50, 50],
      },
      history: [
        {
          date: '2026-06-25',
          time: '09:00 AM',
          location: order.pickup.split(',')[0],
          status: mappedStatus,
          description: `Order in status ${order.status}. Handed over to ${order.partnerName || 'commuter traveler'}.`
        }
      ]
    };
  };

  useEffect(() => {
    if (selectedOrderId) {
      setSearchId(selectedOrderId);
      handleSearch(selectedOrderId);
    }
  }, [selectedOrderId, orders]);

  // Status badges colors and styling maps
  const statusStyles: Record<Shipment['status'], { bg: string; text: string; border: string; glow: string }> = {
    'Created': {
      bg: 'bg-blue-50/80',
      text: 'text-blue-600',
      border: 'border-blue-200/50',
      glow: 'shadow-blue-500/5'
    },
    'Picked Up': {
      bg: 'bg-indigo-50/80',
      text: 'text-indigo-600',
      border: 'border-indigo-200/50',
      glow: 'shadow-indigo-500/5'
    },
    'In Transit': {
      bg: 'bg-amber-50/80',
      text: 'text-amber-600',
      border: 'border-amber-200/50',
      glow: 'shadow-amber-500/5'
    },
    'Delayed': {
      bg: 'bg-rose-50/80',
      text: 'text-rose-600',
      border: 'border-rose-200/50',
      glow: 'shadow-rose-500/5'
    },
    'Out For Delivery': {
      bg: 'bg-purple-50/80',
      text: 'text-purple-600',
      border: 'border-purple-200/50',
      glow: 'shadow-purple-500/5'
    },
    'Delivered': {
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-600',
      border: 'border-emerald-200/50',
      glow: 'shadow-emerald-500/10'
    }
  };

  const timelineSteps = [
    { step: 1, label: 'Order Created', key: 'Created' },
    { step: 2, label: 'Pickup Scheduled', key: 'Pickup Scheduled' },
    { step: 3, label: 'Parcel Picked Up', key: 'Picked Up' },
    { step: 4, label: 'Reached Collection Center', key: 'Reached Hub' },
    { step: 5, label: 'In Transit', key: 'In Transit' },
    { step: 6, label: 'Reached Destination Hub', key: 'Reached Hub' },
    { step: 7, label: 'Out For Delivery', key: 'Out For Delivery' },
    { step: 8, label: 'Delivered', key: 'Delivered' }
  ];

  // Map step numbers to vertical journey nodes
  const routeNodes = [
    { name: 'Village Pickup', stepThreshold: 2 },
    { name: 'Local Hub', stepThreshold: 4 },
    { name: 'Regional Hub', stepThreshold: 5 },
    { name: 'City Distribution Center', stepThreshold: 7 },
    { name: 'Customer Location', stepThreshold: 8 }
  ];

  // Helper to extract realistic dates from history or interpolate them
  const getTimelineTimestamp = (stepNum: number, shipment: Shipment) => {
    if (shipment.currentStep < stepNum) return '';

    // Try finding direct match in logs
    let match: ShipmentHistory | undefined;
    if (stepNum === 1) match = shipment.history.find(h => h.status.toLowerCase().includes('created'));
    else if (stepNum === 3) match = shipment.history.find(h => h.status.toLowerCase().includes('picked up') || h.status.toLowerCase().includes('picked_up'));
    else if (stepNum === 5) match = shipment.history.find(h => h.status.toLowerCase().includes('in transit') || h.status.toLowerCase().includes('in_transit'));
    else if (stepNum === 7) match = shipment.history.find(h => h.status.toLowerCase().includes('out for delivery') || h.status.toLowerCase().includes('out_for_delivery'));
    else if (stepNum === 8) match = shipment.history.find(h => h.status.toLowerCase().includes('delivered'));

    if (match) {
      return `${match.date} • ${match.time}`;
    }

    // Fallbacks to create sequence logic
    const oldest = shipment.history[shipment.history.length - 1];
    const newest = shipment.history[0];

    if (stepNum === 1) return `${oldest.date} • ${oldest.time}`;
    if (stepNum === 2) return `${oldest.date} • 11:30 AM`;
    if (stepNum === 4) return `${newest.date} • 05:15 AM`;
    if (stepNum === 6) return `${newest.date} • 09:45 AM`;
    
    // Inactive or default to current newest date
    return `${newest.date} • ${newest.time}`;
  };

  const handleSearch = (idToSearch: string) => {
    const cleanId = idToSearch.trim().toUpperCase();
    if (!cleanId) return;

    const foundMock = mockShipments.find(s => s.id.toUpperCase() === cleanId);
    if (foundMock) {
      setSearchedOrder(foundMock);
      setHasSearched(true);
      setSimulationStep(0);
      return;
    }

    const foundContext = orders.find(o => o.id.toUpperCase() === cleanId);
    if (foundContext) {
      setSearchedOrder(mapOrderToShipment(foundContext));
      setHasSearched(true);
      setSimulationStep(0);
      return;
    }

    setSearchedOrder(null);
    setHasSearched(true);
  };

  // Telemetry loop for simulating real-time coordinates micro adjustments
  useEffect(() => {
    if (!searchedOrder || searchedOrder.status === 'Delivered') return;

    const interval = setInterval(() => {
      setSimulationStep(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, [searchedOrder]);

  // Translate status titles helper
  const translateStatus = (statusStr: string) => {
    return t(statusStr);
  };

  return (
    <div className="w-full text-gray-800 py-10 px-4 sm:px-6 lg:px-8 font-sans select-none">
      
      {/* 1. HERO SECTION */}
      <div className="max-w-7xl mx-auto text-center mb-10 sm:mb-14 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primaryApp/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none mb-3">
          {t("Track Your Shipment")}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto font-medium mb-8">
          {t("Real-time visibility for every delivery.")}
        </p>

        {/* Search Input Box */}
        <div className="max-w-lg mx-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchId);
            }}
            className="flex flex-col sm:flex-row gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/40 focus-within:ring-2 focus-within:ring-primaryApp/20 focus-within:border-primaryApp transition-all"
          >
            <div className="relative flex-1 flex items-center">
              <Package className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("Enter Package ID (e.g. SH123456)...")}
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-transparent py-3 pl-12 pr-4 text-sm font-semibold text-gray-950 placeholder:text-gray-400 focus:outline-none border-none outline-none"
              />
              {searchId && (
                <button 
                  type="button"
                  onClick={() => setSearchId('')}
                  className="p-1 rounded-full hover:bg-gray-100 mr-2 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>{t("Search")}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* 11. EMPTY STATE DESIGN (Premium Dashboard Preview) */}
          {!hasSearched && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Decorative SVG logistics pattern for premium dashboard feel */}
              <div className="border border-sky-100 rounded-3xl p-8 bg-gradient-to-tr from-sky-900 via-slate-900 to-sky-950 text-white relative overflow-hidden h-64 flex flex-col justify-between">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Simulated Network Paths */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 100,50 Q 250,150 400,50 T 700,100 T 1000,40" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" />
                  <path d="M 50,200 Q 300,50 600,220 T 1100,120" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx="100" cy="50" r="4" fill="#38bdf8" className="animate-ping" />
                  <circle cx="400" cy="50" r="4" fill="#38bdf8" />
                  <circle cx="700" cy="100" r="4" fill="#38bdf8" />
                  <circle cx="600" cy="220" r="4" fill="#38bdf8" className="animate-pulse" />
                </svg>

                <div className="relative z-10 max-w-lg">
                  <h4 className="text-xl font-bold mb-2 text-sky-400">{t("SetuHub Telemetry Hub")}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {t("Our decentralized supply routing system links village shopkeepers and highway commuters to complete quick parcel deliveries. Start searching by inputting waybills.")}
                  </p>
                </div>
                
                <div className="relative z-10 flex gap-4 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{t("Router Network Online")}</span>
                  </div>
                  <div>•</div>
                  <div>{t("API Status: 200 OK")}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SEARCH COMPLETED RESULTS */}
          {hasSearched && searchedOrder && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              
              {/* TOP HEADER SUMMARY BAR */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-lg font-black text-gray-900">
                      {searchedOrder.id}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyles[searchedOrder.status].bg} ${statusStyles[searchedOrder.status].text} ${statusStyles[searchedOrder.status].border} ${statusStyles[searchedOrder.status].glow} shadow-sm`}>
                      {translateStatus(searchedOrder.status)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("Security Waybill ledger registered on SetuHub route chain.")}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setHasSearched(false);
                    setSearchId('');
                    setSelectedOrderId('');
                  }}
                  className="flex items-center gap-2 border border-gray-200 hover:border-gray-400 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-colors text-gray-700 bg-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t("Trace another parcel")}</span>
                </button>
              </div>

              {/* GRID: MAP AND SIMULATION (LEFT) + TIMELINE (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* MAP & SIMULATION SECTION */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* 7. INTERACTIVE MAP SECTION */}
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-md relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-primaryApp" />
                          <span>{t("Live Coordinate Telemetry")}</span>
                        </h3>
                        <span className="text-[10px] text-gray-400">OSM Grid Telemetry Styling • {t("Mock coordinates")}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-slate-100 text-gray-500 px-2 py-0.5 rounded font-mono font-bold">
                          {t("Telemetry Frequency: 100Hz")}
                        </span>
                      </div>
                    </div>

                    {/* MOCK MAP CANVAS */}
                    <div className="h-72 w-full bg-slate-50 rounded-2xl relative border border-gray-100 overflow-hidden select-none">
                      
                      {/* Topography Style grid overlay lines */}
                      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]" />
                      
                      {/* Compass indicator */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                        <Navigation className="w-5 h-5 text-gray-400 rotate-45" />
                      </div>

                      {/* Map Coordinate Paths SVG */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Shadow Path */}
                        <path 
                          d={`M ${searchedOrder.coordinates.origin[0]} ${searchedOrder.coordinates.origin[1]} L ${searchedOrder.coordinates.destination[0]} ${searchedOrder.coordinates.destination[1]}`}
                          fill="none" 
                          stroke="#cbd5e1" 
                          strokeWidth="2" 
                          strokeDasharray="4 4"
                        />
                        
                        {/* Active covered line */}
                        <motion.path 
                          d={`M ${searchedOrder.coordinates.origin[0]} ${searchedOrder.coordinates.origin[1]} L ${searchedOrder.coordinates.current[0]} ${searchedOrder.coordinates.current[1]}`}
                          fill="none" 
                          stroke="var(--primary-app)" 
                          strokeWidth="2.5" 
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>

                      {/* Marker 1: Origin Pin */}
                      <div 
                        style={{ 
                          left: `${searchedOrder.coordinates.origin[0]}%`, 
                          top: `${searchedOrder.coordinates.origin[1]}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className="absolute z-10 flex flex-col items-center"
                      >
                        <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-600 flex items-center justify-center shadow-md">
                          <div className="w-2 h-2 rounded-full bg-slate-600" />
                        </div>
                        <span className="mt-1 bg-slate-800 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                          {searchedOrder.origin.split(',')[0]} (A)
                        </span>
                      </div>

                      {/* Marker 2: Destination Pin */}
                      <div 
                        style={{ 
                          left: `${searchedOrder.coordinates.destination[0]}%`, 
                          top: `${searchedOrder.coordinates.destination[1]}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className="absolute z-10 flex flex-col items-center"
                      >
                        <div className="w-5 h-5 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-lg">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <span className="mt-1 bg-emerald-800 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                          {searchedOrder.destination.split(',')[0]} (B)
                        </span>
                      </div>

                      {/* Marker 3: 6. LIVE TRUCK MOVEMENT SIMULATION */}
                      {searchedOrder.status !== 'Delivered' && (
                        <motion.div 
                          style={{ 
                            left: `${searchedOrder.coordinates.current[0]}%`, 
                            top: `${searchedOrder.coordinates.current[1]}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          animate={isSimulating ? {
                            x: [0, simulationStep % 2 === 0 ? 2 : -2, 0],
                            y: [0, simulationStep % 2 === 0 ? -1 : 1, 0]
                          } : {}}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="absolute z-20 flex flex-col items-center"
                        >
                          {/* Pulsing glow ring */}
                          <div className="absolute w-10 h-10 rounded-full bg-primaryApp/30 animate-ping opacity-60" />
                          <div className="w-7 h-7 rounded-full bg-primaryApp text-white flex items-center justify-center shadow-md relative z-10">
                            <Truck className="w-4 h-4" />
                          </div>
                          
                          <span className="mt-1 bg-primaryApp text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md flex items-center gap-1 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span>{t("In Transit")} ({searchedOrder.progress}%)</span>
                          </span>
                        </motion.div>
                      )}

                      {/* Alternate: Truck is already at Destination for Delivered items */}
                      {searchedOrder.status === 'Delivered' && (
                        <div 
                          style={{ 
                            left: `${searchedOrder.coordinates.destination[0]}%`, 
                            top: `${searchedOrder.coordinates.destination[1]}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          className="absolute z-20 flex flex-col items-center"
                        >
                          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="mt-1 bg-emerald-700 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap">
                            {t("Delivered")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Coordinates metadata log line */}
                    <div className="mt-3 grid grid-cols-2 text-[10px] text-gray-400 font-mono">
                      <div>
                        Lat: {(23.0225 + (searchedOrder.coordinates.current[0] / 10)).toFixed(4)}N | Lng: {(72.5714 + (searchedOrder.coordinates.current[1] / 10)).toFixed(4)}E
                      </div>
                      <div className="text-right text-primaryApp">
                        {t("Live route verification active")}
                      </div>
                    </div>
                  </div>

                  {/* 5. ROUTE VISUALIZATION (JOURNEY PROGRESS CARD) */}
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-md">
                    <h3 className="font-bold text-sm text-gray-900 mb-4">
                      {t("Route Journey Progress")}
                    </h3>
                    
                    {/* Horizontal Node Path */}
                    <div className="relative pt-4 pb-2">
                      {/* Connection Gray Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded" />
                      
                      {/* Active Connection Line */}
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-primaryApp -translate-y-1/2 rounded transition-all duration-500" 
                        style={{ 
                          width: `${
                            searchedOrder.currentStep >= 8 ? '100%' :
                            searchedOrder.currentStep >= 7 ? '75%' :
                            searchedOrder.currentStep >= 5 ? '50%' :
                            searchedOrder.currentStep >= 3 ? '25%' : '0%'
                          }`
                        }}
                      />

                      {/* Route Nodes */}
                      <div className="relative z-10 flex justify-between">
                        {routeNodes.map((node, i) => {
                          const isDone = searchedOrder.currentStep >= node.stepThreshold;
                          const isActive = searchedOrder.currentStep < node.stepThreshold && (i > 0 && searchedOrder.currentStep >= routeNodes[i-1].stepThreshold);
                          
                          return (
                            <div key={i} className="flex flex-col items-center text-center max-w-[80px]">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center border font-bold font-mono transition-all text-xs ${
                                isDone 
                                  ? 'bg-primaryApp border-primaryApp text-white shadow-md'
                                  : isActive 
                                    ? 'bg-white border-primaryApp text-primaryApp ring-4 ring-primaryApp/10 shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-400'
                              }`}>
                                {i + 1}
                              </div>
                              <span className={`text-[9px] font-bold mt-2 leading-tight ${
                                isDone ? 'text-gray-900' : isActive ? 'text-primaryApp font-extrabold' : 'text-gray-400'
                              }`}>
                                {t(node.name)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 3. SHIPMENT INFORMATION CARD */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md">
                    <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      {t("Shipment Details")}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">{t("Sender")}</span>
                        <strong className="text-gray-800 font-semibold mt-1 block">{searchedOrder.sender}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">{t("Receiver")}</span>
                        <strong className="text-gray-800 font-semibold mt-1 block">{searchedOrder.receiver}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">{t("Parcel Category")}</span>
                        <strong className="text-gray-800 font-semibold mt-1 block">{t(searchedOrder.parcelType)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">{t("Estimated Arrival")}</span>
                        <strong className="text-primaryApp font-semibold mt-1 block font-mono">{t(searchedOrder.eta)}</strong>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">{t("Origin Node")}</span>
                          <span className="text-gray-700 font-medium block mt-0.5">{searchedOrder.origin}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <MapPin className="w-4 h-4 text-primaryApp shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">{t("Destination Hub")}</span>
                          <span className="text-gray-700 font-medium block mt-0.5">{searchedOrder.destination}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 4. PROFESSIONAL TIMELINE SECTION (RIGHT) */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
                      <span>{t("Transit Timeline")}</span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">
                        {searchedOrder.currentStep}/8 {t("Steps Complete")}
                      </span>
                    </h3>

                    {/* Timeline List */}
                    <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                      {timelineSteps.map((stepInfo) => {
                        const isDone = searchedOrder.currentStep > stepInfo.step;
                        const isCurrent = searchedOrder.currentStep === stepInfo.step;
                        const timestamp = getTimelineTimestamp(stepInfo.step, searchedOrder);

                        return (
                          <div key={stepInfo.step} className="flex gap-4 items-start relative pl-1">
                            {/* Bullet Circle */}
                            <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border transition-all z-10 shrink-0 ${
                              isDone 
                                ? 'bg-primaryApp border-primaryApp text-white shadow-sm'
                                : isCurrent
                                  ? 'bg-white border-primaryApp text-primaryApp ring-4 ring-primaryApp/10 animate-pulse'
                                  : 'bg-white border-gray-200 text-gray-300'
                            }`}>
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <span className="text-[9px] font-bold font-mono">{stepInfo.step}</span>
                              )}
                            </div>

                            {/* Label & Details */}
                            <div className="space-y-0.5">
                              <h4 className={`text-xs font-bold leading-tight ${
                                isDone 
                                  ? 'text-gray-900' 
                                  : isCurrent 
                                    ? 'text-primaryApp font-extrabold' 
                                    : 'text-gray-400'
                              }`}>
                                {t(stepInfo.label)}
                              </h4>
                              
                              {timestamp ? (
                                <span className="text-[9px] text-gray-400 font-semibold font-mono block">
                                  {timestamp}
                                </span>
                              ) : (
                                <span className="text-[9px] text-gray-300 font-mono block">
                                  {t("Pending")}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Operational Security Badge */}
                  <div className="mt-6 pt-4 border-t border-gray-100 bg-slate-50 p-3 rounded-xl flex items-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-[10px] text-gray-500 leading-relaxed">
                      <strong>{t("Waybill Authenticated")}</strong><br/>
                      {t("This shipment ledger verifies physical OTP handovers at checkpoints. Tampering voids consensus rewards.")}
                    </div>
                  </div>
                </div>

              </div>

              {/* 9. SHIPMENT ANALYTICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Analytics Card 1: Progress Circle */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">{t("Delivery Progress")}</span>
                    <strong className="text-xl font-black text-gray-900 font-mono">{searchedOrder.progress}%</strong>
                    <span className="text-[10px] text-gray-400 block">{t("System route score")}</span>
                  </div>
                  
                  {/* Circle SVG */}
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="22" className="stroke-gray-100" strokeWidth="4" fill="transparent" />
                      <motion.circle 
                        cx="28" 
                        cy="28" 
                        r="22" 
                        className="stroke-primaryApp" 
                        strokeWidth="4" 
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 22}
                        initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - searchedOrder.progress / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-gray-900">
                      {searchedOrder.progress}%
                    </span>
                  </div>
                </div>

                {/* Analytics Card 2: Distance */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">{t("Total Distance")}</span>
                    <strong className="text-xl font-black text-gray-900 font-mono">{searchedOrder.distance} km</strong>
                    <span className="text-[10px] text-gray-400 block">{t("Optimal rural paths")}</span>
                  </div>
                </div>

                {/* Analytics Card 3: Time Remaining */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${searchedOrder.status === 'Delayed' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">{t("Remaining ETA")}</span>
                    <strong className={`text-xl font-black font-mono ${searchedOrder.status === 'Delayed' ? 'text-rose-500' : 'text-gray-900'}`}>
                      {t(searchedOrder.timeRemaining)}
                    </strong>
                    <span className="text-[10px] text-gray-400 block">{t("Commuter speed limits")}</span>
                  </div>
                </div>

                {/* Analytics Card 4: Current Hub */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">{t("Current Active Node")}</span>
                    <strong className="text-sm font-bold text-gray-900 block truncate max-w-[170px] mt-1">{searchedOrder.currentHub}</strong>
                    <span className="text-[10px] text-gray-400 block">{t("Sorting check-in completed")}</span>
                  </div>
                </div>

              </div>

              {/* 10. RECENT TRACKING HISTORY (TABLE LOGS) */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primaryApp" />
                  <h3 className="font-bold text-sm text-gray-900">
                    {t("Detailed Security Telemetry Logs")}
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold text-[9px] tracking-wider">
                        <th className="pb-3 pr-4 font-bold">{t("Date")}</th>
                        <th className="pb-3 px-4 font-bold">{t("Time")}</th>
                        <th className="pb-3 px-4 font-bold">{t("Location")}</th>
                        <th className="pb-3 px-4 font-bold">{t("Status")}</th>
                        <th className="pb-3 pl-4 font-bold">{t("Operational Description")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {searchedOrder.history.map((log, index) => (
                        <tr key={index} className="hover:bg-slate-50/55 transition-colors">
                          <td className="py-3.5 pr-4 font-mono font-semibold text-gray-900 whitespace-nowrap">{log.date}</td>
                          <td className="py-3.5 px-4 font-mono text-gray-500">{log.time}</td>
                          <td className="py-3.5 px-4 font-bold text-gray-800">{t(log.location)}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/50">
                              {t(log.status)}
                            </span>
                          </td>
                          <td className="py-3.5 pl-4 text-gray-500 leading-relaxed min-w-[250px]">{t(log.description)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

          {/* SHIPMENT NOT FOUND STATE */}
          {hasSearched && !searchedOrder && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white p-8 sm:p-12 rounded-3xl border border-red-100 text-center max-w-2xl mx-auto shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500 mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-2">
                {t("Shipment Not Found")}
              </h3>
              
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
                {t("We couldn't locate any waybill entry matching the ID you provided. Please check the spelling, characters, or trace code and try again.")}
              </p>

              {/* Suggestions Panel */}
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-left text-xs mb-8">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primaryApp" />
                  <span>{t("Suggestions for checking details")}</span>
                </h4>
                
                <ul className="space-y-2 text-gray-500 list-disc pl-4 leading-relaxed">
                  <li>{t("Check if the tracking ID matches formats like 'SH123456' or 'SH789012'")}</li>
                  <li>{t("Verify if spaces, case letters, or hyphens were mistyped")}</li>
                  <li>{t("Contact customer service center or merchant if you didn't receive waybills")}</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setHasSearched(false);
                    setSearchId('');
                    setSelectedOrderId('');
                  }}
                  className="bg-primaryApp hover:bg-sky-700 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-colors"
                >
                  {t("Try Another Search")}
                </button>
                <button
                  onClick={() => {
                    // Prepopulate with a valid code
                    setSearchId('SH123456');
                    handleSearch('SH123456');
                  }}
                  className="border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {t("Use Demo Code: SH123456")}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
