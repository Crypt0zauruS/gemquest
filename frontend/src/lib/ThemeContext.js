// lib/ThemeContext.js
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, difficulty, setDifficulty }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
