/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { createStaticNavigation, NavigationProp, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import { backgroundPlayMusic } from '@/utils/NativeMusicPlayer';
import { Home } from '@/views/Home';
import { Test } from '@/views/Test';
import { Icon, Input } from '@ant-design/react-native';
if (__DEV__) {
  require("./ReactotronConfig")
}
AppRegistry.registerHeadlessTask('backgroundPlayMusic', () => backgroundPlayMusic);

const CustomHeaderTitle = ({ title }: { title: string }) => {
  return (
    <View style={styles.container}>
      <Icon name="home" size={20} color="#fff" />
      <Text style={styles.title}>{title}</Text>
      <Input style={styles.input}></Input>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  input:{
    width:"50%",
    backgroundColor:"#fff",
  }
});


const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    animation: 'fade', // 默认动画效果
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
  screens: {
    Home: {
      screen: Home,
      options: {
        headerTitle: () => <CustomHeaderTitle title="首页" />, // 使用自定义标题组件
      },
    },
    Test:{
      screen: Test,
      options: {
        headerTitle: () => <CustomHeaderTitle title="测试" />, // 使用自定义标题组件
        headerBackVisible:false
      },
    }
  },
});

const Navigation = createStaticNavigation(RootStack);

function App(): React.JSX.Element {

  return (
    // <StrictMode >
    <Navigation />
    // </StrictMode>
  );
}


export default App;