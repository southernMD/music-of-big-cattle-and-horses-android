// src/navigation/tabs/homeTab.ts
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { TestStack } from './TestStack'; // 假设你的 Stack 也已抽离
import { Icon } from '@ant-design/react-native';
import { Pressable, Text } from 'react-native';
import { TabBarButton } from './TestBottom';

export const testTabOptions: BottomTabNavigationOptions = {
  tabBarLabel: '首页',
  tabBarIcon: ({ color, size }) => (
    <Icon name="home" size={size} color={color} />
  ),
    // tabBarButton:()=>{
    //     return <TabBarButton/>
    // }
};

export const testTabConfig = {
  screen: TestStack,
  options: testTabOptions,
};