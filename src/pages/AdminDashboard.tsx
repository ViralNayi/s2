import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Search,
  ShieldAlert,
  Users,
  Globe,
  Activity,
  Cpu,
  Layers,
  DollarSign,
  UserCheck,
  CheckCircle,
  ExternalLink,
  Lock,
  Unlock,
  Compass,
  Sparkles,
  Home
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Order } from '../context/AppContext';
import { Logo } from '../components/Logo';

interface AdminDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { orders, verifyDeliveryOTP, setScreen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interactive Simulator Local State
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 'USR-291', name: 'Vijay Kirana Store', role: 'Shopkeeper', status: 'verified', joining: '12 Jan 2026', orders: 18 },
    { id: 'USR-902', name: 'Vikram Singh', role: 'Delivery Partner', status: 'verified', joining: '04 Feb 2026', orders: 34 },
    { id: 'USR-124', name: 'Aarav Sharma', role: 'Customer', status: 'verified', joining: '19 Feb 2026', orders: 8 },
    { id: 'USR-882', name: 'Rohan Verma', role: 'Delivery Partner', status: 'verified', joining: '02 Mar 2026', orders: 12 },
    { id: 'USR-502', name: 'Ramesh Patel', role: 'pending_review', joining: '14 Jun 2026', orders: 1 },
  ]);

  const [disputes, setDisputes] = useState([
    {
      id: 'DISP-102',
      orderId: 'SH-2931',
      sender: 'Vijay Kirana Store',
      driver: 'Vikram Singh',
      issue: 'OTP network failure at Vidisha.',
      status: 'pending',
    },
    {
      id: 'DISP-899',
      orderId: 'SH-8842',
      sender: 'Chawla Store',
      driver: 'Unassigned',
      issue: 'Request pending for over 4 hours with no matches.',
      status: 'resolved',
    },
  ]);

  const [systemLogs, setSystemLogs] = useState([
    { time: '11:24:02', message: 'SYS_DAEMON: Port 5173 listening. Consensus ledger node synchronized.' },
    { time: '11:25:15', message: 'MATCH_ENGINE: Scanned overlap indices. Node BHOPAL-STANDBY active.' },
    { time: '11:26:48', message: 'SECURITY: Cryptographic signature tokens generated for ledger SH-9902.' }
  ]);

  // Analytics Calculation
  const totalOrdersCount = orders.length;
  const activeRoutesCount = orders.filter((o) => ['matched', 'picked_up', 'in_transit', 'near_destination'].includes(o.status)).length;
  const totalPlatformVolume = orders.reduce((acc, curr) => acc + curr.reward, 0);
  const platformRevenue = Math.floor(totalPlatformVolume * 0.15); // 15% platform commission

  // Mock Analytics Chart Data
  const analyticsData = [
    { name: '08 Jun', Orders: 24, Revenue: 3600, Commuters: 15 },
    { name: '09 Jun', Orders: 38, Revenue: 5700, Commuters: 22 },
    { name: '10 Jun', Orders: 32, Revenue: 4800, Commuters: 19 },
    { name: '11 Jun', Orders: 45, Revenue: 6750, Commuters: 28 },
    { name: '12 Jun', Orders: 55, Revenue: 8250, Commuters: 34 },
    { name: '13 Jun', Orders: 62, Revenue: 9300, Commuters: 38 },
    { name: '14 Jun', Orders: 74, Revenue: 11100, Commuters: 46 },
  ];

  // Simulator actions
  const handleApproveKYC = (userId: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: 'verified' } : u))
    );
    setSystemLogs(prev => [
      { time: new Date().toTimeString().split(' ')[0], message: `KYC_ENGINE: KYC verification approved for node ${userId}.` },
      ...prev
    ]);
  };

  const handleDisputeBypass = (disputeId: string, orderId: string) => {
    // 1. Resolve dispute locally
    setDisputes(prev =>
      prev.map(d => (d.id === disputeId ? { ...d, status: 'resolved' } : d))
    );
    
    // 2. Force mark order as delivered in global AppState
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      verifyDeliveryOTP(orderId, targetOrder.deliveryOTP);
    }

    setSystemLogs(prev => [
      { time: new Date().toTimeString().split(' ')[0], message: `OVERRIDE_ENGINE: Dispute ${disputeId} bypassed. Release verified for order ${orderId}.` },
      ...prev
    ]);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">BROADCASTING</span>;
      case 'matched': return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/25 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">MATCHED</span>;
      case 'picked_up': return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/25 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">SECURED</span>;
      case 'in_transit': return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">IN TRANSIT</span>;
      case 'pending': return <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">BROADCASTING</span>;
      case 'matched': return <span className="bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">MATCHED</span>;
      case 'picked_up': return <span className="bg-purple-100 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">SECURED</span>;
      case 'in_transit': return <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">IN TRANSIT</span>;
      case 'near_destination': return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/25 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">ARRIVING</span>;
      case 'delivered': return <span className="bg-green-500/10 text-green-400 border border-green-500/25 px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono">DELIVERED</span>;
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
                  A
                </div>
                <span className="text-[10px] text-gray-800 font-semibold truncate">Operator</span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-0.5">
                {[
                  { id: 'admin-analytics', label: 'Analytics Command', icon: Compass },
                  { id: 'admin-users', label: 'KYC Directory', icon: Users },
                  { id: 'admin-live', label: 'Live network Feed', icon: Globe },
                  { id: 'admin-disputes', label: 'Resolution Desk', icon: ShieldAlert }
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
                          : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100'
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
              <div className="truncate">Control Core Node</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white p-5 flex flex-col gap-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white text-base font-semibold shrink-0 font-display">
                  O
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Super Admin Core</h2>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveTab('admin-disputes')}
                className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Override Signature</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
              {[
                { label: 'TOTAL CARGO', value: `${totalOrdersCount}`, sub: 'Ingested shipments' },
                { label: 'ACTIVE HANDOVERS', value: `${activeRoutesCount}`, sub: 'Live routes matching' },
                { label: 'COMPENSATION', value: `₹${totalPlatformVolume.toLocaleString()}`, sub: 'UPI Commuter payouts' },
                { label: 'NET YIELD (15%)', value: `₹${platformRevenue.toLocaleString()}`, sub: 'Platform revenue' }
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
              {/* Tab: admin-analytics / Unified Command deck layout */}
              {activeTab === 'admin-analytics' && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                  {/* Column 1: Left - Global logistics list & disputes feed */}
                  <div className="xl:col-span-4 space-y-4">
                    {/* Global logistics ledger monitor */}
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#0284c7] animate-spin-slow" />
                          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-800">Logistics Feed</h3>
                        </div>
                        <span className="text-[7.5px] font-bold bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">Live telemetry</span>
                      </div>

                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {orders.slice(0, 4).map((o) => (
                          <div key={o.id} className="p-2.5 bg-white border border-gray-200 rounded-lg flex items-center justify-between gap-2.5 hover:border-[#0284c7]/20 transition-all shadow-sm">
                            <div className="space-y-0.5">
                              <span className="font-mono text-[10px] font-black text-[#0284c7]">{o.id}</span>
                              <p className="text-[9px] text-gray-500 truncate max-w-[110px]">
                                {o.pickup.split(',')[0]} → {o.destination.split(',')[0]}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              {getStatusBadge(o.status)}
                              <p className="text-[9px] text-green-600 font-bold mt-0.5">₹{o.reward}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* disputes quick widget */}
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <div className="flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-800">Dispute Desk Overrides</h3>
                        </div>
                        <span className="text-[7.5px] text-red-600 font-bold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Action Required</span>
                      </div>

                      <div className="space-y-2">
                        {disputes.filter(d => d.status === 'pending').map((d) => (
                          <div key={d.id} className="p-2.5 bg-red-50 border border-red-200 rounded-lg space-y-2">
                            <div className="flex justify-between items-center text-[9px]">
                              <span className="font-bold text-red-600 font-mono">{d.id}</span>
                              <span className="text-gray-400 font-mono">Linked: {d.orderId}</span>
                            </div>
                            <p className="text-[9.5px] text-gray-700 leading-relaxed font-semibold">{d.issue}</p>
                            <button
                              onClick={() => handleDisputeBypass(d.id, d.orderId)}
                              className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[8.5px] uppercase tracking-widest transition-all"
                            >
                              Bypass Cryptographic Signature
                            </button>
                          </div>
                        ))}
                        {disputes.filter(d => d.status === 'pending').length === 0 && (
                          <div className="text-center py-3 border border-gray-200 border-dashed rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                            <p className="text-[9px] text-gray-500 font-semibold">All dispute vectors cleared.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Center - Charts telemetry */}
                  <div className="xl:col-span-5 space-y-4">
                    {/* Chart 1: Order volume area chart */}
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#0284c7]" />
                          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-800">Dynamic Route Volume (7d)</h3>
                        </div>
                        <span className="text-[8px] text-[#0284c7] font-bold font-mono">Corridor load</span>
                      </div>

                      <div className="h-[120px] w-full pr-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsData}>
                            <defs>
                              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                            <Tooltip
                              contentStyle={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                color: '#0f172a',
                                fontSize: '8px',
                                borderRadius: '8px'
                              }}
                            />
                            <Area type="monotone" dataKey="Orders" stroke="#0284c7" strokeWidth={1.5} fillOpacity={1} fill="url(#colorOrders)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Chart 2: Platform gross revenue */}
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-green-600" />
                          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-800">Platform Gross Volume Billing</h3>
                        </div>
                        <span className="text-[8px] text-green-600 font-bold font-mono">Revenue yield</span>
                      </div>

                      <div className="h-[120px] w-full pr-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                            <Tooltip
                              contentStyle={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                color: '#0f172a',
                                fontSize: '8px',
                                borderRadius: '8px'
                              }}
                            />
                            <Bar dataKey="Revenue" fill="#0284c7" radius={[3, 3, 0, 0]} opacity={0.7} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Right - User list & active system logs ticker */}
                  <div className="xl:col-span-3 space-y-4">
                    {/* User status directory widget */}
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#0284c7]" />
                          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-800">KYC Node Directory</h3>
                        </div>
                        <span className="text-[8px] font-bold text-gray-500">Review pending</span>
                      </div>

                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                        {registeredUsers.map((u) => (
                          <div key={u.id} className="p-2 bg-white border border-gray-200 rounded-lg space-y-1.5 hover:border-[#0284c7]/25 transition-all shadow-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[7px] text-gray-500 font-mono uppercase tracking-wider">{u.id}</span>
                                <h4 className="font-bold text-[10px] text-gray-850 truncate max-w-[80px]">{u.name}</h4>
                              </div>
                              <span className={`px-1 py-0.5 rounded text-[6.5px] font-black uppercase tracking-wider border ${
                                u.status === 'verified'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                                {u.status}
                              </span>
                            </div>
                            {u.status !== 'verified' && (
                              <button
                                onClick={() => handleApproveKYC(u.id)}
                                className="w-full py-1 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-md text-[8px] uppercase tracking-wider transition-colors"
                              >
                                Approve KYC
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* active live system logs monitor */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="bg-gray-50 border-b border-gray-200 py-2 px-3 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-[#0284c7] animate-pulse" />
                          <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-800">Sys Logs Core</h4>
                        </div>
                        <span className="text-[7px] font-mono text-gray-500">LIVE</span>
                      </div>
                      <div className="bg-gray-950 p-3.5 font-mono text-[8px] text-green-400 space-y-1.5 max-h-[120px] overflow-y-auto leading-relaxed border-t-0 select-text">
                        {systemLogs.map((log, index) => (
                          <div key={index} className="flex gap-1.5">
                            <span className="text-gray-500 shrink-0">[{log.time}]</span>
                            <span>{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: admin-users - Maximized KYC list directory */}
              {activeTab === 'admin-users' && (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 border-b border-gray-200 gap-3">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-900">User Registry Database</h3>
                      <p className="text-[9px] text-gray-500">Verify logistics identities, review KYC records, and approve merchants.</p>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search registry name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg py-1.5 pl-8 pr-3 text-[10px] focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none w-52 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {registeredUsers
                      .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((u) => (
                        <div key={u.id} className="bg-white border border-gray-200 p-4 rounded-xl space-y-3 relative overflow-hidden group hover:border-[#0284c7]/30 transition-all duration-300 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8px] text-gray-500 font-mono uppercase tracking-wider block">{u.id}</span>
                              <h4 className="font-extrabold text-xs text-gray-900 mt-0.5">{u.name}</h4>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                              u.status === 'verified'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                              {u.status === 'verified' ? 'Verified Node' : 'KYC Review'}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[10px] border-y border-gray-200 py-2.5 text-gray-655">
                            <div className="flex justify-between">
                              <span>System Role:</span>
                              <strong className="text-gray-800">{u.role}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Historical Orders:</span>
                              <strong className="text-gray-800">{u.orders} Shipments</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Registry Date:</span>
                              <span className="text-gray-800">{u.joining}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button className="flex-1 py-1.5 rounded-lg text-[9px] font-bold border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 transition-all flex items-center justify-center gap-1 bg-white">
                              <ExternalLink className="w-3 h-3" /> Audit File
                            </button>
                            {u.status !== 'verified' ? (
                              <button
                                onClick={() => handleApproveKYC(u.id)}
                                className="flex-1 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                              >
                                <UserCheck className="w-3 h-3" /> Approve KYC
                              </button>
                            ) : (
                              <div className="flex-1 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-[9px] font-black uppercase text-center flex items-center justify-center gap-1 select-none">
                                <CheckCircle className="w-3 h-3 text-green-600" /> locked
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tab: admin-live - Global logistics list monitor */}
              {activeTab === 'admin-live' && (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 border-b border-gray-200 gap-3">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-900">Global Logistics Feed</h3>
                      <p className="text-[9px] text-gray-500">Trace operational route tokens, driver match rates, and active coordinates.</p>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search ledger order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg py-1.5 pl-8 pr-3 text-[10px] focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] focus:outline-none w-52 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* Left table view */}
                    <div className="lg:col-span-8 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[10px] select-text">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 text-[8px] font-black uppercase text-gray-500 tracking-widest">
                              <th className="p-3">Cargo ID</th>
                              <th className="p-3">Origin Node</th>
                              <th className="p-3">Destination Stand</th>
                              <th className="p-3">Travel Partner</th>
                              <th className="p-3">Reward</th>
                              <th className="p-3">Consensus Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                            {orders
                              .filter((o) => o.id.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="p-3 font-black text-[#0284c7] font-mono">{o.id}</td>
                                  <td className="p-3 truncate max-w-[100px] font-semibold text-gray-800">{o.pickup.split(',')[0]}</td>
                                  <td className="p-3 truncate max-w-[100px] text-gray-500">{o.destination.split(',')[0]}</td>
                                  <td className="p-3 font-semibold text-gray-850">{o.partnerName || 'Broadcasting match...'}</td>
                                  <td className="p-3 font-bold text-green-600">₹{o.reward}</td>
                                  <td className="p-3">{getStatusBadge(o.status)}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right Map Node Status */}
                    <div className="lg:col-span-4 bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
                        <Layers className="w-3.5 h-3.5 text-[#0284c7]" />
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-800">Route Node Telemetry</h3>
                      </div>

                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                        {[
                          { name: 'Bhopal Stand', code: 'BPL_ND', active: 3, status: 'nominal' },
                          { name: 'Sehore Bypass', code: 'SEH_BY', active: 1, status: 'nominal' },
                          { name: 'Vidisha Node', code: 'VID_ND', active: 2, status: 'nominal' },
                          { name: 'Kurawar Stand', code: 'KUR_ST', active: 0, status: 'nominal' },
                          { name: 'Sonagir Junction', code: 'SON_JC', active: 1, status: 'nominal' },
                          { name: 'Mandideep Hub', code: 'MAN_HB', active: 1, status: 'nominal' },
                        ].map((node, index) => (
                          <div key={index} className="flex items-center justify-between text-[10px] p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-800">{node.name}</span>
                                <span className="text-[7.5px] font-mono text-gray-500">({node.code})</span>
                              </div>
                              <span className="text-[8px] text-gray-550 mt-0.5 block">Corridor shipments: {node.active}</span>
                            </div>

                            <span className="px-1.5 py-0.5 rounded text-[7px] font-black font-mono bg-green-50 text-green-700 border border-green-200 uppercase">
                              {node.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: admin-disputes - dispute resolution overrides */}
              {activeTab === 'admin-disputes' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-900">Resolution Override Desk</h3>
                    <p className="text-[9px] text-gray-500">Override smart contracts, resolve OTP network delivery blocks, and route driver payments.</p>
                  </div>

                  <div className="space-y-3">
                    {disputes.map((d) => (
                      <div key={d.id} className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0284c7]/25 transition-all shadow-sm">
                        <div className="space-y-1.5 flex-1 text-[10px]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-black text-red-600">{d.id}</span>
                            <span className="text-[8.5px] font-bold text-gray-400 font-mono">Linked Shipment: {d.orderId}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider border ${
                              d.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-green-50 text-green-700 border-green-200'
                            }`}>
                              {d.status}
                            </span>
                          </div>
                          <p className="font-bold text-gray-900">{d.issue}</p>
                          <p className="text-[9px] text-gray-500">
                            Sender: <span className="font-semibold text-gray-800">{d.sender}</span> | Overlap Traveler: <span className="font-semibold text-gray-800">{d.driver}</span>
                          </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button className="py-2 px-3 border border-gray-200 hover:border-gray-300 text-[9px] font-bold rounded-lg transition-all text-gray-600 hover:text-gray-900 bg-white">
                            Contact Traveler Node
                          </button>
                          
                          {d.status === 'pending' ? (
                            <button
                              onClick={() => handleDisputeBypass(d.id, d.orderId)}
                              className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold rounded-lg uppercase tracking-wider transition-all flex items-center gap-1"
                            >
                              <Lock className="w-3 h-3" /> Override Signature
                            </button>
                          ) : (
                            <div className="py-2 px-3 bg-green-50 border border-green-200 text-green-700 text-[9px] font-black rounded-lg uppercase flex items-center gap-1 select-none">
                              <Unlock className="w-3 h-3 text-green-600" /> signature bypassed
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
    </div>
  );
};
