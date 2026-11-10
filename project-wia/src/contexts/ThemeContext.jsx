import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  isLight: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('smaumu_theme');
      const initial = saved === 'light' ? 'light' : 'dark';
      setThemeState(initial);
      applyThemeClass(initial);
    } catch {
      applyThemeClass('dark');
    }
  }, []);

  const applyThemeClass = (nextTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (nextTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
      root.classList.add('dark');
    }
  };

  const setTheme = (nextTheme) => {
    setThemeState(nextTheme);
    applyThemeClass(nextTheme);
    try {
      localStorage.setItem('smaumu_theme', nextTheme);
    } catch {
      // Ignore storage errors in restricted environments
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLight: theme === 'light',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
