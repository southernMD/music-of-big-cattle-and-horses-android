import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingHome } from "@/views/Setting/SettingHome";
import { CustomHeaderTitle } from "./SettingHeader";
import { Login } from "@/views/Setting/Login";
import { SettingStackParamList } from "@/types/NavigationType";
import { useTheme } from "@/hooks/useTheme";

const Stack = createNativeStackNavigator<SettingStackParamList>();

export const SettingStack = () => {

  const { box, typography } = useTheme();
  console.log(box);
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_bottom',
        animationDuration: 300, 
        headerStyle: {
          backgroundColor: box.background.deep, // 动态设置颜色
        },
        headerTintColor: typography.colors.large.default,
      }}
    >
      <Stack.Screen
        name="SettingHome"
        component={SettingHome}
        options={{
          headerTitle: () => <CustomHeaderTitle title="设置" />,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerTitle: () => <CustomHeaderTitle title="登录" />,
        }}
      />
    </Stack.Navigator>
  );
};
