import React, { useState } from 'react';
import {
  Package,
  Search,
  RotateCcw,
  ThumbsUp,
  Sparkles,
  Home,
  Compass,
  ClipboardCheck,
  PlusCircle,
  ArrowRight,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';

import { AddressInput } from '../components/AddressInput';
import { Logo } from '../components/Logo';
import { getDbLocationDistance } from '../utils/geocodingDb';

interface CustomerDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { orders, createOrder, setSelectedOrderId, setScreen } = useApp();
  const [searchId, setSearchId] = useState('');
  const [bookingStep, setBookingStep] = useState(0);

  // Order Wizard States
  const [pickup, setPickup] = useState('Bhopal Hub Node');
  const [isCustomPickup, setIsCustomPickup] = useState(false);
  const [customPickup, setCustomPickup] = useState('');
  const [destination, setDestination] = useState("Ramesh Patel's Address");
  const [isCustomDestination, setIsCustomDestination] = useState(false);
  const [customDestination, setCustomDestination] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('Small (under 1 kg)');
  const [instructions, setInstructions] = useState('');

  // Predefined village nodes
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

  const getActualPickupName = () => {
    return isCustomPickup ? (customPickup.trim() || 'Custom Pickup') : pickup;
  };

  const getActualDestinationName = () => {
    return isCustomDestination ? (customDestination.trim() || 'Custom Destination') : destination;
  };

  const getEstimatedDistance = () => {
    const pickupName = isCustomPickup ? customPickup : pickup;
    const destinationName = isCustomDestination ? customDestination : destination;
    return getDbLocationDistance(pickupName, destinationName);
  };

  // Run matching simulation on entering step 5
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPickup = isCustomPickup ? customPickup : pickup;
    const finalDestination = isCustomDestination ? customDestination : destination;

    if (!finalPickup || !finalDestination || !senderName || !senderPhone || !receiverName || !receiverPhone || !category) return;

    const simulatedDistance = getEstimatedDistance();
    const simulatedReward = simulatedDistance * 24;

    createOrder({
      pickup: finalPickup,
      destination: finalDestination,
      receiverName,
      receiverPhone,
      category,
      size,
      instructions,
      reward: simulatedReward,
      distance: simulatedDistance,
    });

    // Reset Form
    setIsCustomPickup(false);
    setPickup('Bhopal Hub Node');
    setCustomPickup('');
    setIsCustomDestination(false);
    setDestination("Ramesh Patel's Address");
    setCustomDestination('');
    setSenderName('');
    setSenderPhone('');
    setReceiverName('');
    setReceiverPhone('');
    setCategory('');
    setSize('Small (under 1 kg)');
    setInstructions('');
    setActiveTab('customer-track');
    setBookingStep(0);
  };

  // Stats calculation
  const inboundCount = orders.filter(o => o.status !== 'delivered').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const transitCount = orders.filter(o => ['picked_up', 'in_transit', 'near_destination'].includes(o.status)).length;
  const completedCount = orders.filter(o => o.status === 'delivered').length;

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
                  C
                </div>
                <span className="text-[10px] text-gray-800 font-semibold truncate">Customer</span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-0.5">
                {[
                  { id: 'customer-create', label: 'Book Delivery', icon: PlusCircle },
                  { id: 'customer-track', label: 'Track Package', icon: Compass },
                  { id: 'customer-history', label: 'Receipt Ledger', icon: ClipboardCheck }
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
              <div className="truncate">Customer Node</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white p-5 flex flex-col gap-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white text-base font-semibold shrink-0 font-display">
                  R
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Ramesh Patel</h2>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveTab('customer-create')}
                className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Book Delivery</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
              {[
                { label: 'INBOUND', value: `${inboundCount}`, sub: 'Packages arriving' },
                { label: 'BROADCASTING', value: `${pendingCount}`, sub: 'Match scans' },
                { label: 'CHECKPOINTS', value: `${transitCount}`, sub: 'Transit nodes passed' },
                { label: 'RECEIVED', value: `${completedCount}`, sub: 'Ledger handovers settled' }
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



            {/* Active Tab Content Area */}
            <div className="flex-1 mt-2">
              {/* 1. TRACK PACKAGE */}
              {activeTab === 'customer-track' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-200 gap-3">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-900">Shipment Registry</h3>
                      <p className="text-[9px] text-gray-500">Monitor current custody status and transit checkpoints of all registered packages.</p>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search Order ID..."
                          value={searchId}
                          onChange={(e) => setSearchId(e.target.value)}
                          className="bg-white border border-gray-300 rounded-lg py-1.5 pl-8 pr-3 text-[10px] focus:border-[#0284c7] focus:outline-none w-44 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipments List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders
                      .filter(o => !searchId || o.id.toLowerCase().includes(searchId.toLowerCase().trim()))
                      .map((order) => (
                        <div 
                          key={order.id} 
                          className="bg-white border border-gray-200/60 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-mono text-[#0284c7] font-black text-[10px]">{order.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              order.status === 'delivered'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : order.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            }`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[10px] text-gray-650 mb-4 border-y border-gray-100 py-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Category:</span>
                              <span className="font-semibold text-gray-800">{order.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Receiver:</span>
                              <span className="font-semibold text-gray-800">{order.receiverName}</span>
                            </div>
                            <div className="flex justify-between items-center gap-1 pt-1.5 border-t border-gray-50 text-[10px]">
                              <span className="truncate max-w-[85px] font-medium text-gray-700">{order.pickup.split(',')[0]}</span>
                              <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                              <span className="truncate max-w-[85px] text-right font-medium text-gray-700">{order.destination.split(',')[0]}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setScreen('tracking');
                            }}
                            className="w-full bg-[#0284c7] hover:bg-sky-700 text-white text-[9px] uppercase tracking-wider font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer border-none"
                          >
                            <Compass className="w-3 h-3" />
                            <span>Track Full Journey</span>
                          </button>
                        </div>
                      ))}

                    {orders.filter(o => !searchId || o.id.toLowerCase().includes(searchId.toLowerCase().trim())).length === 0 && (
                      <div className="col-span-full text-center py-12 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                        <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <h4 className="font-bold text-xs text-gray-900">No shipments found</h4>
                        <p className="text-[10px] text-gray-555 font-semibold">Try another search or register a new delivery.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* 3. GUIDED ORDER CREATION WIZARD (STEP-BY-STEP PROGRESSIVE WIZARD) */}
              {activeTab === 'customer-create' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200 text-left">
                    <h3 className="text-xs font-semibold text-gray-900">Book a New Delivery</h3>
                    <p className="text-[9px] text-gray-550">Configure pickup, dropoff, and parcel details to dispatch via highway commuter corridor.</p>
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
                          <p className="text-xs text-gray-500 max-w-md mx-auto">
                            Configure pickup, dropoff, and parcel details to dispatch via highway commuter corridor.
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
                            label="Pickup Location"
                            placeholder="Search or detect pickup point..."
                            value={isCustomPickup ? customPickup : pickup}
                            onChange={(val) => {
                              const isPreset = villageNodes.includes(val);
                              if (isPreset) {
                                setPickup(val);
                                setIsCustomPickup(false);
                              } else {
                                setCustomPickup(val);
                                setIsCustomPickup(true);
                              }
                            }}
                            suggestionsPreset={['Bhopal Hub Node', 'Sehore Terminal', 'Kurawar Gateway']}
                          />

                          {/* Dropoff location */}
                          <AddressInput
                            label="Dropoff Destination"
                            placeholder="Search or detect dropoff point..."
                            value={isCustomDestination ? customDestination : destination}
                            onChange={(val) => {
                              const isPreset = villageNodes.includes(val);
                              if (isPreset) {
                                setDestination(val);
                                setIsCustomDestination(false);
                              } else {
                                setCustomDestination(val);
                                setIsCustomDestination(true);
                              }
                            }}
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
                              <span>Proceed to Contacts</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 2: CONTACT INFORMATION */}
                    {bookingStep === 2 && (
                      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-6 animate-fade-up">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] font-mono flex items-center gap-1.5 pb-2 border-b border-gray-100">
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>2. Contact Information</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          <div className="space-y-2">
                            <h5 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">Sender Details</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                required
                                placeholder="Name (e.g. Vijay Kirana)"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                              />
                              <input
                                type="tel"
                                required
                                placeholder="Mobile (+91...)"
                                value={senderPhone}
                                onChange={(e) => setSenderPhone(e.target.value)}
                                className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 pt-1 md:pt-0">
                            <h5 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider font-mono">Receiver Details</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                required
                                placeholder="Name (e.g. Ramesh Patel)"
                                value={receiverName}
                                onChange={(e) => setReceiverName(e.target.value)}
                                className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                              />
                              <input
                                type="tel"
                                required
                                placeholder="Mobile (+91...)"
                                value={receiverPhone}
                                onChange={(e) => setReceiverPhone(e.target.value)}
                                className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => setBookingStep(1)}
                            className="border border-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 hover:bg-gray-55 transition-colors cursor-pointer bg-white"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                          </button>
                          
                          {senderName && senderPhone && receiverName && receiverPhone && (
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
                            <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Category</label>
                            <input
                              type="text"
                              required
                              placeholder="Medicines, Sweets..."
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Weight Class</label>
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
                          <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block font-mono">Special Instructions</label>
                          <input
                            type="text"
                            placeholder="Fragile sweets, keep dry, deliver before evening..."
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="w-full bg-white rounded-xl border border-gray-300 py-2 px-3 text-xs focus:border-[#0284c7] focus:outline-none transition-all text-gray-900 shadow-sm font-semibold"
                          />
                        </div>

                        <div className="flex justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => setBookingStep(2)}
                            className="border border-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 hover:bg-gray-55 transition-colors cursor-pointer bg-white"
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

                    {/* STEP 4: FINAL ESTIMATED RECEIPT */}
                    {bookingStep === 4 && (
                      <div className="bg-white border border-gray-250 p-6 rounded-2xl shadow-lg max-w-md mx-auto space-y-6 animate-fade-up">
                        <div className="pb-2 border-b border-gray-200 text-center">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-550 font-mono">
                            Estimated Receipt
                          </h4>
                        </div>

                        <div className="space-y-3.5 py-2 text-xs text-gray-650 border-b border-gray-150 text-left">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Pickup:</span>
                            <strong className="text-gray-900 truncate max-w-[200px]">{getActualPickupName()}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Destination:</span>
                            <strong className="text-gray-900 truncate max-w-[200px]">{getActualDestinationName()}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Est. Distance:</span>
                            <strong className="text-gray-900 font-mono">{getEstimatedDistance()} km</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Weight Class:</span>
                            <strong className="text-gray-900">{size.split(' ')[0]}</strong>
                          </div>
                        </div>

                        <div className="py-3 text-center bg-gray-50 rounded-2xl border border-gray-150">
                          <p className="text-[8px] uppercase font-bold text-gray-400 block font-mono">Service Reward Payout</p>
                          <strong className="text-green-600 font-mono text-3xl font-black block mt-1">
                            ₹{getEstimatedDistance() * 24}
                          </strong>
                          <span className="text-[8px] text-gray-400 block mt-1">Commuter corridor incentive matches automatically.</span>
                        </div>

                        <div className="bg-blue-50 border border-blue-200/60 p-3.5 rounded-xl text-[9.5px] text-blue-700 leading-relaxed flex items-start gap-2 text-left">
                          <span className="shrink-0 mt-0.5">ℹ️</span>
                          <p>The system will scan for highway commuters along this route immediately after registration.</p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setBookingStep(3)}
                            className="border border-gray-300 text-gray-650 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-gray-55 transition-colors cursor-pointer w-1/3 shrink-0 bg-white"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                          </button>
                          
                          <button
                            type="submit"
                            className="flex-1 bg-[#0284c7] hover:bg-[#0284c7]/95 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md border-none animate-pulse hover:animate-none"
                          >
                            <span>Confirm & Book Route</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* 2. RESOLVED HANDOVER HISTORY */}
              {activeTab === 'customer-history' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-900">Resolved Handovers</h3>
                    <p className="text-[9px] text-gray-500">Historical custody transfers settled on the Route Matrix ledger.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders
                      .filter((o) => o.status === 'delivered')
                      .map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 p-4 rounded-xl space-y-2 hover:border-[#0284c7]/30 transition-all duration-300 relative group overflow-hidden shadow-sm">
                          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <ThumbsUp className="w-10 h-10 text-gray-900" />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-[#0284c7] font-mono">{order.id}</span>
                            <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">
                              Delivered
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[10px] border-y border-gray-200 py-2 text-gray-600">
                            <div className="flex justify-between">
                              <span>Commodity:</span>
                              <strong className="text-gray-900">{order.category}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Traveler Commuter:</span>
                              <strong className="text-gray-900">{order.partnerName}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Segment:</span>
                              <span className="text-gray-900 truncate max-w-[120px]">{order.pickup.split(',')[0]} ➔ {order.destination.split(',')[0]}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                    {orders.filter((o) => o.status === 'delivered').length === 0 && (
                      <div className="col-span-2 text-center py-10 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                        <RotateCcw className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin-slow" />
                        <p className="text-[10px] text-gray-555 font-semibold">No resolved receipt ledgers.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
    </div>
  );
};
