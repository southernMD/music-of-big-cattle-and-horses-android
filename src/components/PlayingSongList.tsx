import React, { forwardRef, memo, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnapshot } from 'valtio';
import { useMusicPlayer } from '@/store';
import { Trash2, X } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { PlayModeToggle } from './MusicPlayer/PlayModeToggle';
import { Song } from '@/types/Song';
import { useMiniPlayer } from '@/context/MusicPlayerContext';
import { djItemSong } from '@/types/api/djItem';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// 创建一个自定义的比较函数，只在必要的属性变化时才重新渲染
const arePropsEqual = (prevProps: any, nextProps: any) => {
  // 如果是当前播放项或者变成了当前播放项，需要重新渲染
  if (prevProps.index === prevProps.playingIndex || nextProps.index === nextProps.playingIndex) {
    return prevProps.playingIndex === nextProps.playingIndex;
  }
  
  // 如果拖拽状态变化，需要重新渲染
  if (prevProps.isActive !== nextProps.isActive) {
    return false;
  }
  
  // 如果项目ID变化，需要重新渲染
  if (prevProps.item.id !== nextProps.item.id) {
    return false;
  }
  
  // 如果索引变化，需要重新渲染
  if (prevProps.index !== nextProps.index) {
    return false;
  }
  
  // 其他情况不需要重新渲染
  return true;
};

