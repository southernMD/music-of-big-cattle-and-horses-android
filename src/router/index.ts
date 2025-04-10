import { RootStackParamList, RootTabParamList } from "@/types/NavigationType";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import { homeTabConfig } from "./Home/HomeTap";
import { testTabConfig } from "./Test/TestTap";
import { myTabConfig } from "./My/MyTap";
import { SettingStack, } from "./Setting/SettingStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStack } from "./Login/LoginStack";

const Tab = createBottomTabNavigator<RootTabParamList>({
  screenOptions: {
    tabBarActiveTintColor: '#f4511e', // 选中时的颜色
    tabBarInactiveTintColor: 'gray',  // 未选中时的颜色
    headerShown: false, // 隐藏 Tab 页的默认顶部栏（因为每个 Stack 有自己的头部）
    animation: 'fade', // 默认动画效果
  },
  screens: {
    HomeTab: homeTabConfig,
    TestTab: testTabConfig,
    MyTab: myTabConfig
  },
});
const RootStack = createNativeStackNavigator<RootStackParamList>({
  initialRouteName: 'Main',
  screens: {
    Main: {
      screen: Tab,
    },
    Setting: SettingStack,
    Login: LoginStack,
  },
  screenOptions: {
    headerShown: false, // 隐藏 Tab 页的默认顶部栏（因为每个 Stack 有自己的头部）
    gestureDirection: 'horizontal',
  },
});
export const Navigation = createStaticNavigation(RootStack);