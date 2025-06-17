import TrackPlayer, { AppKilledPlaybackBehavior, Capability, Event, State } from 'react-native-track-player';
import { useMusicPlayer } from '@/store';

// 导入图标资源
import playIcon from '@/assets/imgs/ic_play.png';
import pauseIcon from '@/assets/imgs/ic_pause.png';
import previousIcon from '@/assets/imgs/ic_prev.png';
import nextIcon from '@/assets/imgs/ic_next.png';
import notificationIcon from '@/assets/imgs/icon.png';

import { TinyEmitter } from 'tiny-emitter';

export const PlayerEmitter = new TinyEmitter();
// 定义播放服务
export async function setupPlayer() {
  try {
    if (await TrackPlayer.isServiceRunning()) return
    await TrackPlayer.setupPlayer({
      // 可选配置
      maxCacheSize: 1024 * 5, // 5mb
    });

    // 配置播放器
    await TrackPlayer.updateOptions({
      // 使用 Capability 枚举而不是字符串
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      // 使用导入的图标
      playIcon: playIcon,
      pauseIcon: pauseIcon,
      previousIcon: previousIcon,
      nextIcon: nextIcon,
      icon: notificationIcon
    });

    console.log('播放器已初始化');
    return true;
  } catch (error) {
    console.error('播放器初始化失败:', error);
    return false;
  }
}

// 定义事件处理函数
TrackPlayer.addEventListener(Event.RemotePlay, () => {
  console.log('用户点击了播放');
  TrackPlayer.play();
});

TrackPlayer.addEventListener(Event.RemotePause, () => {
  console.log('用户点击了暂停');
  TrackPlayer.pause();
});

TrackPlayer.addEventListener(Event.RemoteNext, async () => {
  console.log('用户点击了下一曲');
  PlayerEmitter.emit('next');
  // await TrackPlayer.skipToNext();
});

TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
  console.log('用户点击了上一曲');
  PlayerEmitter.emit('prev');
  // await TrackPlayer.skipToPrevious();
});

TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async (event) => {
  console.log("触发改变事件", event.lastTrack?.id, event.track?.id, useMusicPlayer.playingId);

  if (event.lastTrack) {
    await TrackPlayer.pause()
    useMusicPlayer.playStatus = 'stop';
    console.log("赋值了啊啊啊啊啊啊啊啊啊啊啊啊啊", useMusicPlayer.playingId, event.track!.id);
    useMusicPlayer.playingId = event.track!.id;
    useMusicPlayer.playingIndex = useMusicPlayer.playingList.findIndex(item => {
      return 'dj' in item ? item.mainTrackId === event.track!.id :item.id === event.track!.id
    })
  }
});

TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
  console.log('播放状态已更改:', event);
  // 更新播放状态
  useMusicPlayer.playStatus = event.state === State.Playing || event.state === State.Ready ? 'play' : 'stop';
  if(event.state === State.Ready){
    TrackPlayer.play();
  }
  if(event.state !== State.Playing){
    TrackPlayer.setVolume(0)
  }else{
    TrackPlayer.setVolume(1)
  }
});