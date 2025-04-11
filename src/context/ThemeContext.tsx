import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeType = 'medieval' | 'futuristic';
export type LanguageType = 'en' | 'fr' | 'pt';

// Association of themes and languages to character IDs
export const CHARACTER_ID_MAP: Record<ThemeType, Record<LanguageType, number>> = {
  'medieval': {
    'en': 1,
    'fr': 3,
    'pt': 5
  },
  'futuristic': {
    'en': 2,
    'fr': 4,
    'pt': 6
  }
};

interface ThemeContextType {
  currentTheme: ThemeType;
  currentLanguage: LanguageType;
  toggleTheme: () => void;
  setLanguage: (lang: LanguageType) => void;
  getCharacterId: () => number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('medieval');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('en');

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => prevTheme === 'medieval' ? 'futuristic' : 'medieval');
  };
  
  const setLanguage = (lang: LanguageType) => {
    setCurrentLanguage(lang);
  };
  
  const getCharacterId = () => {
    return CHARACTER_ID_MAP[currentTheme][currentLanguage];
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      currentLanguage, 
      toggleTheme, 
      setLanguage, 
      getCharacterId 
    }}>
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