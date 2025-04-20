import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MoveVertical as MoreVertical } from 'lucide-react-native';
import { memo } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from "@ant-design/react-native";

interface PlaylistItemProps {
  image: string;
  title: string;
  count: number;
  plays: number;
  onPress?: () => void;
}

function PlaylistItem({ image, title, count, plays, onPress }: PlaylistItemProps) {
  const { box,typography } = useTheme()
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
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{count}首 · {plays}次播放</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="more" size={20} color={typography.colors.medium.default} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default memo(PlaylistItem)