import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { MyStack } from './MyStack'; 
import { Icon } from '@ant-design/react-native';

export const myTabOptions: BottomTabNavigationOptions = {
  tabBarLabel: '我的',
  tabBarIcon: ({ color, size }) => (
    <Icon name="user" size={size} color={color} />
  ),
};

export const myTabConfig = {
  screen: MyStack,
  options: myTabOptions,
};