import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useFullScreenImage } from '@/context/imgFullPreviewContext';
import { useBasicApi } from '@/store';
import { convertHttpToHttps } from '@/utils/fixHttp';
import { ComponentType, memo, useEffect, useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { userProfile } from '@/types/user/user';

function ProfileHeader({ pullOffset, profile }: { pullOffset: SharedValue<number>,profile:userProfile | null }) {
  const { showFullScreenImage, isVisible } = useFullScreenImage();
  const backgroundUrl = useMemo(() => convertHttpToHttps(profile?.backgroundUrl), [profile?.backgroundUrl]);
  const avatarUrl = useMemo(() => convertHttpToHttps(profile?.avatarUrl), [profile?.avatarUrl]);
  const animatedStyle = useAnimatedStyle(() => {
    const scale = Math.max(1 + pullOffset.value / 1000,1);
    console.log(scale);
    return {
      transform: [{ scale }],
    };
  });
  const tranStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: pullOffset.value / 10 }],
    };
  });
  const pressHandler = (url: string) => {
    showFullScreenImage(url)
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: backgroundUrl }}
        style={[styles.backgroundImage,animatedStyle]}
        resizeMode="cover"
      />

      <Pressable onPress={() => pressHandler(backgroundUrl)} style={styles.overlay}>
        <View />
      </Pressable>

      <Pressable onPress={() => pressHandler(avatarUrl)}>
        <Animated.Image
          source={{ uri: avatarUrl }}
          style={[styles.avatar,tranStyle]}
        />
      </Pressable>

      <Animated.Text
        style={[styles.name,tranStyle]}
      >
        {profile?.nickname}
      </Animated.Text>

      <Animated.Text
        style={[styles.bio,tranStyle]}
      >
        {profile?.signature}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    height: 400, // 自定义背景高度
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profile: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  bio: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default memo(ProfileHeader);
