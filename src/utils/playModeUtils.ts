import { Repeat, Repeat1, Shuffle } from 'lucide-react-native';
import { PLAYING_LIST_TYPE } from '@/constants/values';
import { setItem } from '@/hooks/usePersistentStore';

// 播放模式配置
export const PLAY_MODES = [
  {
    type: PLAYING_LIST_TYPE.LOOP_ONE,
    icon: Repeat1,
    label: '单曲循环'
  },
  {
    type: PLAYING_LIST_TYPE.RANDOM,
    icon: Shuffle,
    label: '随机播放'
  },
  {
    type: PLAYING_LIST_TYPE.LOOP,
    icon: Repeat,
    label: '列表循环'
  }
];

/**
 * 切换播放模式
 * @param currentPlayingType 当前播放模式
 * @returns 返回一个对象，包含下一个播放模式类型和标签
 */
export const togglePlayMode = async (currentPlayingType: PLAYING_LIST_TYPE): Promise<{
  nextType: PLAYING_LIST_TYPE;
  nextLabel: string;
}> => {
  // 获取当前播放模式的索引
  const currentModeIndex = PLAY_MODES.findIndex(mode => mode.type === currentPlayingType);
  
  // 计算下一个播放模式的索引
  const nextIndex = (currentModeIndex + 1) % PLAY_MODES.length;
  const nextMode = PLAY_MODES[nextIndex];
  
  // 保存到持久化存储
  await setItem('playingType', nextMode.type);
  
  return {
    nextType: nextMode.type,
    nextLabel: nextMode.label
  };
};

/**
 * 获取当前播放模式的信息
 * @param currentPlayingType 当前播放模式
 * @returns 返回当前播放模式的配置
 */
export const getCurrentPlayMode = (currentPlayingType: PLAYING_LIST_TYPE) => {
  const modeIndex = PLAY_MODES.findIndex(mode => mode.type === currentPlayingType);
  return PLAY_MODES[modeIndex !== -1 ? modeIndex : 2]; // 默认返回列表循环
}; 