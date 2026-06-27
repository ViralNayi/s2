import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setScreen, setUserRole, t } = useApp();

  return (
    <nav className="animate-fade-down relative z-20 flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 sm:py-5">
      {/* Logo Left */}
      <div 
        onClick={() => setScreen('landing')}
        className="flex items-center gap-2 text-gray-900 cursor-pointer"
      >
        <Logo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
        <span className="font-semibold text-lg tracking-tight select-none">{t('SetuHub')}</span>
      </div>

      {/* Desktop Nav Links (Hidden on mobile/tablet) */}
      <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-700">
        <button 
          onClick={() => setScreen('whatsapp')}
          className="hover:text-gray-900 cursor-pointer transition-colors py-1 focus:outline-none"
        >
          {t('WhatsApp Connect')}
        </button>
        <button 
          onClick={() => setScreen('tracking')}
          className="hover:text-gray-900 cursor-pointer transition-colors py-1 focus:outline-none"
        >
          {t('Track Shipment')}
        </button>
        <div className="group relative flex items-center gap-1 hover:text-gray-900 cursor-pointer transition-colors py-1">
          <span>{t('Consensus Portals')}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-colors" />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-xl ring-1 ring-black/5 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col z-30">
            <button
              onClick={() => {
                setUserRole('shopkeeper');
                setScreen('login');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {t('Shopkeeper Console')}
            </button>
            <button
              onClick={() => {
                setUserRole('partner');
                setScreen('login');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {t('Travel Partner')}
            </button>
            <button
              onClick={() => {
                setUserRole('customer');
                setScreen('login');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {t('Customer Portal')}
            </button>
            <div className="h-px bg-gray-100 my-1" />
            <button
              onClick={() => {
                setUserRole('admin');
                setScreen('login');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              {t('Admin Dashboard')}
            </button>
          </div>
        </div>
      </div>

      {/* CTA Button + Hamburger Right */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => {
            setUserRole('shopkeeper');
            setScreen('login');
          }}
          className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          {t('Get Started')}
        </button>
        
        {/* Hamburger Menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-9 h-9 rounded-full text-gray-900 hover:bg-gray-900/10 flex items-center justify-center transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl bg-white/95 backdrop-blur-xl ring-1 ring-gray-200 px-5 py-3 animate-fade-up z-30 shadow-xl flex flex-col gap-1">
          <button
            onClick={() => {
              setScreen('whatsapp');
              setIsOpen(false);
            }}
            className="text-left text-[15px] font-medium text-gray-700 hover:text-gray-900 border-b border-gray-100 py-3 cursor-pointer transition-colors"
          >
            {t('WhatsApp Connect')}
          </button>
          <button
            onClick={() => {
              setScreen('tracking');
              setIsOpen(false);
            }}
            className="text-left text-[15px] font-medium text-gray-700 hover:text-gray-900 border-b border-gray-100 py-3 cursor-pointer transition-colors"
          >
            {t('Track Shipment')}
          </button>
          
          <div className="flex flex-col py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">{t('Stakeholder Portals')}</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setUserRole('shopkeeper');
                  setScreen('login');
                  setIsOpen(false);
                }}
                className="bg-gray-50 border border-gray-200 hover:border-gray-900 hover:bg-gray-100 rounded-xl p-2.5 text-xs font-semibold text-gray-800 transition-all text-left"
              >
                {t('Shopkeeper')}
              </button>
              <button
                onClick={() => {
                  setUserRole('partner');
                  setScreen('login');
                  setIsOpen(false);
                }}
                className="bg-gray-50 border border-gray-200 hover:border-gray-900 hover:bg-gray-100 rounded-xl p-2.5 text-xs font-semibold text-gray-800 transition-all text-left"
              >
                {t('Travel Partner')}
              </button>
              <button
                onClick={() => {
                  setUserRole('customer');
                  setScreen('login');
                  setIsOpen(false);
                }}
                className="bg-gray-50 border border-gray-200 hover:border-gray-900 hover:bg-gray-100 rounded-xl p-2.5 text-xs font-semibold text-gray-800 transition-all text-left"
              >
                {t('Customer Portal')}
              </button>
              <button
                onClick={() => {
                  setUserRole('admin');
                  setScreen('login');
                  setIsOpen(false);
                }}
                className="bg-gray-50 border border-gray-200 hover:border-gray-900 hover:bg-gray-100 rounded-xl p-2.5 text-xs font-semibold text-gray-800 transition-all text-left"
              >
                {t('Admin Control')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
