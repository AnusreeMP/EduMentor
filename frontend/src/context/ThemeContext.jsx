import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  // ✅ THIS WAS MISSING
  const toggleTheme = () => {
    setDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
