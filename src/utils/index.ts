import { NativeModules } from 'react-native';

let PlayMusicManager = NativeModules.PlayMusicManager;

// 后台播放音乐
async function backgroundPlayMusic(data) {
  try {
    console.log('backgroundPlayMusic task:', data);

    const {mp3FileName, playerStatus} = data.payload;

    const res = await PlayMusicManager.control(mp3FileName, playerStatus);
    console.log('backgroundPlayMusic res:', res);

    return Promise.resolve();
    // const {taskId, taskKey} = data;

    // AppRegistry.cancelHeadlessTask(taskId, taskKey);
  } catch (error) {
    console.error('backgroundPlayMusic error', error);

    return Promise.reject();
  }
}

export {
  backgroundPlayMusic,
  PlayMusicManager,
};