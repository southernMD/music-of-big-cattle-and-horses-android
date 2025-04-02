import { NativeModules } from 'react-native';
import Sound from 'react-native-sound';
let NativeModulesPlayMusicManager = NativeModules.PlayMusicManager;

// 后台播放音乐,使用原生模块播放本地音乐
async function backgroundPlayMusic(data: HeadlessTaskMusicPlayer) {
  try {
    
    console.log('backgroundPlayMusic task:', data);

    const {mp3FileName, playerStatus , playWay} = data.payload;
    if(playWay === 'native'){
      const res = await NativeModulesPlayMusicManager.control(mp3FileName, playerStatus);
      console.log('backgroundPlayMusic res:', res);
      return Promise.resolve();
    }else{
      // const url = await fetch('https://ncm.nekogan.com/song/url/v1?id=29777226&level=standard').then((res)=>res.json()).then((data)=>Promise.resolve(data.data[0].url.replace("http","https"))).catch(error=>{console.log(error)})
      // console.log(url,"号");
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
      return Promise.resolve();
    }
  } catch (error) {
    console.error('backgroundPlayMusic error', error);
    return Promise.reject();
  }
}

export {
  backgroundPlayMusic,
  NativeModulesPlayMusicManager,
};