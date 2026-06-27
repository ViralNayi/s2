import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Truck,
  Search,
  Compass,
  Sparkles,
  Home,
  Layers,
  ListTodo,
  ClipboardCheck,
  MapPin,
  Package,
  Clock,
  Zap,
  PlusCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Order } from '../context/AppContext';
import { OTPModal } from '../components/OTPModal';
import { InteractiveRouteMap } from '../components/InteractiveRouteMap';
import { Logo } from '../components/Logo';
import { AddressInput } from '../components/AddressInput';
import { getDbLocationDistance } from '../utils/geocodingDb';

interface ShopkeeperDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ShopkeeperDashboard: React.FC<ShopkeeperDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { orders, createOrder, verifyPickupOTP, setScreen } = useApp();
  const [bookingStep, setBookingStep] = useState(0);

  // New Order Form States
  const [pickup, setPickup] = useState('Bhopal Hub Node');
  const [destination, setDestination] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('Small (under 1 kg)');
  const [instructions, setInstructions] = useState('');

  // Selected order for tracking path highlight
  const [trackingOrderId, setTrackingOrderId] = useState<string>('SH-2931');

  // Matching simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [matchedPartner, setMatchedPartner] = useState<any>(null);

  // OTP Verification modal state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [verifyingOrder, setVerifyingOrder] = useState<Order | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  const shopkeeperOrders = orders;

  // Calculate quick stats
  const totalSpend = shopkeeperOrders.reduce((acc, curr) => acc + curr.reward, 0);
  const estimatedSavings = Math.floor(totalSpend * 0.4);

  // Default trackable order fallback
  useEffect(() => {
    if (shopkeeperOrders.length > 0 && !shopkeeperOrders.find(o => o.id === trackingOrderId)) {
      setTrackingOrderId(shopkeeperOrders[0].id);
    }
  }, [shopkeeperOrders]);

  const getEstimatedDistance = () => {
    return getDbLocationDistance(pickup, destination);
  };

  // Run matching simulation on search trigger
  useEffect(() => {
    if (isSimulating && simulationProgress === 0) {
      const interval = setInterval(() => {
        setSimulationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSimulating(false);
            setMatchedPartner({
              name: 'Vikram Singh',
              rating: '★ 4.95',
              route: `${pickup.split(' ')[0]} ➔ ${destination.split(' ')[0]} corridor`,
              eta: '18 mins away'
            });
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isSimulating, simulationProgress, pickup, destination]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !receiverName || !receiverPhone || !category) return;

    const simulatedDistance = getEstimatedDistance();
    const simulatedReward = simulatedDistance * 24;

    createOrder({
      pickup,
      destination,
      receiverName,
      receiverPhone,
      category,
      size,
      instructions,
      reward: simulatedReward,
      distance: simulatedDistance,
    });

    // Reset Form
    setDestination('');
    setReceiverName('');
    setReceiverPhone('');
    setCategory('');
    setSize('Small (under 1 kg)');
    setInstructions('');
    setMatchedPartner(null);
    setIsSimulating(false);
    setBookingStep(0);
  };

  const openPickupOTP = (order: Order) => {
    setVerifyingOrder(order);
    setOtpModalOpen(true);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">BROADCASTING</span>;
      case 'matched':
        return <span className="bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">MATCHED</span>;
      case 'picked_up':
        return <span className="bg-purple-100 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">SECURED</span>;
      case 'in_transit':
        return <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">IN TRANSIT</span>;
      case 'near_destination':
        return <span className="bg-orange-100 text-orange-700 border border-orange-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">ARRIVING</span>;
      case 'delivered':
        return <span className="bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">DELIVERED</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-white text-gray-800 select-none font-sans min-h-screen">
          {/* Left Sidebar (22% width) */}
          <div className="w-full md:w-[22%] border-r border-gray-200 bg-gray-50/50 px-3 py-4 flex flex-col justify-between shrink-0">
            <div className="space-y-4">
              {/* Logo & Brand and Home Action */}
              <div className="flex items-center justify-between px-1">
                <div 
                  onClick={() => setScreen('landing')}
                  className="flex items-center gap-2 text-gray-900 cursor-pointer hover:opacity-85 transition-opacity"
                >
                  <Logo className="w-6 h-6 shrink-0" />
                  <span className="font-semibold text-sm tracking-tight select-none">SetuHub</span>
                </div>
                <button 
                  onClick={() => setScreen('landing')}
                  className="p-1.5 hover:bg-gray-200/60 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                  title="Go to Landing Page"
                >
                  <Home className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Workspace Badge */}
              <div className="flex items-center gap-2 bg-gray-100 ring-1 ring-gray-200 rounded-lg p-1.5">
                <div className="w-4 h-4 rounded bg-gray-900 flex items-center justify-center text-[8px] font-bold text-white uppercase shrink-0 font-display">
                  S
                </div>
                <span className="text-[10px] text-gray-800 font-semibold truncate">Shopkeeper</span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-0.5">
                {[
                  { id: 'create', label: 'Dispatch Cargo', icon: Layers },
                  { id: 'track', label: 'Active Transit', icon: ListTodo },
                  { id: 'history', label: 'Route Ledger', icon: ClipboardCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-gray-900 text-white font-medium shadow-sm'
                          : 'text-gray-600 hover:text-gray-955 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>


            </div>

            {/* Footer Area */}
            <div className="text-[9px] text-gray-400 px-2 pt-2 border-t border-gray-200 space-y-1">
              <div className="truncate">SetuHub Engine v2.5</div>
              <div className="truncate">Shopkeeper Node</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white p-5 flex flex-col gap-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white text-base font-semibold shrink-0 font-display">
                  V
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Vijay Kirana Store</h2>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveTab('create')}
                className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Match Route</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
              {[
                { label: 'DELIVERED', value: '62', sub: 'Parcels completed' },
                { label: 'CORRIDORS', value: '12', sub: 'Highway routes' },
                { label: 'PENDING', value: '412', sub: 'Available orders' },
                { label: 'SAVINGS', value: `₹${estimatedSavings.toLocaleString()}`, sub: 'Direct payout pool' }
              ].map((stat, idx) => (
                <div key={idx} className="p-3 text-left">
                  <span className="block text-[8px] tracking-wider text-gray-500 uppercase font-bold">
                    {stat.label}
                  </span>
                  <span className="block text-base font-bold text-gray-900 mt-1 leading-none font-display">
                    {stat.value}
                  </span>
                  <span className="block text-[8px] text-gray-500 mt-1 truncate">
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>



            <div className="flex-1 mt-2">

              {/* 2. GUIDED ORDER CREATION WIZARD (STEP-BY-STEP PROGRESSIVE WIZARD) */}
              {activeTab === 'create' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200 text-left">
                    <h3 className="text-xs font-semibold text-gray-900">Book a New Delivery</h3>
                    <p className="text-[9px] text-gray-550">Configure pickup, dropoff, and cargo details to dispatch via highway commuter corridor.</p>
                  </div>

                  <form onSubmit={handleCreateOrder} className="max-w-4xl mx-auto w-full">
                    {/* STEP 0: BOOK DELIVERY START BUTTON */}
                    {bookingStep === 0 && (
                      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm max-w-xl mx-auto text-center space-y-6 animate-fade-up">
                        <div className="mx-auto w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-[#0284c7]">
                          <PlusCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-gray-900">Book a New Delivery</h3>
                          <p className="text-xs text-gray-550 max-w-md mx-auto">
                            Configure pickup, dropoff, and cargo details to dispatch via highway commuter corridor.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBookingStep(1)}
                          className="bg-[#0284c7] hover:bg-[#0284c7]/95 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md inline-flex items-center gap-2 border-none"
                        >
                          Book Delivery <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* STEP 1: ROUTE & ADDRESSES */}
                    {bookingStep === 1 && (
                      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-up">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] font-mono flex items-center gap-1.5 pb-2 border-b border-gray-100">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>1. Route & Addresses</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Pickup location */}
                          <AddressInput
                            label="Pickup Address / Origin Node"
                            placeholder="Search or detect pickup point..."
                            value={pickup}
                            onChange={(val) => setPickup(val)}
                            suggestionsPreset={['Bhopal Hub Node', 'Sehore Terminal', 'Kurawar Gateway']}
                          />

                          {/* Dropoff location */}
                          <AddressInput
                            label="Dropoff Address / Target Stand"
                            placeholder="Search or detect dropoff point..."
                            value={destination}
                            onChange={(val) => setDestination(val)}
                            suggestionsPreset={['Vidisha Portal', 'Sonagir Depot', 'Mandideep Sector']}
                          />
                        </div>

                        {pickup && destination && (
                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => setBookingStep(2)}
                              className="bg-[#0284c7] hover:bg-[#0284c7]/95 text-white font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm border-none"
                            >
                              <span>Proceed to Recipient Info</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 2: RECIPIENT INFORMATION */}
                    {bookingStep === 2 && (
                      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-up">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] font-mono flex items-center gap-1.5 pb-2 border-b border-gray-100">
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>2. Recipient Information</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          <div className="space-y-2">
                            <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Receiver Name</label>
                            <input
                              type="text"
                              required
                              placeholder="Receiver Name (e.g. Ramesh Patel)"
                              value={receiverName}
                              onChange={(e) => setReceiverName(e.target.value)}
                              className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Receiver Mobile</label>
                            <input
                              type="tel"
                              required
                              placeholder="Receiver Mobile (+91 XXXXX XXXXX)"
                              value={receiverPhone}
                              onChange={(e) => setReceiverPhone(e.target.value)}
                              className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => setBookingStep(1)}
                            className="border border-gray-300 text-gray-650 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 hover:bg-gray-55 transition-colors cursor-pointer bg-white"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                          </button>
                          
                          {receiverName && receiverPhone && (
                            <button
                              type="button"
                              onClick={() => setBookingStep(3)}
                              className="bg-[#0284c7] hover:bg-[#0284c7]/95 text-white font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm border-none"
                            >
                              <span>Proceed to Package Details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STEP 3: PACKAGE & DETAILS */}
                    {bookingStep === 3 && (
                      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-up">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] font-mono flex items-center gap-1.5 pb-2 border-b border-gray-100">
                          <Package className="w-3.5 h-3.5" />
                          <span>3. Package & Details</span>
                        </h4>

                        <div className="grid grid-cols-2 gap-3 text-left">
                          <div className="space-y-2">
                            <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block font-mono font-sans">Category / Commodity Type</label>
                            <input
                              type="text"
                              required
                              placeholder="Medicines, Sweets, Spares..."
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block font-mono font-sans">Parcel Weight Class</label>
                            <select
                              value={size}
                              onChange={(e) => setSize(e.target.value)}
                              className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 font-semibold cursor-pointer shadow-sm"
                            >
                              <option>Small (under 1 kg)</option>
                              <option>Medium (1 - 5 kg)</option>
                              <option>Heavy (5 - 15 kg)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2 text-left pt-2">
                          <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block font-mono font-sans">Handling & Special Instructions</label>
                          <input
                            type="text"
                            placeholder="Fragile sweets, keep dry..."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                          />
                        </div>

                        <div className="flex justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => setBookingStep(2)}
                            className="border border-gray-300 text-gray-650 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 hover:bg-gray-55 transition-colors cursor-pointer bg-white"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                          </button>
                          
                          {category && (
                            <button
                              type="button"
                              onClick={() => setBookingStep(4)}
                              className="bg-[#0284c7] hover:bg-[#0284c7]/95 text-white font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm border-none"
                            >
                              <span>Generate Receipt</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STEP 4: FINAL ESTIMATED RECEIPT WITH CORRIDOR SEARCH */}
                    {bookingStep === 4 && (
                      <div className="bg-white border border-gray-255 p-6 rounded-2xl shadow-lg max-w-md mx-auto space-y-6 animate-fade-up">
                        <div className="pb-2 border-b border-gray-200 text-center">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-550 font-mono">
                            Estimated Receipt
                          </h4>
                        </div>

                        <div className="space-y-3.5 py-2 text-xs text-gray-650 border-b border-gray-150 text-left">
                          <div className="flex justify-between gap-2">
                            <span className="text-gray-400">Pickup:</span>
                            <strong className="text-gray-900 truncate max-w-[200px]">{pickup}</strong>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-gray-400">Destination:</span>
                            <strong className="text-gray-900 truncate max-w-[200px]">{destination}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Est. Distance:</span>
                            <strong className="text-gray-900 font-mono">{getEstimatedDistance()} km</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Weight Class:</span>
                            <strong className="text-gray-900">{size.split(' ')[0]}</strong>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-gray-150">
                            <span className="text-gray-550 font-semibold font-sans">Estimated Payout:</span>
                            <strong className="text-green-600 font-bold text-xs font-mono">
                              ₹{getEstimatedDistance() * 24}
                            </strong>
                          </div>
                        </div>

                        {/* Correlation matching simulation area inside receipt card */}
                        {(isSimulating || matchedPartner) && (
                          <div className="pt-4 space-y-3 border-t border-gray-200 mt-2 text-left">
                            <h5 className="text-[8.5px] font-bold uppercase tracking-wider text-gray-550 font-mono">Traveler Corridor Status</h5>
                            
                            {isSimulating ? (
                              <div className="bg-white border border-gray-150 p-3.5 rounded-xl space-y-3 flex flex-col items-center text-center shadow-xs">
                                <div className="relative w-8 h-8">
                                  <div className="absolute inset-0 rounded-full border-2 border-gray-100" />
                                  <div className="absolute inset-0 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                                  <Compass className="w-4 h-4 text-sky-500 absolute inset-0 m-auto animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                  <h6 className="font-bold text-[10px] text-gray-900">Scanning Highway Corridors...</h6>
                                  <span className="text-[7.5px] font-mono text-gray-400 block">Mapping network overlaps</span>
                                </div>
                                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-sky-500 to-sky-600" style={{ width: `${simulationProgress}%` }} />
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-3.5 rounded-xl space-y-2.5 shadow-xs">
                                <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-sky-600 font-bold flex items-center justify-center text-[10.5px]">
                                      VS
                                    </div>
                                    <div>
                                      <h6 className="font-bold text-[10.5px] text-gray-900 leading-tight">{matchedPartner.name}</h6>
                                      <div className="flex items-center gap-1">
                                        <span className="text-amber-500 font-bold text-[9px]">{matchedPartner.rating}</span>
                                        <span className="text-[7.5px] font-bold bg-green-50 text-green-700 px-1 py-0.5 rounded border border-green-200 font-mono">VERIFIED COMMUTER</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-[9px] text-gray-655 space-y-1">
                                  <p className="flex items-center gap-1.5">
                                    <Compass className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                                    <span>Corridor: <strong>{matchedPartner.route}</strong></span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                                    <span>ETA to Storefront: <strong>{matchedPartner.eta}</strong></span>
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            disabled={isSimulating}
                            onClick={() => setBookingStep(3)}
                            className="border border-gray-300 text-gray-650 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-gray-55 transition-colors cursor-pointer w-1/3 shrink-0 bg-white disabled:opacity-50"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                          </button>
                          
                          <div className="flex-1">
                            {!matchedPartner && !isSimulating ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsSimulating(true);
                                  setSimulationProgress(0);
                                  setMatchedPartner(null);
                                }}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-none"
                              >
                                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                                <span>Search Corridor</span>
                              </button>
                            ) : matchedPartner ? (
                              <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-sm transition-all cursor-pointer border-none"
                              >
                                Approve & Dispatch <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="w-full bg-gray-100 text-gray-400 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-gray-250"
                              >
                                Matching...
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* 3. ACTIVE TRANSIT MAP & DETAIL (TRACKING TAB) */}
              {activeTab === 'track' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-900">Active Transit Telemetry</h3>
                    <p className="text-[9px] text-gray-500">Trace selected package routes, current traveler position, and input secure custody OTP handshakes.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    {/* Centerpiece map */}
                    <div className="lg:col-span-8 flex flex-col justify-between">
                      <div className="flex-1 min-h-[320px] relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50/50">
                        <InteractiveRouteMap
                          mode="journey-tracking"
                          activeOrders={shopkeeperOrders}
                          selectedOrderId={trackingOrderId}
                        />
                      </div>
                    </div>

                    {/* Right: Active orders list */}
                    <div className="lg:col-span-4 flex flex-col justify-between gap-4">
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex-1 flex flex-col gap-3 overflow-hidden shadow-sm">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Active Package Ledger</h4>
                        
                        <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
                          {shopkeeperOrders
                            .filter((o) => o.status !== 'delivered')
                            .map((order) => {
                              const isSelected = order.id === trackingOrderId;
                              return (
                                <div
                                  key={order.id}
                                  onClick={() => setTrackingOrderId(order.id)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer text-[10px] space-y-2 ${
                                    isSelected
                                      ? 'border-[#0284c7] bg-[#0284c7]/5 text-gray-900 font-bold'
                                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-650 hover:text-gray-900 shadow-sm'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-mono text-[#0284c7] font-black">{order.id}</span>
                                    {getStatusBadge(order.status)}
                                  </div>
                                  
                                  <div className="space-y-0.5 text-[9.5px]">
                                    <p className="truncate font-semibold text-gray-900">{order.category}</p>
                                    <p className="truncate text-gray-500">To: {order.destination.split(',')[0]}</p>
                                  </div>

                                  <div className="flex justify-between items-center pt-1.5 border-t border-gray-200">
                                    <div>
                                      <p className="text-[8px] text-gray-400">Payout</p>
                                      <strong className="text-green-600">₹{order.reward}</strong>
                                    </div>

                                    {order.status === 'matched' ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openPickupOTP(order);
                                        }}
                                        className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-1 px-2.5 rounded text-[8px] uppercase tracking-wider transition-colors"
                                      >
                                        Enter Pickup OTP
                                      </button>
                                    ) : order.status === 'pending' ? (
                                      <span className="text-[8px] font-semibold italic text-yellow-600 animate-pulse">Broadcasting...</span>
                                    ) : (
                                      <div className="text-right">
                                        <span className="text-[7px] uppercase text-gray-400 block font-mono">DELIVERY OTP:</span>
                                        <span className="text-[9px] font-bold font-mono text-gray-800">{order.deliveryOTP}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                          {shopkeeperOrders.filter((o) => o.status !== 'delivered').length === 0 && (
                            <div className="text-center py-8">
                              <Truck className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                              <p className="text-[10px] text-gray-500 font-semibold">No active shipments in transit.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. TRANSACTION HISTORY TAB */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-200 gap-3">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-900">Ledger Archive</h3>
                      <p className="text-[9px] text-gray-500">Cryptographic log of all successfully finalized commute handovers.</p>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search category, destination..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg py-1.5 pl-8 pr-3 text-[10px] focus:border-[#0284c7] focus:outline-none w-48 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[10px] select-text">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50 text-[8px] font-black uppercase text-gray-500 tracking-widest font-mono">
                            <th className="p-3">Cargo ID</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Dropoff Stop</th>
                            <th className="p-3">Receiver Name</th>
                            <th className="p-3">Commuter Partner</th>
                            <th className="p-3">Settle Reward</th>
                            <th className="p-3">Ledger Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150 font-medium text-gray-700">
                          {shopkeeperOrders
                            .filter((o) => {
                              if (searchTerm) {
                                return (
                                  o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  o.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  o.destination.toLowerCase().includes(searchTerm.toLowerCase())
                                );
                              }
                              return true;
                            })
                            .map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-3 font-bold text-[#0284c7] font-mono">{order.id}</td>
                                <td className="p-3 font-semibold text-gray-900">{order.category}</td>
                                <td className="p-3 max-w-[120px] truncate text-gray-500">{order.destination.split(',')[0]}</td>
                                <td className="p-3 text-gray-650">{order.receiverName}</td>
                                <td className="p-3 text-gray-500">{order.partnerName || 'N/A'}</td>
                                <td className="p-3 font-bold text-green-600 font-mono">₹{order.reward}</td>
                                <td className="p-3">{getStatusBadge(order.status)}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>


      {/* Reusable OTP Verification Modal */}
      <OTPModal
        isOpen={otpModalOpen}
        onClose={() => {
          setOtpModalOpen(false);
          setVerifyingOrder(null);
        }}
        onSuccess={() => {
          if (verifyingOrder) {
            verifyPickupOTP(verifyingOrder.id, verifyingOrder.pickupOTP);
          }
        }}
        type="pickup"
        orderId={verifyingOrder?.id}
        expectedOTP={verifyingOrder?.pickupOTP}
      />
    </div>
  );
};
