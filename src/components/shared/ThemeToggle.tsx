import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'icon' | 'minimal';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', variant = 'default' }) => {
  const { theme, toggleTheme } = useTheme();
  
  // Icon-only version
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-darkBg-lighter ${className}`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="h-5 w-5 text-gray-300 dark:text-gray-200" />
        )}
      </button>
    );
  }
  
  // Minimal version (just icon with better accessibility)
  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-darkBg-lighter transition-colors ${className}`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Sun className="h-5 w-5 text-amber-400" />
        )}
      </button>
    );
  }
  
  // Default version with text and icon
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-darkBg hover:bg-gray-200 dark:hover:bg-darkBg-lighter transition-colors ${className}`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4" />
          <span className="text-sm font-medium">Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span className="text-sm font-medium">Light Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
