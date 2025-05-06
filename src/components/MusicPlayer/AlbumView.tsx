import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Heart, History, Send, MessageSquare, MoveVertical as MoreVertical } from 'lucide-react-native';
import { Icon } from '@ant-design/react-native';
import { useTheme } from '@/hooks/useTheme';
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMusicPlayer } from '@/store';
import { convertHttpToHttps } from '@/utils/fixHttp';
import { useSnapshot } from 'valtio'
import FastImage from 'react-native-fast-image';
import { isLightColor } from '@/utils/isLightColor';
export function AlbumView() {
    const { box, typography } = useTheme()
    const musicPlayer = useSnapshot(useMusicPlayer)

    const playingSongCover = useMemo(() => {
        return convertHttpToHttps(musicPlayer.playingList[musicPlayer.playingIndex]?.al.picUrl) ?? 'icon'
    }, [musicPlayer.playingList, musicPlayer.playingIndex])

    const fontColor = useMemo(() => {
        return isLightColor(musicPlayer.playingSongAlBkColor.average!) ? musicPlayer.playingSongAlBkColor.darkVibrant : musicPlayer.playingSongAlBkColor.lightMuted
    }, [musicPlayer.playingSongAlBkColor.average])
    return (
        <View style={[styles.container, { backgroundColor: useMusicPlayer.playingSongAlBkColor.average }]}>
            <View style={styles.recordContainer}>
                <View style={[styles.record, { backgroundColor: useMusicPlayer.playingSongAlBkColor?.lightVibrant, shadowColor: useMusicPlayer.playingSongAlBkColor?.muted }]}>
                    <RotatingImage source={{ uri: playingSongCover }}></RotatingImage>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
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
    const animated = Animated.loop(
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 30000, // 30秒
            easing: Easing.linear,
            useNativeDriver: true,
        })
    )
    useEffect(() => {
        rotateAnim.setValue(0);
        animated.start()
    }, [rotateAnim]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const rotatingStyle = {
        transform: [{ rotate: rotateInterpolate }],
    };

    const styles = StyleSheet.create({
        imageWrapper: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    const musicPlayer = useSnapshot(useMusicPlayer)
    useEffect(() => {
        if (musicPlayer.playStatus === 'play') {
            animated.start()
        } else {
            animated.stop()
        }
    }, [musicPlayer.playStatus])
    return (
        <Animated.View style={[styles.imageWrapper, rotatingStyle, { width: size, height: size }]}>
            <FastImage source={source} style={{ width: size, height: size, borderRadius: screenWidth * 0.35 }} />
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