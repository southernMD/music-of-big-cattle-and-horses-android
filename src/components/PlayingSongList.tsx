import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnapshot } from 'valtio';
import { useMusicPlayer } from '@/store';
import { Repeat, Repeat1, Shuffle, Trash2, X } from 'lucide-react-native';
import { convertHttpToHttps } from '@/utils/fixHttp';
import { useAppTheme } from '@/context/ThemeContext';
import { PLAYING_LIST_TYPE } from '@/constants/values';
import { usePersistentStore, setItem } from '@/hooks/usePersistentStore';

// 播放模式配置
const PLAY_MODES = [
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

// 修改为 forwardRef 接受外部 ref
const PlayingSongList = forwardRef<BottomSheet>((props, ref) => {
  const theme = useAppTheme();
  // 安全区域插入值
  const insets = useSafeAreaInsets();
  
  // 获取音乐播放器状态
  const musicPlayer = useSnapshot(useMusicPlayer);
  
  // 从持久化存储中获取播放模式，默认为列表循环
  const playingType = usePersistentStore<PLAYING_LIST_TYPE>('playingType', PLAYING_LIST_TYPE.LOOP);
  
  // 获取当前播放模式的索引
  const currentModeIndex = PLAY_MODES.findIndex(mode => mode.type === playingType);
  
  // 底部弹出层的停靠点
  const snapPoints = useMemo(() => ['70%'], []);
  
  // 渲染背景遮罩
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );
  
  // 关闭底部弹出层
  const handleClose = useCallback(() => {
    (ref as React.RefObject<BottomSheet>).current?.close();
  }, [ref]);

  // 删除单首歌曲
  const handleDeleteSong = useCallback((index: number) => {
    // 这里添加删除歌曲的逻辑
    console.log('删除歌曲', index);
  }, []);

  // 清空播放列表
  const handleClearPlaylist = useCallback(() => {
    // 这里添加清空播放列表的逻辑
    console.log('清空播放列表');
  }, []);

  // 切换播放模式
  const handleTogglePlayMode = useCallback(async () => {
    // 计算下一个播放模式的索引
    const nextIndex = (currentModeIndex + 1) % PLAY_MODES.length;
    const nextMode = PLAY_MODES[nextIndex].type;
    
    // 保存到持久化存储
    await setItem('playingType', nextMode);
    console.log('播放模式已切换为:', PLAY_MODES[nextIndex].label);
  }, [currentModeIndex]);

  // 获取当前播放模式
  const currentMode = PLAY_MODES[currentModeIndex];

  // 使用主题创建样式
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <BottomSheet
      ref={ref}
      index={-1} // 初始隐藏
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* 顶部标题区域 */}
        <View style={styles.header}>
          <Text style={styles.title}>当前播放<Text style={styles.badge}>{musicPlayer.playingList.length}</Text></Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X color={theme.typography.colors.medium.default} size={20} />
          </TouchableOpacity>
        </View>
        
        {/* 功能按钮区域 - 播放模式和清空按钮 */}
        <View style={styles.functionBar}>
          <TouchableOpacity style={styles.functionButton} onPress={handleTogglePlayMode}>
            <View style={styles.functionIconContainer}>
              {React.createElement(currentMode.icon, { 
                color: theme.colors.primary, 
                size: 16 
              })}
            </View>
            <Text style={styles.functionText}>{currentMode.label}</Text>
          </TouchableOpacity>
          
          <View style={styles.spacer} />
          
          <TouchableOpacity style={styles.clearButton} onPress={handleClearPlaylist}>
            <Trash2 color={theme.typography.colors.medium.default} size={16} />
          </TouchableOpacity>
        </View>
        
        {/* 歌曲列表 */}
        <FlatList
          data={musicPlayer.playingList}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({item, index}) => {
            const isPlaying = index === musicPlayer.playingIndex;
            const name = item.name;
            const artist = item.ar.map(item => item.name).join('/');
            
            return (
              <TouchableOpacity 
                style={styles.playlistItem}
                onPress={() => {
                  useMusicPlayer.playingIndex = index;
                  useMusicPlayer.playingId = item.id;
                }}
              >
                {isPlaying && (
                  <View style={styles.nowPlayingIndicator}>
                    <View style={styles.playingBar}></View>
                  </View>
                )}
                <View style={styles.textContainer}>
                  <Text 
                    style={[styles.songName, isPlaying && styles.playingText]} 
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {name}
                    <Text style={styles.separator}> · </Text>
                    <Text style={styles.artistName}>{artist}</Text>
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSong(index)}
                >
                  <X color={theme.typography.colors.small.default} size={16} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

// 使用主题创建样式
const createStyles = (theme: any) => StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: theme.box.background.shallow,
  },
  indicator: {
    backgroundColor: theme.typography.colors.medium.default,
    width: 40,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.line.light,
  },
  title: {
    color: theme.typography.colors.large.default,
    fontSize: theme.typography.sizes.large,
    fontWeight: 'bold',
  },
  badge: {
    fontSize: theme.typography.sizes.xsmall,
    color: theme.typography.colors.medium.default,
    position: 'relative',
    top: -5,
    marginLeft: 2,
  },
  closeButton: {
    padding: 4,
  },
  // 功能按钮区域
  functionBar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.box.background.middle,
    borderBottomWidth: 1,
    borderBottomColor: theme.line.light,
    justifyContent: 'space-between', // 两端对齐
    alignItems: 'center',
  },
  functionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  functionIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(102, 204, 255, 0.1)',
    marginRight: 6,
  },
  functionText: {
    color: theme.typography.colors.medium.default,
    fontSize: theme.typography.sizes.xsmall,
  },
  spacer: {
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
  // 播放列表项
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // 减小行高
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.line.light,
    position: 'relative',
  },
  nowPlayingIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingBar: {
    width: 3,
    height: '70%',
    backgroundColor: theme.colors.primary,
    borderRadius: 1.5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  songName: {
    fontSize: theme.typography.sizes.small,
    color: theme.typography.colors.medium.default,
  },
  separator: {
    fontSize: theme.typography.sizes.small,
    color: theme.typography.colors.small.default,
  },
  artistName: {
    fontSize: theme.typography.sizes.xsmall, // 艺术家名称使用更小的字体
    color: theme.typography.colors.small.default, // 艺术家名称使用更浅的颜色
  },
  playingText: {
    color: theme.colors.primary,
  },
  deleteButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// 导出组件
export default PlayingSongList;