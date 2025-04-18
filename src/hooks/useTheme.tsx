import { useTheme as useNavigationTheme } from '@react-navigation/native';
import type { ExtendedTheme } from '@/utils/theme';

export const useTheme = () => useNavigationTheme() as ExtendedTheme;
