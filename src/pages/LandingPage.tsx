import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  MapPin,
  Users,
  CheckCircle2,
  Zap,
  Lock,
  Smartphone,
  Sparkles,
  Clock,
  Wallet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InteractiveRouteMap } from '../components/InteractiveRouteMap';
import { Navbar } from '../components/Navbar';

export const LandingPage: React.FC = () => {
  const { setScreen, setUserRole, t } = useApp();

  // Section 4: Breakthrough interactive simulation state (System Steps)
  const [breakthroughStep, setBreakthroughStep] = useState(1);
  const [breakthroughRunning, setBreakthroughRunning] = useState(true);

  // Flywheel active state highlighting
  const [flywheelIndex, setFlywheelIndex] = useState(0);

  const bgImageUrl = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85";
  const grassImageUrl = "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png";

  // Automatic breakthrough step increment loop
  useEffect(() => {
    if (!breakthroughRunning) return;
    const interval = setInterval(() => {
      setBreakthroughStep((prev) => (prev % 5) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [breakthroughRunning]);

  // Flywheel highlight rotation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFlywheelIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = (role: 'shopkeeper' | 'partner') => {
    setUserRole(role);
    setScreen('login');
  };

  const flywheelSteps = [
    { label: 'More Travelers', desc: 'Increases overlapping schedule coverage across towns' },
    { label: 'More Routes', desc: 'Connects obscure rural coordinates and remote village terminals' },
    { label: 'More Deliveries', desc: 'Businesses gain instant delivery times, avoiding commercial latency' },
    { label: 'More Businesses', desc: 'Merchants migrate their physical supply chains onto travelers backseats' },
    { label: 'More Earnings', desc: 'Distributes platform payouts directly back to commuter wallets' }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-[#e0f2fe] via-[#f8fafc] to-[#ffffff] text-gray-800 overflow-hidden select-none font-sans">
      
      {/* SECTION 1 — PREMIUM HERO SECTION */}
      <section 
        className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col justify-between bg-[#e0f2fe]"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      >
        {/* Bottom fade overlay to blend the hero landscape cleanly into the sky-blue scroll background */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#e0f2fe] to-transparent pointer-events-none z-10" />
        {/* Top Navigation */}
        <Navbar />

        {/* Spacing spacer 1 */}
        <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

        {/* Main Hero Content */}
        <div className="relative z-10 px-4 flex flex-col items-center text-center max-w-4xl mx-auto w-full text-black">
          {/* Headline */}
          <h1 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px] flex flex-col items-center">
            <span className="animate-fade-up">{t('Routes that Connect.')}</span>
            <span className="animate-fade-up [animation-delay:100ms]">{t('Journeys that Deliver.')}</span>
          </h1>

          {/* Description */}
          <p className="animate-fade-up [animation-delay:340ms] mt-4 sm:mt-5 text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-medium">
            {t('Bridging distances through everyday journeys.')}
          </p>

          {/* Action Buttons */}
          <div className="animate-fade-up [animation-delay:460ms] mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => handleCTA('shopkeeper')}
              className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all focus:outline-none"
            >
              {t('Dispatch Cargo')}
            </button>
            <button 
              onClick={() => handleCTA('partner')}
              className="text-gray-800 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-400 bg-white/40 hover:bg-white/75 transition-colors focus:outline-none"
            >
              {t('Become Partner')}
            </button>
          </div>
        </div>

        {/* Spacing spacer 2 */}
        <div className="flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

        {/* Important Data Stats Dashboard Preview */}
        <div className="animate-hero-rise [animation-delay:620ms] relative z-20 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 mb-8 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-300">
            {/* Stat 1 */}
            <div className="pt-2 md:pt-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight block font-sans">4,820+</span>
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider mt-1.5 block">{t("Travel Partners Joined")}</span>
              <span className="text-[10px] text-gray-700 font-medium mt-0.5 block">{t("Verified commuter nodes")}</span>
            </div>
            
            {/* Stat 2 */}
            <div className="pt-4 md:pt-0 md:pl-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight block font-sans">92,410+</span>
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider mt-1.5 block">{t("Shipments Delivered")}</span>
              <span className="text-[10px] text-gray-700 font-medium mt-0.5 block">{t("Completed safe handovers")}</span>
            </div>
            
            {/* Stat 3 */}
            <div className="pt-4 md:pt-0 md:pl-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight block font-sans">120+</span>
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider mt-1.5 block">{t("Rural Hubs Connected")}</span>
              <span className="text-[10px] text-gray-700 font-medium mt-0.5 block">{t("Bridging remote villages")}</span>
            </div>
            
            {/* Stat 4 */}
            <div className="pt-4 md:pt-0 md:pl-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight block font-sans">₹31.5L+</span>
              <span className="text-xs font-bold text-purple-950 uppercase tracking-wider mt-1.5 block">{t("Commuter Earnings")}</span>
              <span className="text-[10px] text-gray-700 font-medium mt-0.5 block">{t("Distributed route payouts")}</span>
            </div>
          </div>
        </div>

        {/* Grass Overlay */}
        <img 
          src={grassImageUrl} 
          alt="" 
          className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none" 
        />
      </section>


      {/* SECTION 2 — FOUNDER'S PITCH: CORE PURPOSE */}
      <section className="bg-transparent py-24 px-6 md:px-12 text-gray-800 relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primaryApp/10 border border-primaryApp/20 text-[#0284c7] text-[10px] font-bold uppercase tracking-wider font-sans">
            <Sparkles className="w-3.5 h-3.5" /> {t("Founder's Core Mission")}
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-gray-900 uppercase leading-none">
            {t("Utilizing Journeys Already Happening.")}
          </h2>

          <div className="p-8 md:p-10 bg-white border border-gray-200/80 rounded-3xl text-left relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#0284c7]" />
            <p className="text-base sm:text-xl font-medium text-gray-850 italic leading-relaxed font-serif">
              "{t("Setu Hub is developed to utilize existing travel routes by connecting goods with people already travelling toward a destination, creating additional income opportunities and a low-cost local logistics network.")}"
            </p>
            <div className="mt-6 flex items-center justify-between text-xs font-sans text-gray-555 border-t border-gray-100 pt-4">
              <span>- {t("Platform Abstract Objective")}</span>
              <span className="text-primaryApp font-semibold">{t("PROJECT SETU HUB")}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Instead of adding new logistics networks, carbon emissions, and heavy trucks, we overlay local commerce demand directly on top of daily commuter schedules.
          </p>
        </div>
      </section>


      {/* SECTION 3 — THE PROBLEMS WE ADDRESS (3 SCENARIOS) */}
      <section id="problem" className="py-32 px-6 md:px-12 bg-transparent relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[9px] font-sans font-bold text-red-500 uppercase tracking-wider bg-red-50 border border-red-200/60 px-3.5 py-1.5 rounded-full">
              The logistics bottleneck
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-gray-900 uppercase leading-none">
              A Highly Fragmented Ground Reality.
            </h2>
            <p className="text-xs text-gray-550 leading-relaxed font-medium">
              Rural and semi-urban product transportation currently suffers from a lack of organization. Here are the three real-world scenarios SetuHub addresses:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Scenario 1: Shopkeeper */}
            <div className="bg-white border border-gray-200/80 hover:border-red-400/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-sans bg-red-50 text-red-650 px-2 py-0.5 rounded border border-red-200/50">SCENARIO 01</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-gray-900 uppercase font-sans">Rural Shopkeeper Waiting</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  A shopkeeper needs products from a nearby town. Deliveries depend entirely on local buses, personal contacts, and manual coordination.
                </p>
                <ul className="text-[10px] text-red-650 font-sans space-y-2 pt-2">
                  <li>➔ No real-time tracking of cargo</li>
                  <li>➔ Repeated calls to bus operators</li>
                  <li>➔ Delayed sales and customer loss</li>
                </ul>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 text-[10px] font-sans text-gray-450 flex justify-between">
                <span>IMPACT</span>
                <span className="text-red-550 font-bold uppercase">Reduced Business Efficiency</span>
              </div>
            </div>

            {/* Scenario 2: Market Representative */}
            <div className="bg-white border border-gray-200/80 hover:border-red-400/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-sans bg-red-50 text-red-650 px-2 py-0.5 rounded border border-red-200/50">SCENARIO 02</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-gray-900 uppercase font-sans">MR Losing Sales Options</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Market Representatives receive urgent orders from shopkeepers but struggle to book dispatch routes.
                </p>
                <ul className="text-[10px] text-red-650 font-sans space-y-2 pt-2">
                  <li>➔ Physically carrying cargo to bus stands</li>
                  <li>➔ High uncertainty on parcel loading</li>
                  <li>➔ Orders cancelled due to delivery delays</li>
                </ul>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 text-[10px] font-sans text-gray-450 flex justify-between">
                <span>IMPACT</span>
                <span className="text-red-550 font-bold uppercase">Lost Retail Revenue</span>
              </div>
            </div>

            {/* Scenario 3: Isolated Customer */}
            <div className="bg-white border border-gray-200/80 hover:border-red-400/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-sans bg-red-50 text-red-650 px-2 py-0.5 rounded border border-red-200/50">SCENARIO 03</span>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-gray-900 uppercase font-sans">Isolated Village Customer</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  A village resident wants to buy a product available only in a nearby town but lacks access.
                </p>
                <ul className="text-[10px] text-red-650 font-sans space-y-2 pt-2">
                  <li>➔ Depends on chance traveling relatives</li>
                  <li>➔ No organized small order logistics</li>
                  <li>➔ Complete isolation from nearby markets</li>
                </ul>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 text-[10px] font-sans text-gray-450 flex justify-between">
                <span>IMPACT</span>
                <span className="text-red-550 font-bold uppercase">Product Access Inequality</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SECTION 4 — HOW IT WORKS: THE 5-STEP CORE ENGINE */}
      <section className="py-32 px-6 md:px-12 bg-transparent relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[9px] font-bold text-primaryApp uppercase tracking-wider bg-primaryApp/10 border border-primaryApp/25 px-3.5 py-1.5 rounded-full font-sans">
              The solution architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-gray-900 uppercase leading-none">
              A Coordinate Route-Matching Flow.
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              We connect parcels with travelers moving in the same direction. Follow the system sequence designed to secure local logistics:
            </p>
          </div>

          {/* Timeline sequencer grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side: Interactive Map visual tracking */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="flex-1 bg-white border border-gray-200 p-2.5 rounded-3xl shadow-md overflow-hidden relative flex flex-col">
                <div className="flex-1 min-h-[380px] relative rounded-2xl overflow-hidden border border-gray-100">
                  <InteractiveRouteMap
                    mode="journey-tracking"
                    theme="light"
                    selectedOrderId="SH-2931"
                    activeOrders={[{
                      id: 'SH-2931',
                      pickup: 'Sehore Terminal',
                      destination: 'Bhopal Hub Node',
                      category: 'Medicines',
                      status: breakthroughStep === 1 ? 'pending' : breakthroughStep === 2 ? 'matched' : breakthroughStep === 3 ? 'picked_up' : breakthroughStep === 4 ? 'in_transit' : 'delivered'
                    }]}
                  />
                </div>
                
                {/* Status bar */}
                <div className="mt-3 bg-gray-55 border border-gray-200 p-3 rounded-xl flex items-center justify-between text-[10px] font-sans text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-primaryApp rounded-full animate-ping" /> SEGMENT COMPUTE ACTIVE</span>
                  <span className="text-primaryApp font-semibold">MATCH RATE: 18.5 MINS</span>
                </div>
              </div>
            </div>

            {/* Right side: system timeline details */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-md flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-bold text-gray-800 font-sans uppercase">System sequence execution</span>
                  <button
                    onClick={() => setBreakthroughRunning(!breakthroughRunning)}
                    className="text-[9px] text-primaryApp font-sans uppercase hover:underline"
                  >
                    {breakthroughRunning ? '⏸ Pause Loop' : '▶ Play Loop'}
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    { stepNum: 1, icon: <Users className="w-3.5 h-3.5" />, label: 'Step 1: Registration', desc: 'Onboard through Web, WhatsApp, or voice in local language, collecting basic details.' },
                    { stepNum: 2, icon: <MapPin className="w-3.5 h-3.5" />, label: 'Step 2: Order Booking', desc: 'Provide pickup coordinates, destination point, category type, and recipient details.' },
                    { stepNum: 3, icon: <Zap className="w-3.5 h-3.5" />, label: 'Step 3: Route Matching', desc: 'System automatically screens traveler trajectories to locate optimal route overlaps.' },
                    { stepNum: 4, icon: <Lock className="w-3.5 h-3.5" />, label: 'Step 4: Pickup OTP Handover', desc: 'Verify pickup custody dynamically using secure cryptographic OTP code.' },
                    { stepNum: 5, icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'Step 5: Custodian Clearance', desc: 'Confirm delivery via recipient OTP verification, releasing commuter payment instantly.' }
                  ].map((item) => {
                    const isPassed = breakthroughStep >= item.stepNum;
                    const isActive = breakthroughStep === item.stepNum;

                    return (
                      <div
                        key={item.stepNum}
                        onClick={() => {
                          setBreakthroughStep(item.stepNum);
                          setBreakthroughRunning(false);
                        }}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-xs flex items-start gap-3.5 ${
                          isActive
                            ? 'border-primaryApp bg-primaryApp/5 text-gray-900 shadow-md'
                            : isPassed
                            ? 'border-green-200 bg-green-50/50 text-gray-600'
                            : 'border-transparent text-gray-400 hover:text-gray-650'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-sans text-[9px] font-bold border shrink-0 ${
                          isActive
                            ? 'bg-primaryApp text-bgApp border-primaryApp'
                            : isPassed
                            ? 'bg-green-500/10 text-green-600 border-green-500/20'
                            : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}>
                          {item.icon}
                        </span>
                        <div>
                          <h4 className="font-bold uppercase tracking-wider">{item.label}</h4>
                          {isActive && <p className="text-[10px] text-gray-500 mt-1 leading-normal font-sans">{item.desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 5 — CONSENSUS SCALE (FLYWHEEL) */}
      <section className="py-32 px-6 md:px-12 bg-transparent relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[9px] font-bold text-primaryApp uppercase tracking-wider bg-primaryApp/10 border border-primaryApp/25 px-3.5 py-1.5 rounded-full font-sans">
              The network flywheel
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-gray-900 uppercase leading-none">
              Self-Reinforcing Corridor Density.
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed font-sans font-medium">
              Our network operates on scale incentives. As more commuters register routes, delivery speed increases. Higher speed attracts local merchants, routing cash rewards back to commuter wallets, which pulls in more travelers.
            </p>
          </div>

          {/* Light Flywheel */}
          <div className="lg:col-span-7 flex justify-center items-center relative py-10">
            <div className="relative w-80 h-80 rounded-full border border-gray-200 flex items-center justify-center">
              
              {/* Spinning border grid */}
              <div className="absolute inset-0 rounded-full border border-dashed border-primaryApp/15 animate-spin-slow pointer-events-none" />

              {/* Center core circle */}
              <div className="w-32 h-32 rounded-full bg-white border-2 border-primaryApp/30 flex flex-col items-center justify-center text-center p-4 shadow-xl z-20">
                <TrendingUp className="w-7 h-7 text-primaryApp animate-pulse mb-1.5" />
                <span className="text-[9px] font-bold text-gray-900 tracking-wider font-sans">NETWORK CYCLE</span>
              </div>

              {/* Flywheel surrounding nodes */}
              {flywheelSteps.map((step, idx) => {
                const angle = (idx * Math.PI * 2) / 5;
                const radius = 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isActive = flywheelIndex === idx;

                return (
                  <div
                    key={idx}
                    className="absolute z-10 transition-all duration-500 font-sans text-[9px] text-center"
                    style={{
                      transform: `translate(${x}px, ${y}px)`
                    }}
                  >
                    <div className={`p-2 px-3 rounded-xl border flex flex-col items-center justify-center max-w-[100px] transition-all duration-300 ${
                      isActive
                        ? 'border-primaryApp bg-primaryApp/5 text-gray-900 shadow-lg scale-105'
                        : 'border-gray-200 bg-white text-gray-500'
                    }`}>
                      <span className="font-bold block uppercase leading-none">{step.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 6 — STAKEHOLDER BENEFITS (FOUNDER'S COCKPIT) */}
      <section className="py-32 px-6 md:px-12 bg-transparent relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[9px] font-bold text-primaryApp uppercase tracking-wider bg-primaryApp/10 border border-primaryApp/25 px-3.5 py-1.5 rounded-full font-sans">
              Expected outcomes
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-gray-900 uppercase leading-none">
              A Win-Win Logistics Ecosystem.
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              SetuHub creates direct economic and operational value for every participant in the community:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Businesses / Shopkeepers */}
            <div className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-6 space-y-4 hover:border-primaryApp/30 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-primaryApp/10 flex items-center justify-center text-[#0284c7]">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 uppercase font-sans">For Shopkeepers</h3>
              <p className="text-xs text-gray-605 leading-relaxed">
                Unlock same-day or next-day delivery coordinates, allowing you to serve customers faster and expand your catalog coverage.
              </p>
              <ul className="text-[10px] font-sans text-[#0284c7] space-y-1.5 pt-2">
                <li>✓ Reduce dependency on bus timelines</li>
                <li>✓ Mitigate lost sales from delay gaps</li>
                <li>✓ Automated digital receipts ledger</li>
              </ul>
            </div>

            {/* Travellers / Commuters */}
            <div className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-6 space-y-4 hover:border-green-500/30 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 uppercase font-sans">For Travelers & Students</h3>
              <p className="text-xs text-gray-605 leading-relaxed">
                Earn extra income during journeys you are already making. Turn empty backseat capacity into coordinate wallet rewards.
              </p>
              <ul className="text-[10px] font-sans text-green-600 space-y-1.5 pt-2">
                <li>✓ Flexible model - no full time workload</li>
                <li>✓ Covers travel fuel & commuter costs</li>
                <li>✓ Safe, OTP-validated cargo pick-ups</li>
              </ul>
            </div>

            {/* Customers */}
            <div className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-6 space-y-4 hover:border-gray-400 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 uppercase font-sans">For Rural Customers</h3>
              <p className="text-xs text-gray-605 leading-relaxed">
                Gain instant access to products in nearby markets, reducing wait times for medicines, tools, and spare parts.
              </p>
              <ul className="text-[10px] font-sans text-sky-750 space-y-1.5 pt-2">
                <li>✓ Direct deliveries to home/shop coordinates</li>
                <li>✓ Cryptographic OTP handover security</li>
                <li>✓ Complete journey transparency</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      
      {/* SECTION 8 — FOOTER COCKPIT TERMINAL */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6 md:px-12 text-center text-xs font-sans">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm font-display uppercase tracking-widest">SETU <span className="text-primaryApp">HUB</span></span>
            <span className="text-[8px] bg-gray-800 px-2.5 py-0.5 rounded text-gray-400 font-sans">V2.5 SECURITY CONSENSUS</span>
          </div>

          <div className="flex gap-6 text-[10px] uppercase font-bold tracking-wider">
            <a href="#problem" className="text-gray-400 hover:text-white transition-colors">the problem</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">the breakthrough</a>
            <a href="#travelers" className="text-gray-400 hover:text-white transition-colors">the opportunity</a>
          </div>

          <span className="text-[10px] text-gray-500 font-sans">© 2026 Setu Hub Inc. Secure route-based logistics.</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
