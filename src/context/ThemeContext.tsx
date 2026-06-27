import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType =
  | 'midnight'
  | 'ocean'
  | 'aurora'
  | 'emerald'
  | 'sunset'
  | 'light'
  | 'cyber'
  | 'royal'
  | 'matrix';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  registerLogoClick: () => void;
  logoClicks: number;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('setuhub-theme');
    return (saved as ThemeType) || 'light';
  });
  const [logoClicks, setLogoClicks] = useState(0);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('setuhub-theme', newTheme);
  };

  const registerLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5 && theme !== 'matrix') {
        setTheme('matrix');
        return 0; // reset
      }
      return next;
    });
  };

  // Effect to apply the theme class to body/html
  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    const themeClasses = [
      'theme-midnight',
      'theme-ocean',
      'theme-aurora',
      'theme-emerald',
      'theme-sunset',
      'theme-light',
      'theme-cyber',
      'theme-royal',
      'theme-matrix',
    ];
    themeClasses.forEach((cls) => root.classList.remove(cls));

    // Add active theme class
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, registerLogoClick, logoClicks }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
