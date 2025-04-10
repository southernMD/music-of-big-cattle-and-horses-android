import { SettingStackParamList } from "@/types/NavigationType";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Setting } from "@/views/Setting";
import { CustomHeaderTitle } from "./SettingHeader";
import { Easing } from "react-native";
// 
export const SettingStack = createNativeStackNavigator<SettingStackParamList>({
  screens: {
    Setting: {
      screen: Setting,
      options: {
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <CustomHeaderTitle title="设置" />,
      },
    },
  },
  screenOptions:{
    animation: 'slide_from_right',
    animationDuration: 300,
  }
});
