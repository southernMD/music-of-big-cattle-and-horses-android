// src/navigation/tabs/homeTab.ts
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack'; // 假设你的 Stack 也已抽离
import { Icon } from '@ant-design/react-native';

export const homeTabOptions: BottomTabNavigationOptions = {
  tabBarLabel: '首页',
  tabBarIcon: ({ color, size }) => (
    <Icon name="home" size={size} color={color} />
  ),
};

export const homeTabConfig = {
  screen: HomeStack,
  options: homeTabOptions,
};