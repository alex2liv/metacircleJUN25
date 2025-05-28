import { useState, useEffect, createContext, useContext } from "react";

export interface CommunityTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  spacing: string;
}

export const predefinedThemes: CommunityTheme[] = [
  {
    id: "default",
    name: "MetaCircle Padrão",
    colors: {
      primary: "262 83% 58%", // #7c3aed
      secondary: "245 58% 51%", // #6366f1
      accent: "142 76% 36%", // #059669
      background: "210 11% 98%", // #F5F7FA
      surface: "0 0% 100%", // white
      text: "20 14.3% 4.1%", // dark gray
      textSecondary: "25 5.3% 44.7%", // medium gray
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    borderRadius: "0.5rem",
    spacing: "1rem",
  },
  {
    id: "church",
    name: "Igreja/Ministério",
    colors: {
      primary: "43 96% 56%", // golden
      secondary: "27 96% 61%", // orange
      accent: "142 76% 36%", // green
      background: "60 9% 98%", // warm white
      surface: "0 0% 100%",
      text: "20 14.3% 4.1%",
      textSecondary: "25 5.3% 44.7%",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Inter, system-ui, sans-serif",
    },
    borderRadius: "0.375rem",
    spacing: "1rem",
  },
  {
    id: "corporate",
    name: "Corporativo",
    colors: {
      primary: "221 83% 53%", // blue
      secondary: "210 40% 98%", // light blue
      accent: "142 76% 36%", // green
      background: "220 14% 96%", // light gray
      surface: "0 0% 100%",
      text: "220 13% 13%", // dark blue
      textSecondary: "220 9% 46%",
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    borderRadius: "0.25rem",
    spacing: "0.75rem",
  },
  {
    id: "education",
    name: "Educação",
    colors: {
      primary: "271 91% 65%", // purple
      secondary: "313 73% 65%", // pink
      accent: "172 66% 50%", // teal
      background: "270 20% 98%", // very light purple
      surface: "0 0% 100%",
      text: "271 36% 16%", // dark purple
      textSecondary: "271 18% 46%",
    },
    fonts: {
      heading: "Poppins, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    borderRadius: "0.75rem",
    spacing: "1.25rem",
  },
  {
    id: "creator",
    name: "Criador de Conteúdo",
    colors: {
      primary: "340 82% 52%", // pink/red
      secondary: "45 93% 58%", // yellow
      accent: "262 83% 58%", // purple
      background: "330 20% 98%", // very light pink
      surface: "0 0% 100%",
      text: "340 36% 16%", // dark pink
      textSecondary: "340 18% 46%",
    },
    fonts: {
      heading: "Montserrat, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    borderRadius: "1rem",
    spacing: "1.5rem",
  },
];

interface ThemeContextType {
  currentTheme: CommunityTheme;
  setTheme: (theme: CommunityTheme) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function useThemeProvider() {
  const [currentTheme, setCurrentTheme] = useState<CommunityTheme>(predefinedThemes[0]);
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--theme-${cssVar}`, value);
    });

    // Apply font variables
    root.style.setProperty('--font-heading', currentTheme.fonts.heading);
    root.style.setProperty('--font-body', currentTheme.fonts.body);
    
    // Apply other variables
    root.style.setProperty('--border-radius', currentTheme.borderRadius);
    root.style.setProperty('--spacing', currentTheme.spacing);

    // Update CSS custom properties for shadcn compatibility
    root.style.setProperty('--primary', currentTheme.colors.primary);
    root.style.setProperty('--secondary', currentTheme.colors.secondary);
    root.style.setProperty('--background', currentTheme.colors.background);
    root.style.setProperty('--foreground', currentTheme.colors.text);
    root.style.setProperty('--muted-foreground', currentTheme.colors.textSecondary);
  }, [currentTheme]);

  // Handle dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const setTheme = (theme: CommunityTheme) => {
    setCurrentTheme(theme);
    // Save to localStorage for persistence
    localStorage.setItem('metacircle-theme', JSON.stringify(theme));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('metacircle-dark-mode', JSON.stringify(newDarkMode));
  };

  // Load saved theme and dark mode on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('metacircle-theme');
    const savedDarkMode = localStorage.getItem('metacircle-dark-mode');
    
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setCurrentTheme(theme);
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
    
    if (savedDarkMode) {
      try {
        const darkModeValue = JSON.parse(savedDarkMode);
        setDarkMode(darkModeValue);
      } catch (error) {
        console.error('Failed to parse saved dark mode:', error);
      }
    }
  }, []);

  return {
    currentTheme,
    setTheme,
    darkMode,
    toggleDarkMode,
  };
}

export { ThemeContext };