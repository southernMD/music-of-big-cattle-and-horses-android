
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

export type SettingStackParamList = {
    Setting: undefined;
}

export type LoginStackParamList = {
    Login: undefined;
}


// 定义 Bottom Tab Navigator 的参数类型
export type RootTabParamList = {
    HomeTab: NavigatorScreenParams<HomeStackParamList>; // 关联到 HomeStack
    TestTab: NavigatorScreenParams<TestStackParamList>; // 关联到 TestStack
    MyTab: NavigatorScreenParams<MyStackParamList>;
    // 如果需要深层导航，可以这样定义：
    // HomeTab: { screen: keyof HomeStackParamList };
    // TestTab: { screen: keyof TestStackParamList };
};
export type RootStackParamList = {
    Main: NavigatorScreenParams<RootTabParamList>; // 主界面是 Tab Navigator
    Setting: NavigatorScreenParams<SettingStackParamList>; // 设置页面的 Stack
    Login:NavigatorScreenParams<LoginStackParamList>
};

// 全局导航属性类型
export type RootStackNavigationProps = NavigationProp<RootStackParamList>;

// 各个屏幕的 Props 类型
export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;
export type TestScreenProps = NativeStackScreenProps<TestStackParamList, 'Test'>;
export type MyScreenProps = NativeStackScreenProps<MyStackParamList, 'My'>;
export type SettingScreenProps = NativeStackScreenProps<SettingStackParamList, 'Setting'>;

// 组合类型（用于嵌套导航中的屏幕）
export type TabScreenProps<T extends keyof RootTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
>;