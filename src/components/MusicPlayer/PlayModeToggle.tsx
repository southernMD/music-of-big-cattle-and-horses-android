import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { PLAYING_LIST_TYPE } from '@/constants/values';
import { togglePlayMode, getCurrentPlayMode } from '@/utils/playModeUtils';
import { useAppTheme } from '@/context/ThemeContext';
import { Toast } from '@ant-design/react-native';

/**
 * 播放模式切换组件
 * 可以在任何需要切换播放模式的地方使用
 */
export const PlayModeToggle: React.FC<{
  size?: number;
  showLabel?: boolean;
  style?: any;
  color?: string;
  messageAlert?:boolean
}> = ({ size = 24, showLabel = true, style, color,messageAlert = false }) => {
  const theme = useAppTheme();
  
  // 从持久化存储中获取播放模式
  const playingType = usePersistentStore<PLAYING_LIST_TYPE>('playingType', PLAYING_LIST_TYPE.LOOP);
  
  // 获取当前播放模式
  const currentMode = useMemo(() => getCurrentPlayMode(playingType), [playingType]);
  
  // 切换播放模式
  const handleTogglePlayMode = useCallback(async () => {
    const result = await togglePlayMode(playingType);
    console.log('播放模式已切换为:', result.nextLabel);
    if(messageAlert) Toast.show({content:result.nextLabel,position:'top'})
  }, [playingType]);
  
  // 创建样式
  const styles = useMemo(() => createStyles(theme,style), [theme,style]);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleTogglePlayMode}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer,style]}>
        {React.createElement(currentMode.icon, { 
          color: color ? color: theme.colors.primary, 
          size 
        })}
      </View>
      
      {showLabel && (
        <Text style={styles.label}>{currentMode.label}</Text>
      )}
    </TouchableOpacity>
  );
};

// 创建样式
const createStyles = (theme: any,style:any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(102, 204, 255, 0.1)',
  },
  label: {
    marginLeft: 8,
    color: theme.typography.colors.medium.default,
    fontSize: theme.typography.sizes.small,
  },
  ...style,
}); 