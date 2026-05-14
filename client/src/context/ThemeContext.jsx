import { createContext, useEffect, useState } from 'react';
export const ThemeContext = createContext(null);
export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => localStorage.theme === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.theme = dark ? 'dark' : 'light';
  }, [dark]);
  return <ThemeContext.Provider value={{ dark, setDark }}>{children}</ThemeContext.Provider>;
};
