import { SettingStackParamList } from "@/types/NavigationType";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingHome } from "@/views/Setting/SettingHome";
import { CustomHeaderTitle } from "./SettingHeader";
import { Easing } from "react-native";
import { Login } from "@/views/Setting/Login";
// 
export const SettingStack = createNativeStackNavigator<SettingStackParamList>({
  screens: {
    SettingHome: {
      screen: SettingHome,
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
    Login:{
      screen: Login,
      options: {
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <CustomHeaderTitle title="登录" />,
      },
    }
  },
  screenOptions:{
    animation: 'slide_from_bottom',
    animationDuration: 300,
  }
});