// 创建一个记忆化的列表项组件
const SongListItem = memo(({ 
  item, 
  drag, 
  isActive, 
  index,
  playingIndex,
  onItemPress,
  onDeletePress,
  theme
}: { 
  item: Song | djItemSong, 
  drag: () => void, 
  isActive: boolean,
  index: number,
  playingIndex: number,
  onItemPress: (index: number, id: number) => void,
  onDeletePress: (item: Song | djItemSong, index: number) => void,
  theme: any
}) => {
  const isPlaying = index === playingIndex;
  const name = item.name;
  const artist = "ar" in item? item.ar.map((item: any) => item.name).join('/') : item.dj.nickname;
  
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const handlePress = useCallback(() => {
    onItemPress(index, item.id);
  }, [index, item.id, onItemPress]);
  
  const handleDelete = useCallback((e: any) => {
    e.stopPropagation();
    onDeletePress(item, index);
  }, [item, index, onDeletePress]);
  
  console.log("渲染项", item.id, index, isPlaying ? "【播放中】" : "");
  
  return (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={0.7}
        delayLongPress={150}
        onLongPress={drag}
        onPress={handlePress}
      >
        <Animated.View style={[
          styles.playlistItem,
          isActive && styles.activeItem
        ]}>
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
              <Text style={[styles.separator, isPlaying && styles.playingText]}> · </Text>
              <Text style={[styles.artistName, isPlaying && styles.playingText]}>{artist}</Text>
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <X color={theme.typography.colors.small.default} size={16} />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
}, arePropsEqual);

// 修改为 forwardRef 接受外部 ref
const PlayingSongList = forwardRef<BottomSheet>((props, ref) => {
  const theme = useAppTheme();
  const { removeFromPlayingList, removeAllFromPlayingList, updatePlayingList } = useMiniPlayer();
  // 安全区域插入值
  const insets = useSafeAreaInsets();
  
  // 获取音乐播放器状态
  const musicPlayer = useSnapshot(useMusicPlayer);
  
  // 使用useRef保存列表数据，避免不必要的重渲染
  const listData = useMemo(() => Array.from(useMusicPlayer.playingList) as (Song | djItemSong)[], [musicPlayer.playingList]);

  // 底部弹出层的停靠点 - 确保只有一个固定的70%高度
  const snapPoints = useMemo(() => ['70%'], []);
  
  // 渲染背景遮罩
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );
  
  // 处理底部弹出层关闭
  const handleSheetClose = useCallback(() => {
    // 确保完全关闭，使用正常的close方法
    const bottomSheet = (ref as React.RefObject<BottomSheet>).current;
    if (bottomSheet) {
      bottomSheet.close();
    }
  }, [ref]);
  
  // 清空播放列表
  const handleClearPlaylist = useCallback(() => {
    // 这里添加清空播放列表的逻辑
    removeAllFromPlayingList();
    console.log('清空播放列表');
    handleSheetClose()
  }, [removeAllFromPlayingList]);

  // 删除单首歌曲
  const handleDeleteSong = useCallback((item:Song | djItemSong,index: number) => {
    if(musicPlayer.playingList.length === 1){
      handleClearPlaylist()
    }else{
      removeFromPlayingList(item.id,index)
    }
    console.log('删除歌曲', index);
  }, [musicPlayer.playingList,handleClearPlaylist]);

  // 处理拖拽排序完成后的数据更新
  // TODO: 有闪烁问题，很可能是拖拽库本身的问题
  const handleDragEnd = useCallback(({ data, from, to }: { data: (Song | djItemSong)[]; from: number; to: number }) => {
    console.log('拖拽排序完成，从', from, '到', to);
    if (from === to) return; // 如果位置没有变化，不做任何操作
    updatePlayingList(data);
    const currentPlayingId = musicPlayer.playingId;
    // 找到当前播放歌曲的新索引
    const newPlayingIndex = data.findIndex(item => item.id === currentPlayingId);
    
    // 更新播放索引
    if (newPlayingIndex !== -1 && newPlayingIndex !== musicPlayer.playingIndex) {
      useMusicPlayer.playingIndex = newPlayingIndex;
    }
  }, [updatePlayingList, musicPlayer.playingId, musicPlayer.playingIndex]);

  // 处理点击歌曲项
  const handleItemPress = useCallback((index: number, id: number) => {
    useMusicPlayer.playingIndex = index;
    useMusicPlayer.playingId = id;
  }, []);

  // 使用主题创建样式
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 计算项目高度以优化性能
  const ITEM_HEIGHT = 60; // 每个项目的高度，根据您的样式调整
  
  // 提前计算每个项目的布局，避免动态测量
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  // 渲染歌曲列表项
  const renderItem = useCallback(({item, drag, isActive, getIndex}: RenderItemParams<Song | djItemSong>) => {
    // 使用getIndex()获取索引，如果为undefined则使用查找方法
    const index = getIndex ? getIndex() : useMusicPlayer.playingList.findIndex(song => song.id === item.id);
    
    return (
      <SongListItem
        item={item}
        drag={drag}
        isActive={isActive}
        index={index || 0}
        playingIndex={musicPlayer.playingIndex}
        onItemPress={handleItemPress}
        onDeletePress={handleDeleteSong}
        theme={theme}
      />
    );
  }, [musicPlayer.playingIndex, handleDeleteSong, handleItemPress, theme]);

  // 获取窗口高度以计算70%高度
  const windowHeight = Dimensions.get('window').height;
  const minHeight = windowHeight * 0.7 - 100; // 70%高度减去头部和功能栏高度

  return (
    <BottomSheet
      ref={ref}
      index={-1} // 初始隐藏
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.bottomSheetBackground}
      enableOverDrag={false}
      enableContentPanningGesture={false} // 禁用内容区域的平移手势
      enableHandlePanningGesture={true}
      onClose={handleSheetClose}
      detached={false}
      animateOnMount={false} // 防止首次挂载时的动画
      enableDynamicSizing={false} // 禁止动态大小调整
      style={{ 
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10,
      }}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* 顶部标题区域 */}
        <View style={styles.header}>
          <Text style={styles.title}>当前播放<Text style={styles.badge}>{musicPlayer.playingList.length}</Text></Text>
          <TouchableOpacity onPress={handleSheetClose} style={styles.closeButton}>
            <X color={theme.typography.colors.medium.default} size={20} />
          </TouchableOpacity>
        </View>
        
        {/* 功能按钮区域 - 播放模式和清空按钮 */}
        <View style={styles.functionBar}>
          <PlayModeToggle size={16} />
          
          <View style={styles.spacer} />
          
          <TouchableOpacity style={styles.clearButton} onPress={handleClearPlaylist}>
            <Trash2 color={theme.typography.colors.medium.default} size={16} />
          </TouchableOpacity>
        </View>
        
        {/* 外层容器确保最小高度 */}
        <View style={{ flex: 1, minHeight }}>
          {/* 歌曲列表 - 使用 DraggableFlatList 替换 FlatList */}
          <DraggableFlatList
            // 使用ref中的数据，避免直接操作Valtio代理对象
            data={listData}
            keyExtractor={(item, index) => JSON.stringify(item)}
            renderItem={renderItem}
            onDragEnd={handleDragEnd}
            // 只在playingIndex变化时重新渲染列表
            extraData={musicPlayer.playingIndex}
            // 提前计算项目布局，避免动态测量
            getItemLayout={getItemLayout}
            contentContainerStyle={[
              styles.flatListContent,
              musicPlayer.playingList.length < 5 && { flexGrow: 1 } // 项目少时撑满空间
            ]}
            showsVerticalScrollIndicator={true}
            bounces={false} // 禁用弹性效果
            activationDistance={5} // 减小激活拖拽的距离
            keyboardShouldPersistTaps="handled" // 确保拖拽时键盘不会消失
            // 使用windowSize减少渲染范围
            windowSize={5}
            // 减少初始渲染数量
            initialNumToRender={8}
            // 减少维护在内存中的项目数量
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={50}
            removeClippedSubviews={false}
          />
        </View>
      </View>
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
    height: 5,
    borderRadius: 3,
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
    paddingVertical: 12, // 增加行高以便于点击
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.line.light,
    position: 'relative',
    backgroundColor: theme.box.background.shallow,
  },
  activeItem: {
    backgroundColor: theme.box.background.middle,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 999,
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
    paddingLeft: 8, // 添加左侧内边距
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
  flatListContent: {
    paddingBottom: 20,
    minHeight: '100%', // 确保内容区域至少占满可用空间
  },
});

// 导出组件
export default memo(PlayingSongList);