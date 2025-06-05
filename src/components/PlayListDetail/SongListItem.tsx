import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@ant-design/react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@/hooks/useTheme';
import { Song } from '@/types/Song';
import { djItemSong } from '@/types/api/djItem';
import { convertHttpToHttps } from '@/utils/fixHttp';
import { usePersistentStore } from '@/hooks/usePersistentStore';

interface SongListItemProps {
  item: Song | djItemSong;
  index: number;
  onPress: (item: Song | djItemSong, type: 'dj' | 'playList') => void;
  type: 'dj' | 'playList';
}

export const SongListItem: React.FC<SongListItemProps> = ({ item, index, onPress, type }) => {
  const { typography, box, boxReflect } = useTheme();
  const primaryColor = usePersistentStore<string>('primaryColor');

  const styles = StyleSheet.create({
    songItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: box.background.shallow,
      marginBottom: 1,
    },
    songIndex: {
      width: 32,
      color: typography.colors.small.default,
      fontSize: typography.sizes.small,
      textAlign: 'center',
    },
    songCover: {
      width: 48,
      height: 48,
      borderRadius: 4,
    },
    songInfo: {
      flex: 1,
      gap: 4,
      marginLeft: 8,
    },
    songTitle: {
      color: typography.colors.medium.default,
      fontSize: typography.sizes.medium,
    },
    songDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    artistText: {
      color: typography.colors.small.default,
      fontSize: typography.sizes.small,
    },
    moreButton: {
      padding: 8,
    },
  });

  return (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => onPress?.(item, type)}
    >
      <Text style={styles.songIndex}>{(index + 1).toString().padStart(2, '0')}</Text>
      <FastImage 
        source={{ uri: convertHttpToHttps('al' in item ? item.al.picUrl : item.coverUrl) }} 
        style={styles.songCover} 
      />
      <View style={styles.songInfo}>
        <Text 
          style={styles.songTitle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {item.name}
        </Text>
        <View style={styles.songDetails}>
          {
            'ar' in item && (
              <Text 
                style={styles.artistText}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {item.ar.flatMap(item => item.name).join("/") + ' - ' + item.al.name}
              </Text>
            )
          }
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="more" size={20} color={typography.colors.medium.default} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}; 