import React, { StrictMode, useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, ImageBackground, Alert, View, KeyboardAvoidingView } from 'react-native';
import { createStaticNavigation, NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { Button, Icon } from '@ant-design/react-native';
import { NativeEventEmitter, NativeModules, AppRegistry } from 'react-native';
import { NativeModulesPlayMusicManager, backgroundPlayMusic } from '@/backgroundTasks/NativeMusicPlayer';
import Sound from 'react-native-sound';
import type { RootStackNavigationProps } from '@/types/NavigationType'
export const Home: React.FC = () => {
  const [headlessTaskId, setHeadlessTaskId] = useState(0);
  // fetch('https://international.v1.hitokoto.cn').then((res) => res.json()).then((data) => { console.log(data) })

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
              playWay: 'native'
            },
          } as HeadlessTaskMusicPlayer);
          setHeadlessTaskId(taskId);
        } else {
          console.log('继续播放');
          let res = await NativeModulesPlayMusicManager.control(mp3FileName, 'play');
          console.log(res);
        }
      } else {
        if (type === 'pause') {
          await NativeModulesPlayMusicManager.control(mp3FileName, 'pause');
        } else {
          await NativeModulesPlayMusicManager.control(mp3FileName, 'release');
          console.log('结束后台任务', headlessTaskId);
          AppRegistry.cancelHeadlessTask(headlessTaskId, taskKey);
          setHeadlessTaskId(0);
        }
      }
    } catch (error) {
      console.error('backgroundPlayMusicTask error', error);
    }
  }
  const handleOnlinePlayMusic = async type => {
    const taskId = Math.ceil(Math.random() * 10000000);
    const taskKey = 'backgroundPlayMusic';
    AppRegistry.startHeadlessTask(taskId, taskKey, {
      taskId,
      taskKey,
      payload: {
        mp3FileName:'',
        playerStatus: 'play',
        taskId,
        playWay:'online'
      },
    } as HeadlessTaskMusicPlayer)
    // const url = await fetch('https://ncm.nekogan.com/song/url/v1?id=29777226&level=standard').then((res) => res.json()).then((data) => Promise.resolve(data.data[0].url.replace("http", "https"))).catch(error => { console.log(error) })
    // console.log(url, "号");
    // // const res = await fetch('https://international.v1.hitokoto.cn').then((res)=>res.json()).then((data)=>{console.log(data)})
    // const sound = new Sound(url, undefined, (error) => {
    //   if (error) {
    //     console.error('Failed to load the sound', error);
    //     return;
    //   }

    //   // 获取音乐总时长
    //   const duration = sound.getDuration();
    //   console.log('音乐总时长:', duration, '秒');

    //   // 播放音乐
    //   sound.play((success) => {
    //     if (success) {
    //       console.log('Sound played successfully');
    //     } else {
    //       console.log('Sound playback failed');
    //     }
    //   });

    //   // 设置定时器，定期打印当前播放进度
    //   const interval = setInterval(() => {
    //     sound.getCurrentTime((currentTime) => {
    //       console.log('当前播放进度:', currentTime, '秒');
    //     });
    //   }, 1000); // 每1秒打印一次

    //   // 在音乐播放结束时清除定时器
    //   sound.setNumberOfLoops(0); // 设置播放次数为0，即播放一次
    // });
  }

  const navigation = useNavigation<RootStackNavigationProps>();
  return (
    <ImageBackground source={{ uri: 'img' }} style={styles.background} resizeMode='cover'>
      <View style={styles.mainBox}>
        <View style={styles.boxSize}>
          <View style={{ height: 40 }}>
            <Text style={[styles.text, styles.container]} onPress={() => handleOnlinePlayMusic('play')}>大牛马音乐</Text>
          </View>
          <Button style={styles.buttonStyle} onPress={() => handleBackgroundPlayMusic('play')} type="warning">
            <Text>使用原生模块播放音乐</Text>
          </Button>
          <Button style={styles.buttonStyle} onPress={() => handleOnlinePlayMusic('play')}>
            <Text>使用web播放音乐</Text>
          </Button>
          <Button style={styles.buttonStyle} onPress={() => navigation.navigate("Main")}>
            <Text>去Test页面</Text>
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  background: {
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
    height: 20
  },
  mainBox: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  boxSize: {
    width: "auto",
    height: "auto"
  },
  buttonStyle: {
    width: 200
  }
});