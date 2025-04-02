
import { NavigationProp } from '@react-navigation/native';

// 定义路由参数类型
type RootStackParamList = {
    Home: undefined; // Home 页面不需要参数
    Test: undefined; // Test 页面不需要参数
};
  
// 使用具体的导航器类型
export type RootStackNavigationProps = NavigationProp<RootStackParamList>;