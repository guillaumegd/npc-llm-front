import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeType = 'medieval' | 'futuristic';

// Association des thèmes aux IDs de personnage
export const THEME_CHARACTER_MAP: Record<ThemeType, number> = {
  'medieval': 1,  // Alaric pour le thème médiéval
  'futuristic': 2 // Nexus pour le thème futuriste
};

interface ThemeContextType {
  currentTheme: ThemeType;
  toggleTheme: () => void;
  getCharacterId: () => number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('medieval');

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => prevTheme === 'medieval' ? 'futuristic' : 'medieval');
  };
  
  const getCharacterId = () => {
    return THEME_CHARACTER_MAP[currentTheme];
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, getCharacterId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};