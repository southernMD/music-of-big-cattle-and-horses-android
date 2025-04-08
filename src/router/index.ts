import { RootTabParamList } from "@/types/NavigationType";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import { homeTabConfig } from "./Home/HomeTap";
import { testTabConfig } from "./Test/TestTap";
import { myTabConfig } from "./My/MyTap";

// 2. 创建 Bottom Tab Navigator
const Tab = createBottomTabNavigator<RootTabParamList>({
    initialRouteName: 'HomeTab',
    screenOptions: {
      tabBarActiveTintColor: '#f4511e', // 选中时的颜色
      tabBarInactiveTintColor: 'gray',  // 未选中时的颜色
      headerShown: false, // 隐藏 Tab 页的默认顶部栏（因为每个 Stack 有自己的头部）
      animation: 'fade', // 默认动画效果
    },
    screens: {
      HomeTab:homeTabConfig,
      TestTab:testTabConfig,
      MyTab:myTabConfig
    },
});
  
  // 3. 使用 createStaticNavigation 包装 Tab Navigator
export const Navigation = createStaticNavigation(Tab);