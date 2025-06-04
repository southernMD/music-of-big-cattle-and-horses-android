import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing, Pressable } from 'react-native';
import { Heart, History, Send, MessageSquare, MoveVertical as MoreVertical } from 'lucide-react-native';
import { Icon } from '@ant-design/react-native';
import { useTheme } from '@/hooks/useTheme';
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useMusicPlayer } from '@/store';
import { convertHttpToHttps } from '@/utils/fixHttp';
import { useSnapshot } from 'valtio'
import FastImage from 'react-native-fast-image';
import { isLightColor } from '@/utils/isLightColor';
import { useFullScreenImage } from '@/context/imgFullPreviewContext';
export function AlbumView() {
    const { box, typography } = useTheme()
    const musicPlayer = useSnapshot(useMusicPlayer)

    const playingSongCover = useMemo(() => {
        const song = musicPlayer.playingList[musicPlayer.playingIndex]
        return convertHttpToHttps('al' in song ? song?.al.picUrl : song.coverUrl) ?? 'icon'
    }, [musicPlayer.playingList, musicPlayer.playingIndex])

    const fontColor = useMemo(() => {
        return isLightColor(musicPlayer.playingSongAlBkColor.average!) ? musicPlayer.playingSongAlBkColor.darkVibrant : musicPlayer.playingSongAlBkColor.lightMuted
    }, [musicPlayer.playingSongAlBkColor.average])

    const { showFullScreenImage, isVisible } = useFullScreenImage();
    
    return (
        <View style={[styles.container, { backgroundColor: useMusicPlayer.playingSongAlBkColor.average }]}>
            <Pressable style={styles.recordContainer} onLongPress={()=>showFullScreenImage(playingSongCover)}>
                <View style={[styles.record, { backgroundColor: useMusicPlayer.playingSongAlBkColor?.lightVibrant, shadowColor: useMusicPlayer.playingSongAlBkColor?.muted }]}>
                    <RotatingImage source={{ uri: playingSongCover }}></RotatingImage>
                </View>
            </Pressable>

            <View style={styles.actions} >
                <TouchableOpacity style={styles.actionButton} onPress={()=>showFullScreenImage(playingSongCover)}>
                    <Heart color={fontColor} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <History color={fontColor} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Send color={fontColor} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <MessageSquare color={fontColor} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="more" size={24} color={fontColor} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
const RotatingImage = ({ source, size = '100%' }: { source: any; size?: `${number}%` }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);
    
    const styles = useMemo(() => StyleSheet.create({
        imageWrapper: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    }), []);

    // 只在组件挂载时创建动画，不在每次播放状态变化时重新创建
    useEffect(() => {
        // 创建一个永久循环的动画，但设置为低优先级
        animationRef.current = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 30000, // 30秒一圈
                easing: Easing.linear,
                useNativeDriver: true, // 使用原生驱动
                isInteraction: false, // 标记为非交互动画，降低优先级
                delay: 300, // 添加延迟，让其他动画先执行
            })
        );
        
        // 如果当前是播放状态，则启动动画
        const musicPlayer = useMusicPlayer;
        if (musicPlayer.playStatus === 'play') {
            // 延迟启动动画，让其他UI操作先完成
            setTimeout(() => {
                if (animationRef.current) {
                    animationRef.current.start();
                }
            }, 500);
        }
        
        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, []); // 只在挂载时执行一次

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const rotatingStyle = {
        transform: [{ rotate: rotateInterpolate }],
    };

    // 监听播放状态变化
    const musicPlayer = useSnapshot(useMusicPlayer);
    
    useEffect(() => {
        if (!animationRef.current) return;
        
        if (musicPlayer.playStatus === 'play') {
            // 播放时，延迟启动动画，降低优先级
            setTimeout(() => {
                if (animationRef.current) {
                    animationRef.current.start();
                }
            }, 300);
        } else {
            // 暂停时，立即停止动画
            animationRef.current.stop();
        }
    }, [musicPlayer.playStatus]);

    // 使用memo优化渲染
    const imageComponent = useMemo(() => (
        <FastImage 
            source={source} 
            style={{ width: size, height: size, borderRadius: screenWidth * 0.35 }}
            resizeMode="cover"
        />
    ), [source, size]);

    return (
        <Animated.View 
            style={[styles.imageWrapper, rotatingStyle, { width: size, height: size }]}
            shouldRasterizeIOS={true} // iOS上栅格化以提高性能
            renderToHardwareTextureAndroid={true} // Android上使用硬件纹理
        >
            {imageComponent}
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    recordContainer: {
        marginTop: screenHeight * 0.05,
        width: screenWidth * 0.7,
        height: screenWidth * 0.7,
        position: 'relative',
    },
    record: {
        width: '100%',
        height: '100%',
        borderRadius: screenWidth * 0.35,
        padding: 24,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: screenHeight * 0.05,
    },
    actionButton: {
        padding: 12,
    },
});