import {  MyStackParamList } from "@/types/NavigationType";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeaderTitle } from "./MyHeader";
import { My } from "@/views/My";

export const MyStack = createNativeStackNavigator<MyStackParamList>({
  screens: {
    My: {
      screen: My,
      options: {
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTransparent:true,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <CustomHeaderTitle title="我的" />,
      },
    },
  },
});