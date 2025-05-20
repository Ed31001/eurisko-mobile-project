import { create } from 'zustand';
import ThemeStyles from '../styles/ThemeStyles';

type ThemeState = {
  isDarkMode: boolean;
  theme: typeof ThemeStyles.light;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: false,
  theme: ThemeStyles.light,
  toggleTheme: () => {
    const isDark = !get().isDarkMode;
    set({
      isDarkMode: isDark,
      theme: isDark ? ThemeStyles.dark : ThemeStyles.light,
    });
  },
}));
