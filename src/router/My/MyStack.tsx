import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { My } from "@/views/My";
import { MyStackParamList } from "@/types/NavigationType";
import { CustomHeaderTitle } from "./MyHeader";
import { useTheme } from "@/hooks/useTheme";

const Stack = createNativeStackNavigator<MyStackParamList>();

export const MyStack = () => {
  const { box } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="My"
        component={My}
        options={{
          headerStyle: {
            backgroundColor: box.background.deep,
          },
          headerTransparent: true,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: () => <CustomHeaderTitle title="我的" />,
        }}
      />
    </Stack.Navigator>
  );
};
