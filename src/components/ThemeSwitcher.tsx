import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Lock, HelpCircle, Eye, Sliders, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeType } from '../context/ThemeContext';

interface ThemeOption {
  id: ThemeType;
  name: string;
  colors: string[];
  desc: string;
  accentHex: string;
  bgHex: string;
  hidden?: boolean;
}

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, logoClicks } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const persistentThemeRef = useRef<ThemeType>(theme);

  // Sync ref whenever a theme is clicked/applied permanently
  const applyThemePermanently = (tId: ThemeType) => {
    persistentThemeRef.current = tId;
    setTheme(tId);
  };

  const themes: ThemeOption[] = [
    {
      id: 'midnight',
      name: 'Midnight Black',
      colors: ['#050507', '#00D4FF'],
      accentHex: '#00D4FF',
      bgHex: '#050507',
      desc: 'Sleek luxury dark SaaS console',
    },
    {
      id: 'ocean',
      name: 'Ocean Breeze',
      colors: ['#010c16', '#06B6D4', '#34D399'],
      accentHex: '#06B6D4',
      bgHex: '#010c16',
      desc: 'Deep marine gradients and aqua waves',
    },
    {
      id: 'aurora',
      name: 'Aurora AI',
      colors: ['#060212', '#C084FC', '#F472B6'],
      accentHex: '#C084FC',
      bgHex: '#060212',
      desc: 'Futuristic AI cosmic glow',
    },
    {
      id: 'emerald',
      name: 'Emerald Pro',
      colors: ['#010f08', '#10B981', '#14B8A6'],
      accentHex: '#10B981',
      bgHex: '#010f08',
      desc: 'Rich green enterprise fleet terminal',
    },
    {
      id: 'sunset',
      name: 'Sunset Neon',
      colors: ['#0f020c', '#F97316', '#EC4899'],
      accentHex: '#F97316',
      bgHex: '#0f020c',
      desc: 'Plum matrix and high-contrast orange',
    },
    {
      id: 'light',
      name: 'Pure Light',
      colors: ['#F4F4F5', '#18181B', '#71717A'],
      accentHex: '#18181B',
      bgHex: '#F4F4F5',
      desc: 'Minimalist Apple-grade lighting',
    },
    {
      id: 'cyber',
      name: 'Cyber Terminal',
      colors: ['#000000', '#22C55E'],
      accentHex: '#22C55E',
      bgHex: '#000000',
      desc: 'Retro hacker matrix phosphor scan',
    },
    {
      id: 'royal',
      name: 'Royal Gold',
      colors: ['#050403', '#D4AF37', '#F59E0B'],
      accentHex: '#D4AF37',
      bgHex: '#050403',
      desc: 'Luxury black and premium gold accents',
    },
    {
      id: 'matrix',
      name: 'Route Matrix',
      colors: ['#02040a', '#00F2FE', '#4FACFE'],
      accentHex: '#00F2FE',
      bgHex: '#02040a',
      desc: '★ Custom Signature Transportation Overlay',
      hidden: true,
    },
  ];

  const handleMouseEnter = () => {
    persistentThemeRef.current = theme; // cache current selection
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    // Revert to original persistent choice if they hovered off without clicking
    if (theme !== persistentThemeRef.current) {
      setTheme(persistentThemeRef.current);
    }
  };

  const handleHoverTheme = (tId: ThemeType) => {
    // Only switch preview if it is unlocked or visible
    if (tId === 'matrix' && !isMatrixUnlocked) return;
    setTheme(tId);
  };

  const isMatrixUnlocked = localStorage.getItem('setuhub-theme') === 'matrix' || theme === 'matrix';

  return (
    <div
      className="fixed top-6 right-6 z-50 font-sans"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        layoutId="theme-trigger"
        className="glass-panel p-3.5 rounded-full hover:border-primaryApp transition-colors duration-300 flex items-center justify-center text-fgApp hover:text-primaryApp relative shadow-2xl"
        style={{ cursor: 'pointer' }}
      >
        <Palette className="w-5 h-5 text-primaryApp animate-pulse" />
        {logoClicks > 0 && logoClicks < 5 && (
          <span className="absolute -top-1 -right-1 bg-primaryApp text-bgApp font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
            {5 - logoClicks}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-[360px] glass-panel p-6 rounded-3xl shadow-2xl origin-top-right border border-cardBorder select-none"
          >
            <div className="flex items-center justify-between border-b border-cardBorder pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-primaryApp" />
                <h4 className="font-extrabold text-sm tracking-wider uppercase text-fgApp font-display">Customization Lab</h4>
              </div>
              <span className="text-[9px] font-bold text-primaryApp bg-primaryApp/10 border border-primaryApp/25 px-2.5 py-1 rounded-full uppercase">
                V2 Engine Active
              </span>
            </div>

            {/* Config details grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 bg-bgApp/50 p-2.5 rounded-xl border border-cardBorder text-[10px] font-mono">
              <div>
                <span className="text-mutedApp">ACCENT HEX:</span>
                <span className="block font-bold text-primaryApp">
                  {themes.find((t) => t.id === theme)?.accentHex || '#00D4FF'}
                </span>
              </div>
              <div>
                <span className="text-mutedApp">BG MATRIX:</span>
                <span className="block font-bold">
                  {themes.find((t) => t.id === theme)?.bgHex || '#050507'}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-mutedApp mb-3 flex items-center gap-1.5 font-semibold">
              <Eye className="w-3.5 h-3.5 text-primaryApp" /> Glide mouse to preview theme:
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {themes.map((t) => {
                if (t.hidden && !isMatrixUnlocked) {
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-dashed border-cardBorder/40 bg-cardBg/10 opacity-60 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="w-3.5 h-3.5 text-mutedApp" />
                        <div>
                          <div className="font-medium text-mutedApp/80">Signature Node Matrix</div>
                          <div className="text-[9px] text-mutedApp/50">Click SETU HUB logo 5x to unlock</div>
                        </div>
                      </div>
                      <HelpCircle className="w-3.5 h-3.5 text-mutedApp/30" />
                    </div>
                  );
                }

                const isActive = theme === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => applyThemePermanently(t.id)}
                    onMouseEnter={() => handleHoverTheme(t.id)}
                    className={`w-full flex items-start text-left gap-3.5 p-3 rounded-xl transition-all duration-300 border ${
                      isActive
                        ? 'border-primaryApp bg-primaryApp/5 shadow-glowSoft scale-[1.01]'
                        : 'border-transparent hover:border-cardBorder hover:bg-cardBg/30'
                    }`}
                  >
                    {/* Theme Swatch */}
                    <div className="flex -space-x-1.5 mt-1 shrink-0">
                      {t.colors.map((c, i) => (
                        <div
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-bgApp shadow"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isActive ? 'text-primaryApp' : 'text-fgApp'}`}>
                          {t.name}
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-primaryApp shrink-0" />}
                      </div>
                      <p className="text-[10px] text-mutedApp line-clamp-1 mt-0.5">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {theme === 'matrix' && (
              <div className="mt-4 pt-3.5 border-t border-cardBorder text-center flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-primaryApp animate-spin-slow" />
                <span className="text-[9px] font-bold text-primaryApp tracking-widest uppercase animate-pulse">
                  SYSTEM OVERRIDE: MATRIX LOGISTICS ACTIVE
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
