import { TestStackParamList } from "@/types/NavigationType";
import { Test } from "@/views/Test";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeaderTitle } from "./TestHeader";

export const TestStack = createNativeStackNavigator<TestStackParamList>({
  screens: {
    Test: {
      screen: Test,
      options: {
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <CustomHeaderTitle title="测试" />,
        headerBackVisible: false
      },
    },
  },
});