import React from 'react';
import { Navbar } from './Navbar';
import { DashboardMockup, ScaledDashboard } from './DashboardMockup';
import { useApp } from '../context/AppContext';

export const Hero: React.FC = () => {
  const { setScreen, setUserRole } = useApp();
  const bgImageUrl = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85";
  const grassImageUrl = "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png";

  return (
    <section 
      className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col bg-[#e0f2fe]"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      {/* Top Navigation */}
      <Navbar />

      {/* Spacing spacer 1 */}
      <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Main Hero Content */}
      <div className="relative z-10 px-4 flex flex-col items-center text-center max-w-4xl mx-auto w-full">
        {/* Headline */}
        <h1 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px] flex flex-col items-center">
          <span className="animate-fade-up">Turn Routes</span>
          <span className="animate-fade-up [animation-delay:100ms]">Into Deliveries.</span>
        </h1>

        {/* Description */}
        <p className="animate-fade-up [animation-delay:340ms] mt-4 sm:mt-5 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
          Transforming Every Journey Into Opportunity.
        </p>

        {/* Action Buttons */}
        <div className="animate-fade-up [animation-delay:460ms] mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3">
          <button 
            onClick={() => {
              setUserRole('shopkeeper');
              setScreen('login');
            }}
            className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all focus:outline-none"
          >
            Dispatch Cargo
          </button>
          <button 
            onClick={() => {
              setUserRole('partner');
              setScreen('login');
            }}
            className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            Become Partner
          </button>
        </div>
      </div>

      {/* Spacing spacer 2 */}
      <div className="flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Dashboard Mockup Wrapper */}
      <div className="animate-hero-rise [animation-delay:620ms] relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32">
        <ScaledDashboard>
          <DashboardMockup />
        </ScaledDashboard>
      </div>

      {/* Grass Overlay */}
      <img 
        src={grassImageUrl} 
        alt="" 
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none" 
      />
    </section>
  );
};

export default Hero;
