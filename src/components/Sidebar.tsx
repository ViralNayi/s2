import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  PlusCircle,
  MapPin,
  History,
  Search,
  Navigation,
  DollarSign,
  PackageSearch,
  ClipboardCheck,
  BarChart3,
  Users,
  Globe,
  LogOut,
  User,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { RoleType } from '../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { userRole, setUserRole, setScreen, t } = useApp();

  const getMenuItems = (): MenuItem[] => {
    switch (userRole) {
      case 'shopkeeper':
        return [
          { id: 'overview', label: 'Console', icon: LayoutDashboard },
          { id: 'create', label: 'Dispatch', icon: PlusCircle },
          { id: 'track', label: 'Transit', icon: MapPin },
          { id: 'history', label: 'Ledger', icon: History },
        ];
      case 'partner':
        return [
          { id: 'available', label: 'Opportunities', icon: Search },
          { id: 'active', label: 'Telemetry', icon: Navigation },
          { id: 'earnings', label: 'Wallet', icon: DollarSign },
        ];
      case 'customer':
        return [
          { id: 'customer-create', label: 'Book Delivery', icon: PlusCircle },
          { id: 'customer-track', label: 'Track Parcel', icon: PackageSearch },
          { id: 'customer-history', label: 'Handovers', icon: ClipboardCheck },
        ];
      case 'admin':
        return [
          { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'admin-users', label: 'KYC Directory', icon: Users },
          { id: 'admin-live', label: 'Live Map', icon: Globe },
          { id: 'admin-disputes', label: 'Overrides', icon: ShieldAlert },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const getRoleLabel = () => {
    switch (userRole) {
      case 'shopkeeper': return t('Merchant');
      case 'partner': return t('Traveler');
      case 'customer': return t('Customer');
      case 'admin': return t('Operator');
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl z-50 floating-hud p-2.5 px-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
      {/* Profile & Simulator Selector */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-mutedApp-bg border border-cardBorder flex items-center justify-center">
          <User className="w-4 h-4 text-primaryApp" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[8.5px] font-black font-mono text-primaryApp uppercase tracking-wider leading-none">
              {getRoleLabel()} {t('Node')}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          
          <select
            value={userRole}
            onChange={(e) => {
              const newRole = e.target.value as RoleType;
              setUserRole(newRole);
              setScreen('login');
            }}
            className="bg-transparent text-[11px] font-bold text-fgApp focus:outline-none cursor-pointer hover:text-primaryApp transition-colors pr-2"
          >
            <option value="shopkeeper">{t('Shopkeeper')} (Vijay)</option>
            <option value="partner">{t('Travel Partner')} (Vikram)</option>
            <option value="customer">{t('Customer')} (Ramesh)</option>
            <option value="admin">{t('Admin')} Core</option>
          </select>
        </div>
      </div>

      {/* Main Tabs Selection (Horizontal list) */}
      <nav className="flex items-center gap-1 md:gap-1.5 overflow-x-auto max-w-full no-scrollbar py-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10.5px] font-bold tracking-wide transition-all relative whitespace-nowrap ${
                isActive
                  ? 'text-primaryApp font-black'
                  : 'text-mutedApp hover:text-fgApp hover:bg-mutedApp-bg'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="hud-active"
                  className="absolute inset-0 bg-[rgba(var(--primary-rgb),0.1)] border border-[rgba(var(--primary-rgb),0.2)] rounded-xl z-0"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 z-10 shrink-0" />
              <span className="z-10">{t(item.label)}</span>
            </button>
          );
        })}
      </nav>

      {/* Exit Console Portal Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => setScreen('landing')}
          className="flex items-center gap-1 px-3 py-2 text-[10px] text-red-500 font-bold hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20"
        >
          <LogOut className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline">{t('Exit Console')}</span>
        </button>
      </div>
    </div>
  );
};
