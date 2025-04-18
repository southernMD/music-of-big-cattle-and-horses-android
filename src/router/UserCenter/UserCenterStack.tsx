import { UserCenterStackParamList } from "@/types/NavigationType";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserCenterHome } from "@/views/UserCenter/UserCenterHome";
import { CustomHeaderTitle } from "./UserCenterHeader";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { subscribeKey } from "valtio/utils";
import { useUserCenter } from "@/store";

const DynamicHeaderBackground = () => {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // 直接订阅scrollY变化而不触发重新渲染
    const unsubscribe = subscribeKey(useUserCenter, 'scrollY', (value) => {
      console.log('scrollY changed:', value);
      const newOpacity = Math.min(Math.max(value / 80, 0), 1);
      setOpacity(newOpacity)
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={{
      flex: 1,
      backgroundColor: `rgba(28, 28, 30,${opacity})`
    }} />
  );
};

export const UserCenterStack = createNativeStackNavigator<UserCenterStackParamList>({
  screens: {
    UserCenterHome: {
      screen: UserCenterHome,
      options: {
        headerTransparent: true,
        headerBackground: () => <DynamicHeaderBackground />,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <CustomHeaderTitle title="个人中心" />,
      },
    },
  },
  screenOptions: {
    animation: 'slide_from_right',
    animationDuration: 300,
  }
});
