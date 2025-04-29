// themes.ts
import { DefaultTheme, DarkTheme, type Theme } from '@react-navigation/native';

// ==================== 类型定义 ====================
type TypographySize = {
  large: number;
  medium: number;
  small: number;
  xsmall: number;
};

type TypographyColorStates = {
  default: string;
  active: string;
  disabled: string;
};

type TypographyColors = {
  large: TypographyColorStates;
  medium: TypographyColorStates;
  small: TypographyColorStates;
  xsmall: TypographyColorStates;
};

type BoxBackground = {
  shallow:string,
  middle:string,
  deep:string
}; // 三种背景色从浅到深
type LineColors = {
  light: string;
  dark: string;
};
type ButtonStyles = {
  background: string;
  text: string;
  border?: string;
};
type OverlayColors = {
  light: string;
  dark: string;
};

export interface ExtendedTheme extends Theme{
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  typography: {
    sizes: TypographySize;
    colors: TypographyColors;
  };
  box: {
    background: BoxBackground;
  };
  boxReflect:{
    background: BoxBackground;
  }
  line: LineColors;
  interaction: {
    pressBackground: string;
  };
  borderRadius: {
    square: number;
    rounded: number;
  };
  overlay: OverlayColors;
  button: {
    solid: ButtonStyles;
    outline: ButtonStyles;
  };
}

// ==================== 共享常量 ====================
const typographySizes: TypographySize = {
  large: 20,    // 大字
  medium: 16,   // 普通字
  small: 14,    // 小字
  xsmall: 12,   // 小小字
};

const borderRadius = {
  square: 0,    // 方角
  rounded: 8,    // 圆角
};

// ==================== 浅色主题 ====================
export const Light: ExtendedTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgba(0, 122, 255, 1)',
    background: 'rgba(242, 242, 247, 1)',
    card: 'rgba(255, 255, 255, 1)',
    text: 'rgba(28, 28, 30, 1)',
    border: 'rgba(216, 216, 216, 1)',
    notification: 'rgba(255, 59, 48, 1)',
  },
  typography: {
    sizes: typographySizes,
    colors: {
      large: {
        default: 'rgba(28, 28, 30, 1)',        // 大字默认
        active: 'rgba(0, 0, 0, 1)',            // 大字激活
        disabled: 'rgba(60, 60, 67, 0.3)',     // 大字禁用
      },
      medium: {
        default: 'rgba(28, 28, 30, 1)',        // 普通字默认
        active: 'rgba(0, 0, 0, 1)',            // 普通字激活
        disabled: 'rgba(60, 60, 67, 0.3)',     // 普通字禁用
      },
      small: {
        default: 'rgba(60, 60, 67, 0.6)',      // 小字默认
        active: 'rgba(0, 0, 0, 1)',            // 小字激活
        disabled: 'rgba(60, 60, 67, 0.3)',     // 小字禁用
      },
      xsmall: {
        default: 'rgba(60, 60, 67, 0.4)',      // 小小字默认
        active: 'rgba(28, 28, 30, 1)',         // 小小字激活
        disabled: 'rgba(60, 60, 67, 0.3)',     // 小小字禁用
      },
    }
  },
  box: {
    background: {
      shallow:'rgba(255, 255, 255, 1)',
      middle:'rgba(242, 242, 247, 1)',
      deep:'rgba(225, 225, 225, 1)'
    }
  },
  boxReflect:{
    background:{
      shallow:'rgba(28, 28, 30, 0.1)',
      middle:'rgba(22, 22, 24, 0.1)',
      deep:'rgba(18, 18, 20, 0.1)'
    }
  },
  line: {
    light: 'rgba(216, 216, 216, 1)',  // 浅色线
    dark: 'rgba(180, 180, 180, 1)'     // 深色线
  },
  interaction: {
    pressBackground: 'rgba(0, 122, 255, 0.1)', // 长按背景色
  },
  borderRadius,
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',      // 浅蒙版
    dark: 'rgba(0, 0, 0, 0.6)'        // 深蒙版
  },
  button: {
    solid: {
      background: 'rgba(0, 122, 255, 1)',      // 实心按钮背景
      text: 'rgba(255, 255, 255, 1)'           // 实心按钮文字
    },
    outline: {
      background: 'rgba(0, 0, 0, 0)',          // 空心按钮背景
      border: 'rgba(0, 122, 255, 1)',          // 空心按钮边框
      text: 'rgba(0, 122, 255, 1)'             // 空心按钮文字
    }
  }
};

// ==================== 深色主题 ====================
export const Dark: ExtendedTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: 'rgba(10, 132, 255, 1)',
    background: 'rgba(18, 18, 20, 1)',
    card: 'rgba(28, 28, 30, 1)',
    text: 'rgba(229, 229, 234, 1)',
    border: 'rgba(56, 56, 58, 1)',
    notification: 'rgba(255, 69, 58, 1)',
  },
  typography: {
    sizes: typographySizes,
    colors: {
      large: {
        default: 'rgba(229, 229, 234, 1)',     // 大字默认
        active: 'rgba(255, 255, 255, 1)',      // 大字激活
        disabled: 'rgba(142, 142, 147, 0.3)',  // 大字禁用
      },
      medium: {
        default: 'rgba(229, 229, 234, 1)',     // 普通字默认
        active: 'rgba(255, 255, 255, 1)',      // 普通字激活
        disabled: 'rgba(142, 142, 147, 0.3)',  // 普通字禁用
      },
      small: {
        default: 'rgba(235, 235, 245, 0.8)',   // 小字默认
        active: 'rgba(255, 255, 255, 1)',      // 小字激活
        disabled: 'rgba(142, 142, 147, 0.3)',  // 小字禁用
      },
      xsmall: {
        default: 'rgba(235, 235, 245, 0.6)',   // 小小字默认
        active: 'rgba(209, 209, 214, 1)',      // 小小字激活
        disabled: 'rgba(142, 142, 147, 0.3)',  // 小小字禁用
      },
    }
  },
  box: {
    background: {
      shallow:'rgba(28, 28, 30, 1)',
      middle:'rgba(22, 22, 24, 1)',
      deep:'rgba(18, 18, 20, 1)'
    }
  },
  boxReflect:{
    background: {
      shallow:'rgba(255, 255, 255, 0.1)',
      middle:'rgba(242, 242, 247, 0.1)',
      deep:'rgba(225, 225, 225, 0.1)'
    }
  },
  line: {
    light: 'rgba(56, 56, 58, 1)',     // 浅色线
    dark: 'rgba(72, 72, 74, 1)'       // 深色线
  },
  interaction: {
    pressBackground: 'rgba(10, 132, 255, 0.2)', // 长按背景色
  },
  borderRadius,
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',      // 浅蒙版
    dark: 'rgba(0, 0, 0, 0.8)'        // 深蒙版
  },
  button: {
    solid: {
      background: 'rgba(10, 132, 255, 1)',     // 实心按钮背景
      text: 'rgba(255, 255, 255, 1)'           // 实心按钮文字
    },
    outline: {
      background: 'rgba(0, 0, 0, 0)',          // 空心按钮背景
      border: 'rgb(10, 132, 255)',          // 空心按钮边框
      text: 'rgba(10, 132, 255, 1)'             // 空心按钮文字
    }
  }
};