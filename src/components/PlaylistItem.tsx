import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MoveVertical as MoreVertical } from 'lucide-react-native';
import { memo, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from "@ant-design/react-native";
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProps } from '@/types/NavigationType';
interface PlaylistItemProps {
  type: 'Album' | 'dj'
  id: number;
  createId: number;
  image: string;
  title: string;
  count: number;
  plays: number;
  onPress?: () => void;
}

function PlaylistItem({ createId,id,image, type, title, count, plays, onPress }: PlaylistItemProps) {
  const { box, typography } = useTheme()
  const navigation = useNavigation<RootStackNavigationProps>();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: box.background.shallow,
      marginBottom: 1,
    },
    image: {
      width: 56,
      height: 56,
      borderRadius: 4,
    },
    content: {
      flex: 1,
      marginLeft: 12,
    },
    title: {
      color: typography.colors.large.default,
      fontSize: typography.sizes.small,
      marginBottom: 4,
    },
    subtitle: {
      color: typography.colors.small.default,
      fontSize: typography.sizes.xsmall,
    },
    moreButton: {
      padding: 8,
    },
  });
  const MyPress = useCallback(() => {
    if (onPress) onPress()
    navigation.navigate('PlayListDetail', {
      screen: 'PlayListDetail',
      params: {
        id,
        createId,
        type,
        name:title
      }
    })
  }, [onPress])
  return (
    <TouchableOpacity style={styles.container} onPress={MyPress}>
      <FastImage
        source={{ uri: image }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{count}首 · {plays}{type === 'Album' ? '次播放' : '次收藏'}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="more" size={20} color={typography.colors.medium.default} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default memo(PlaylistItem)