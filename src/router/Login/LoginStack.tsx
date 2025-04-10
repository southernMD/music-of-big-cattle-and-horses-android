import { LoginStackParamList } from "@/types/NavigationType";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "@/views/Login";
import { CustomHeaderTitle } from "./LoginHeader";
// 
export const LoginStack = createNativeStackNavigator<LoginStackParamList>({
  screens: {
    Login: {
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
    },
  },
  screenOptions:{
    animation: 'slide_from_right',
    animationDuration: 300,
  }
});
