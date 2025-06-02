import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnapshot } from 'valtio';
import { useMusicPlayer } from '@/store';
import { Trash2, X } from 'lucide-react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { PlayModeToggle } from './MusicPlayer/PlayModeToggle';

// 修改为 forwardRef 接受外部 ref
const PlayingSongList = forwardRef<BottomSheet>((props, ref) => {
  const theme = useAppTheme();
  // 安全区域插入值
  const insets = useSafeAreaInsets();
  
  // 获取音乐播放器状态
  const musicPlayer = useSnapshot(useMusicPlayer);
  
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


  // 使用主题创建样式
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 渲染歌曲列表项
  const renderItem = useCallback(({item, index}: {item: any, index: number}) => {
    const isPlaying = index === musicPlayer.playingIndex;
    const name = item.name;
    const artist = item.ar.map((item: any) => item.name).join('/');
    
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
  }, [musicPlayer.playingIndex, handleDeleteSong, styles, theme]);

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
      enableContentPanningGesture={true}
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
          {/* <TouchableOpacity style={styles.functionButton} onPress={handleTogglePlayMode}>
            <View style={styles.functionIconContainer}>
              {React.createElement(currentMode.icon, { 
                color: theme.colors.primary, 
                size: 16 
              })}
            </View>
            <Text style={styles.functionText}>{currentMode.label}</Text>
          </TouchableOpacity> */}
          <PlayModeToggle size={16} />
          
          <View style={styles.spacer} />
          
          <TouchableOpacity style={styles.clearButton} onPress={handleClearPlaylist}>
            <Trash2 color={theme.typography.colors.medium.default} size={16} />
          </TouchableOpacity>
        </View>
        
        {/* 外层容器确保最小高度 */}
        <View style={{ flex: 1, minHeight }}>
          {/* 歌曲列表 - 使用 BottomSheetFlatList 替代 FlatList */}
          <BottomSheetFlatList
            data={musicPlayer.playingList}
            keyExtractor={(item) => `${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.flatListContent,
              musicPlayer.playingList.length < 5 && { flexGrow: 1 } // 项目少时撑满空间
            ]}
            showsVerticalScrollIndicator={true}
            bounces={false} // 禁用弹性效果
            overScrollMode="never" // 禁用过度滚动效果
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
  flatListContent: {
    paddingBottom: 20,
    minHeight: '100%', // 确保内容区域至少占满可用空间
  },
});

// 导出组件
export default PlayingSongList;