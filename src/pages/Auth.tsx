import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  ShieldCheck,
  User,
  Store,
  Compass,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { RoleType } from '../context/AppContext';


export const Auth: React.FC = () => {
  const { setScreen, userRole, setUserRole, t } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login States
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOTP, setLoginOTP] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Register Wizard States
  const [step, setStep] = useState(1);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regShopName, setRegShopName] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [licenseNum, setLicenseNum] = useState('');
  const [regStatus, setRegStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Switch role and navigate
  const triggerLogin = () => {
    setLoginStatus('loading');
    setTimeout(() => {
      setLoginStatus('success');
      setTimeout(() => {
        // Redirect based on selected userRole
        setScreen(userRole);
      }, 1000);
    }, 1500);
  };

  const triggerRegister = () => {
    setRegStatus('loading');
    setTimeout(() => {
      setRegStatus('success');
      setTimeout(() => {
        setScreen(userRole);
      }, 1000);
    }, 1500);
  };

  const getStepProgress = () => {
    return (step / 3) * 100;
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gray-900/5 blur-[120px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-200 shadow-2xl relative"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold font-display uppercase tracking-wide text-gray-900">
            {authMode === 'login' ? t('Access Console') : t('Partner Network Onboarding')}
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            {authMode === 'login'
              ? t('Connect to the route matcher database node')
              : t('Complete your credentials to join Setu Hub')}
          </p>
        </div>

        {/* Auth Mode Toggle Buttons */}
        <div className="flex border-b border-gray-200 mb-6 text-sm">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 pb-3 font-semibold text-center border-b-2 transition-all ${
              authMode === 'login' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t('Sign In')}
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 pb-3 font-semibold text-center border-b-2 transition-all ${
              authMode === 'register' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t('Register')}
          </button>
        </div>

        {/* LOGIN MODE */}
        {authMode === 'login' && (
          <div className="space-y-5">
            {loginStatus === 'success' ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-gray-900">Security Signature Confirmed!</h3>
                <p className="text-xs text-gray-500 font-medium">Redirecting you to the {userRole} portal...</p>
              </div>
            ) : (
              <>
                {/* Simulator Role Selection shortcut */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    Simulate Login As Role:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(['shopkeeper', 'partner', 'customer', 'admin'] as RoleType[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => setUserRole(role)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                          userRole === role
                            ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-400 text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      {t('Phone Number')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+91 99999 88888"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="w-full bg-white rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-xs font-semibold text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {showOTPInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Enter OTP Code (Hint: 2026)
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="2026"
                          value={loginOTP}
                          onChange={(e) => setLoginOTP(e.target.value)}
                          className="w-full bg-white rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-xs font-bold tracking-[8px] text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {showOTPInput ? (
                  <button
                    onClick={triggerLogin}
                    disabled={loginStatus === 'loading'}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-4"
                  >
                    {loginStatus === 'loading' ? t('Authenticating...') : t('Sign In')}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!loginPhone) return;
                      setShowOTPInput(true);
                    }}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-4 shadow-sm"
                  >
                    {t('Send OTP')} <ArrowRight className="w-4 h-4" />
                  </button>
                )}


              </>
            )}
          </div>
        )}

        {/* REGISTRATION WIZARD */}
        {authMode === 'register' && (
          <div className="space-y-6">
            {regStatus === 'success' ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-gray-900">Welcome to Setu Hub Network!</h3>
                <p className="text-xs text-gray-500 font-medium">Setting up your cryptographic route credentials...</p>
              </div>
            ) : (
              <>
                {/* Steps indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Step {step} of 3</span>
                    <span className="text-gray-700">
                      {step === 1 ? 'Select Role' : step === 2 ? 'Personal Details' : 'Verify Identity'}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 transition-all duration-300"
                      style={{ width: `${getStepProgress()}%` }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* STEP 1: Select Role */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <h4 className="text-sm font-bold tracking-wide text-gray-800 font-display">
                        Choose your primary activity on the portal:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Shopkeeper */}
                        <div
                          onClick={() => setUserRole('shopkeeper')}
                          className={`bg-white/80 p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                            userRole === 'shopkeeper'
                              ? 'border-gray-900 bg-gray-900/[0.02] shadow-sm'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <Store className={`w-6 h-6 mb-3 ${userRole === 'shopkeeper' ? 'text-gray-900' : 'text-gray-400'}`} />
                          <h5 className="font-bold text-xs text-gray-900">Shopkeeper</h5>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            Need fast delivery for shop inventory or local distributors.
                          </p>
                        </div>

                        {/* Partner */}
                        <div
                          onClick={() => setUserRole('partner')}
                          className={`bg-white/80 p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                            userRole === 'partner'
                              ? 'border-gray-900 bg-gray-900/[0.02] shadow-sm'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <Compass className={`w-6 h-6 mb-3 ${userRole === 'partner' ? 'text-gray-900' : 'text-gray-400'}`} />
                          <h5 className="font-bold text-xs text-gray-900">Traveler</h5>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            Commute daily or travel between villages. Earn money on routes.
                          </p>
                        </div>

                        {/* Customer */}
                        <div
                          onClick={() => setUserRole('customer')}
                          className={`bg-white/80 p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                            userRole === 'customer'
                              ? 'border-gray-900 bg-gray-900/[0.02] shadow-sm'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <User className={`w-6 h-6 mb-3 ${userRole === 'customer' ? 'text-gray-900' : 'text-gray-400'}`} />
                          <h5 className="font-bold text-xs text-gray-900">Customer</h5>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            Awaiting a shipment or tracking orders from local sellers.
                          </p>
                        </div>

                        {/* Admin */}
                        <div
                          onClick={() => setUserRole('admin')}
                          className={`bg-white/80 p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                            userRole === 'admin'
                              ? 'border-gray-900 bg-gray-900/[0.02] shadow-sm'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <Shield className={`w-6 h-6 mb-3 ${userRole === 'admin' ? 'text-gray-900' : 'text-gray-400'}`} />
                          <h5 className="font-bold text-xs text-gray-900">Admin</h5>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            Manage route nodes, dispute override desks, and KYC directories.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setStep(2)}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-6 shadow-sm"
                      >
                        Continue Onboarding <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 2: Personal Details */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <h4 className="text-sm font-bold tracking-wide text-gray-800 font-display">
                        Provide personal profile & location metrics:
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="Ramesh Agrawal"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full bg-white rounded-xl border border-gray-200 py-3 px-4 text-xs text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                            Contact Phone
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 99887 76655"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            className="w-full bg-white rounded-xl border border-gray-200 py-3 px-4 text-xs text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
                          />
                        </div>

                        {userRole === 'shopkeeper' && (
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                              Shop or Distributor Name
                            </label>
                            <input
                              type="text"
                              placeholder="Vijay Kirana Store"
                              value={regShopName}
                              onChange={(e) => setRegShopName(e.target.value)}
                              className="w-full bg-white rounded-xl border border-gray-200 py-3 px-4 text-xs text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                            Primary Hub Town / Village
                          </label>
                          <input
                            type="text"
                            placeholder="Sonagir, Madhya Pradesh"
                            value={regLocation}
                            onChange={(e) => setRegLocation(e.target.value)}
                            className="w-full bg-white rounded-xl border border-gray-200 py-3 px-4 text-xs text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 py-3.5 border border-gray-200 hover:border-gray-400 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2 transition-all bg-white"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          onClick={() => setStep(3)}
                          disabled={!regName || !regPhone}
                          className="flex-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                        >
                          Identity Verification <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Identity Verification */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <h4 className="text-sm font-bold tracking-wide text-gray-800 font-display">
                        Verification upload simulation:
                      </h4>

                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-bold text-xs text-gray-900">Trust and Security Registry</h5>
                          <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                            Setu Hub utilizes cryptographic OTP checks and identity uploads. Undergo validation to prevent fraud on the route.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                            {userRole === 'partner' ? 'Driving License / Aadhaar Number' : 'Aadhaar / Business Reg ID'}
                          </label>
                          <input
                            type="text"
                            placeholder="DL-XXXXXXXXXXXX"
                            value={licenseNum}
                            onChange={(e) => setLicenseNum(e.target.value)}
                            className="w-full bg-white rounded-xl border border-gray-200 py-3 px-4 text-xs text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                            Document Photo Mock Upload
                          </label>
                          <div className="border border-dashed border-gray-200 hover:border-gray-400 rounded-xl p-5 text-center cursor-pointer transition-all bg-white">
                            <span className="text-[10px] text-gray-400 font-semibold">
                              Click to select file or drag file here
                            </span>
                            <span className="block text-[8px] text-gray-400/50 mt-1">
                              Max size: 5MB (PDF, PNG, JPG)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => setStep(2)}
                          className="flex-1 py-3.5 border border-gray-200 hover:border-gray-400 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2 transition-all bg-white"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          onClick={triggerRegister}
                          disabled={regStatus === 'loading' || !licenseNum}
                          className="flex-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                        >
                          {regStatus === 'loading' ? 'Submitting Details...' : 'Complete Registry'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
