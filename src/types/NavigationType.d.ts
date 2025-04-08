
import { NavigationProp, CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'; // 添加 Bottom Tab Navigator

// 定义路由参数类型
// type RootStackParamList = {
//     Home: undefined; // Home 页面不需要参数
//     Test: undefined; // Test 页面不需要参数
// };

// // 使用具体的导航器类型
// export type RootStackNavigationProps = NavigationProp<RootStackParamList>;


// 定义每个 Stack Navigator 的参数类型
export type HomeStackParamList = {
    Home: undefined;  // Home 页面无参数
};

export type TestStackParamList = {
    Test: undefined;  // Test 页面无参数
};

export type MyStackParamList = {
    My: undefined;
}

// 定义 Bottom Tab Navigator 的参数类型
export type RootTabParamList = {
    HomeTab: undefined;       // 对应 HomeStack
    TestTab: undefined;       // 对应 TestStack
    MyTab: undefined;
    // 如果需要深层导航，可以这样定义：
    // HomeTab: { screen: keyof HomeStackParamList };
    // TestTab: { screen: keyof TestStackParamList };
};

// 合并所有参数类型（用于全局导航）
export export type RootNavigationParamList = RootTabParamList & {
    HomeStack: NavigatorScreenParams<HomeStackParamList>;
    TestStack: NavigatorScreenParams<TestStackParamList>;
};

export type RootStackNavigationProps = NavigationProp<RootTabParamList>

