/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { StrictMode, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, ImageBackground, Alert, View  } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Icon } from '@ant-design/react-native';
import { NativeEventEmitter, NativeModules, AppRegistry } from 'react-native';
import { PlayMusicManager } from './src/utils';
if (__DEV__) {
  require("./ReactotronConfig")
}

function Section(): React.JSX.Element {
  const [headlessTaskId, setHeadlessTaskId] = useState(0);
  fetch('https://v1.hitokoto.cn/?c=f&encode=text').then((res)=>res.text()).then((data)=>{console.log(data)})

  const handleBackgroundPlayMusic = async type => {
    try {
      const taskId = Math.ceil(Math.random() * 10000000);
      const taskKey = 'backgroundPlayMusic';
      let mp3FileName = 'music'; // amaji.mp3
    
      if (type === 'play') {
        console.log('play');
        if (!headlessTaskId) {
          console.log('开始后台任务', taskId, type);
          AppRegistry.startHeadlessTask(taskId, taskKey, {
            taskId,
            taskKey,
            payload: {
              mp3FileName,
              playerStatus: 'play',
              taskId,
            },
          });
          setHeadlessTaskId(taskId);
        } else {
          console.log('继续播放');
          let res = await PlayMusicManager.control(mp3FileName, 'play');
          console.log(res);
        }
      } else {
        if (type === 'pause') {
          await PlayMusicManager.control(mp3FileName, 'pause');
        } else {
          await PlayMusicManager.control(mp3FileName, 'release');
          console.log('结束后台任务', headlessTaskId);
          AppRegistry.cancelHeadlessTask(headlessTaskId, taskKey);
          setHeadlessTaskId(0);
        }
      }
    } catch (error) {
      console.error('backgroundPlayMusicTask error', error);
    }
  }
  return (
    <ImageBackground source={{uri: 'img'}} style={styles.background} resizeMode='cover'>
      <View style={styles.mainBox}>
        <View style={styles.boxSize}>
            <Text style={[styles.text,styles.container]} >大牛马音乐</Text>
            <Button onPress={()=>handleBackgroundPlayMusic('play')} type="warning" loading><Icon name="right" /></Button>
        </View>
      </View>
    </ImageBackground>
  );
}
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: Section,
  },
});

const Navigation = createStaticNavigation(RootStack);
function App(): React.JSX.Element {
  return (
    <StrictMode >
      <Navigation />
    </StrictMode>
  );
}

const styles = StyleSheet.create({
  background:{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    height:20
  },
  mainBox:{
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  boxSize:{
    width:100,
    height:80
  }
});

export default App;