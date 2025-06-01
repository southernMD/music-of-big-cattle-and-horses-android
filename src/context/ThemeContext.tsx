/*
 * @Description: create by southernMD
 */
import React, { createContext, useContext } from 'react';
import { Dark, Light, ExtendedTheme } from '@/utils/theme';
import { usePersistentStore } from '@/hooks/usePersistentStore';

// 创建主题上下文
const ThemeContext = createContext<ExtendedTheme>(Light);

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const primaryColor = usePersistentStore<string>('primaryColor', 'rgba(102, 204, 255,1)');
  const isDark = usePersistentStore<boolean>('isDark', false);
  
  const theme = React.useMemo(() => {
    const base = isDark ? Dark : Light;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: primaryColor,
      },
      button: {
        solid: {
          ...base.button.solid,
          background: primaryColor,
        },
        outline: {
          ...base.button.outline,
          border: primaryColor,
          text: primaryColor
        }
      }
    };
  }, [isDark, primaryColor]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义钩子
export const useAppTheme = () => useContext(ThemeContext);