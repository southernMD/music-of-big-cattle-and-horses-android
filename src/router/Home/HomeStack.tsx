import { HomeStackParamList } from "@/types/NavigationType";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeaderTitle } from "./HomeHeader";
import { Home } from "@/views/Home";

export const HomeStack = createNativeStackNavigator<HomeStackParamList>({
  screens: {
    Home: {
      screen: Home,
      options: {
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <CustomHeaderTitle title="首页" />,
      },
    },
  },
});