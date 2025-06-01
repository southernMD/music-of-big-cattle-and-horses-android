import React, { createContext, useState, useContext, memo, useEffect, RefObject, useMemo, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, InteractionManager, Pressable, Dimensions } from 'react-native';
import { List, Pause, Play } from 'lucide-react-native';
import { NavigationContainerRef, ParamListRoute, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/NavigationType';
import { FOOTER_BAR_HEIGHT, NEED_FOOTER_BAR_ROUTE } from '@/constants/bar';
import { subscribe, useSnapshot } from 'valtio';
import { useMusicPlayer } from '@/store';
import { SongUrl } from '@/api';
import { convertHttpToHttps } from '@/utils/fixHttp';
import Sound from 'react-native-sound';
import FastImage from 'react-native-fast-image';
import Svg, { Circle } from 'react-native-svg';
import { watch } from 'valtio/utils';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import ImageColors from 'react-native-image-colors';
import { AndroidImageColors } from 'react-native-image-colors/lib/typescript/types';
import { HorizontaSlidingGesture } from '@/components/HorizontaSlidingGesture';
import StickBarScrollingFlatList from '@/components/StickBarScrollingFlatList/StickBarScrollingFlatList';
import { FlatList } from 'react-native-gesture-handler';
import LevelScrollView, { LevelScrollViewRef } from '@/components/StickBarScrollingFlatList/LevelScrollView';
import { runOnUI, scrollTo, useSharedValue } from 'react-native-reanimated';
interface MiniPlayerProps {
    title: string;
    artist: string;
    progress?: number;
}

interface MiniPlayerContextValue {
    setMiniPlayer: (title: string, artist: string, progress: number, cover: string) => void;
    hideMiniPlayer: () => void;
    showMiniPlayer: () => void;
    getMiniPlayer: () => {
        title: string;
        artist: string;
        progress: number;
        cover: string;
        currentTime: number;
        durationTime: number;
    };
    updateProgress: (progress: number) => void;
    changeSoundPlaying: () => void;
}

const MiniPlayerContext = createContext<MiniPlayerContextValue>({
    setMiniPlayer: () => { },
    hideMiniPlayer: () => { },
    updateProgress: () => { },
    getMiniPlayer: () => { return { title: '', artist: '', progress: 0, cover: '', currentTime: 0, durationTime: 0 } },
    showMiniPlayer: () => { },
    changeSoundPlaying: () => { },
});

const SIZE = 25;
const STROKE_WIDTH = 2;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const { width: screenWidth } = Dimensions.get('window');
const rowWidth = screenWidth * 0.75; // styles.row 的宽度

export const MiniPlayerProvider: React.FC<{ children: React.ReactNode, currentRoute?: ParamListRoute<any>, openMusicPlayer: () => void }> = memo(({ children, currentRoute, openMusicPlayer }) => {
    const isDark = usePersistentStore<boolean>('isDark');
    const [isVisible, setIsVisible] = useState(false);
    const [title, setTitle] = useState('好音乐，用牛马');
    const [artist, setArtist] = useState('');
    const [progress, setProgress] = useState(0);
    const [cover, setCover] = useState(isDark ? 'icon' : 'icon_red')
    const [safeNeedTransition, setSafeNeedTransition] = useState(false);
    const prevNeedTransitionRef = useRef<boolean>(false);
    const [durationTime, setDurationTime] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    useEffect(() => {
        console.log(currentRoute);
        const nextNeedTransition = NEED_FOOTER_BAR_ROUTE.includes(currentRoute?.name!);
        const prev = prevNeedTransitionRef.current;
        console.log(!prev && nextNeedTransition);
        console.log(!nextNeedTransition);

        if (!prev && nextNeedTransition) {
            const timer = setTimeout(() => {
                showMiniPlayer()
                setSafeNeedTransition(true);
            }, 250);

            return () => clearTimeout(timer);
        }

        if (!nextNeedTransition) {
            setSafeNeedTransition(false);
        }

        // 更新上一次的值
        prevNeedTransitionRef.current = nextNeedTransition;
        if (currentRoute?.name === 'MusicPlayer') {
            console.log("?????123");

            hideMiniPlayer()
        } else {
            const timer = setTimeout(() => {
                showMiniPlayer()
            }, 250);

            return () => clearTimeout(timer);
        }
    }, [currentRoute]);

    const setMiniPlayer = (title: string, artist: string, progress = 0, cover: string) => {
        setTitle(title);
        setArtist(artist);
        setProgress(progress);
        setCover(cover);
    };

    const getMiniPlayer = () => {
        return { title, artist, progress, cover, durationTime, currentTime };
    };

    const hideMiniPlayer = () => {
        setIsVisible(false);
    };


    const showMiniPlayer = () => {
        if (useMusicPlayer.playingList.length) setIsVisible(true);
    };

    const updateProgress = (progress: number) => {
        if (isVisible) setProgress(progress);
    };


    const musicPlayer = useSnapshot(useMusicPlayer);
    const soundRef = useRef<Sound | null>(null); // 添加 Sound 的 ref

    useEffect(() => {
        if (musicPlayer.playingId <= 0) return;

        // 销毁旧 sound
        if (soundRef.current) {
            soundRef.current.stop(() => {
                soundRef.current?.release();
                soundRef.current = null;
            });
        }

        SongUrl(musicPlayer.playingId).then(({ data }) => {
            const [{ url }] = data;
            const httpSong = convertHttpToHttps(url);
            console.log(httpSong, 'songURl');

            const sound = new Sound(httpSong, undefined, (error) => {
                if (error) {
                    console.error('Failed to load the sound', error);
                    return;
                }

                soundRef.current = sound;

                const duration = sound.getDuration();
                console.log('音乐总时长:', duration, '秒');
                setDurationTime(duration * 1000)
                const playingSong = useMusicPlayer.playingList[useMusicPlayer.playingIndex]
                const playingSongPrivileges = useMusicPlayer.playingPrivileges[useMusicPlayer.playingIndex]
                const name = `${playingSong.name} ${playingSong.tns?.length ? `(${playingSong.tns[0]})` : ''} ${playingSong.alia?.length ? `(${playingSong.alia[0]})` : ''}`
                const artist = playingSong.ar.map(item => item.name).join('/') + '-' + playingSong.al.name
                setMiniPlayer(name, artist, 0, convertHttpToHttps(playingSong.al.picUrl))
                useMusicPlayer.playStatus = 'play'
                sound.play((success) => {
                    if (success) {
                        clearInterval(interval);
                        setProgress(100)
                        console.log('Sound played successfully');
                    } else {
                        console.log('Sound playback failed');
                    }
                    useMusicPlayer.playStatus = 'stop'
                    // 播放完成后销毁
                    sound.stop(() => {
                        sound.release();
                        if (soundRef.current === sound) {
                            soundRef.current = null;
                            useMusicPlayer.playingId = -1
                        }
                    });
                });

                const interval = setInterval(() => {
                    sound.getCurrentTime((currentTime) => {
                        // console.log('当前播放进度:', currentTime / duration * 100);
                        setProgress(currentTime / duration * 100)
                        setCurrentTime(currentTime * 1000)
                    });
                }, 200);

                sound.setNumberOfLoops(0);

                // 清理 interval 定时器
                const clearAll = () => {
                    clearInterval(interval);
                };

                // 防止组件卸载时定时器泄露
                return clearAll;
            });
        });
        return () => {
            if (soundRef.current) {
                soundRef.current.stop(() => {
                    soundRef.current?.release();
                    soundRef.current = null;
                    useMusicPlayer.playingId = -1
                    useMusicPlayer.playStatus = 'stop'
                });
            }
        };
    }, [musicPlayer.playingId]);

    useEffect(() => {
        if (useMusicPlayer.playingList.length === 0) {
            hideMiniPlayer()
        } else {
            showMiniPlayer()
        }
    }, [musicPlayer.playingList])
    const changeSoundPlaying = () => {
        if (!soundRef.current && useMusicPlayer.playingList[useMusicPlayer.playingIndex]) {
            useMusicPlayer.playingId = useMusicPlayer.playingList[useMusicPlayer.playingIndex].id
            return
        }
        if (soundRef.current!.isPlaying()) {
            soundRef.current!.pause(() => {
                useMusicPlayer.playStatus = 'stop'
            })
        } else {
            soundRef.current!.play()
            useMusicPlayer.playStatus = 'play'
        }
    }

    useEffect(() => {
        ImageColors.getColors(cover, { fallback: '#000000' }).then((colors) => {
            console.log(colors);
            useMusicPlayer.playingSongAlBkColor = (colors as AndroidImageColors)
        });
    }, [cover])

    const openMiniPlayer = () => {
        hideMiniPlayer()
        openMusicPlayer()
    }

    const contextValue: MiniPlayerContextValue = {
        setMiniPlayer,
        hideMiniPlayer,
        updateProgress,
        showMiniPlayer,
        getMiniPlayer,
        changeSoundPlaying
    };


    return (
        <MiniPlayerContext.Provider value={contextValue}>
            {children}
            {isVisible && (
                <Pressable onPress={openMiniPlayer}>
                    <View style={[styles.container, { bottom: safeNeedTransition ? FOOTER_BAR_HEIGHT : 0 }]}>
                        <View style={styles.content}>
                            <MusicPlayerMiniFlatList></MusicPlayerMiniFlatList>
                            <View style={styles.controls}>
                                <TouchableOpacity style={styles.playButton} onPress={changeSoundPlaying}>
                                    <Svg width={SIZE} height={SIZE}>
                                        <Circle
                                            cx={SIZE / 2}
                                            cy={SIZE / 2}
                                            r={RADIUS}
                                            stroke="rgba(255, 255, 255, 0.3)"
                                            strokeWidth={STROKE_WIDTH}
                                            fill="none"
                                        />
                                        <Circle
                                            cx={SIZE / 2}
                                            cy={SIZE / 2}
                                            r={RADIUS}
                                            stroke="#fff"
                                            strokeWidth={STROKE_WIDTH}
                                            fill="none"
                                            strokeDasharray={`${CIRCUMFERENCE}, ${CIRCUMFERENCE}`}
                                            strokeDashoffset={(1 - progress / 100) * CIRCUMFERENCE}
                                            strokeLinecap="round"
                                            rotation={-90}
                                            origin={`${SIZE / 2}, ${SIZE / 2}`}
                                        />
                                    </Svg>
                                    <View style={styles.playIcon}>
                                        {
                                            useMusicPlayer.playStatus === 'play' ?
                                                <Pause color="#fff" size={16} fill="#fff" />
                                                : <Play color="#fff" size={16} fill="#fff" />
                                        }
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.listButton}>
                                    <List color="#fff" size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Pressable>
            )}
        </MiniPlayerContext.Provider>
    );
});

const SongItem = memo(({ cover, title, artist }: { cover: string, title: string, artist: string }) => {
    return (
        <View style={styles.rowItem}>
            <FastImage
                source={{ uri: cover }}
                style={styles.cover}
            />

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
            </View>
        </View>
    )
})

const MusicPlayerMiniFlatList = memo(() => {
    const levelScrollViewRef = useRef<LevelScrollViewRef>(null)
    const horizontalScrollX = useSharedValue(0);
    console.log('我刷新了MusicPlayerMiniFlatList');
    
    // 添加一个状态来控制显示/隐藏
    const [isVisible, setIsVisible] = useState(true);

    const musicPlayer = useSnapshot(useMusicPlayer)

    const playingSongNearly = useMemo(() => { 
        console.log(' 我刷新了playingSongNearly');
        const index = useMusicPlayer.playingIndex
        const length = useMusicPlayer.playingList.length;
        const prevIndex = (index - 1 + length) % length;
        const nextIndex = (index + 1) % length;
        return [
            useMusicPlayer.playingList[prevIndex],
            useMusicPlayer.playingList[index],
            useMusicPlayer.playingList[nextIndex]
        ];
    }, [musicPlayer.playingId, musicPlayer.playingIndex])

    const FinishHorizontalScrollHandle = (newIndex:number, oldIndex:number) => {
        if(newIndex === oldIndex) return;
        
        // TODO: 非最佳解决办法，只是展示屏蔽了切换显示
        setIsVisible(false);
        
        const index = musicPlayer.playingList.findIndex(item=>item.id === playingSongNearly[newIndex].id);
        if(index === -1) {
            setIsVisible(true);
            return;
        }
        
        if(playingSongNearly[newIndex].id === playingSongNearly[oldIndex].id) {
            console.log('same song', levelScrollViewRef.current?.scrollRef);
            levelScrollViewRef.current?.scrollRef!.current?.scrollTo({ x: 1 * rowWidth, y: 0, animated: false });
            horizontalScrollX.value = 1 * rowWidth;
            setIsVisible(true);
            return;
        }
        
        // 更新播放索引和ID
        useMusicPlayer.playingIndex = index;
        useMusicPlayer.playingId = playingSongNearly[newIndex].id;
        
        // 在下一帧再显示内容
        requestAnimationFrame(() => {
            setIsVisible(true);
        });
    }

    return (
        <LevelScrollView
            Scrolling={() => { }}
            loading={false}
            ref={levelScrollViewRef}
            horizontalScrollX={horizontalScrollX}
            itemWidth={rowWidth}
            blockLen={3}
            startIndex={1}
            FinishHorizontalScrollHandle={FinishHorizontalScrollHandle}
        >
           <></>
           <>
            <FlatList
                keyExtractor={(item,index) => `${item.id}-${index}`}
                data={playingSongNearly}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ opacity: isVisible ? 1 : 0 }} // 控制可见性
                renderItem={({item}) => {
                    const name = `${item.name} ${item.tns?.length ? `(${item.tns[0]})` : ''} ${item.alia?.length ? `(${item.alia[0]})` : ''}`
                    const artist = item.ar.map(item => item.name).join('/') + '-' + item.al.name
                    const cover = convertHttpToHttps(item.al.picUrl)
                    return <SongItem cover={cover} title={name} artist={artist} />
                }}
            />
        </>
        </LevelScrollView>
    )
})
export const useMiniPlayer = () => {
    return useContext(MiniPlayerContext);
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        position: 'absolute',
        left: 0,
        right: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row: {
        width: '75%',
        backgroundColor: 'red',
        padding: 8,
        paddingRight: 0,
    },
    rowItem: {
        width: rowWidth,
        flexDirection: 'row',
        padding: 8,
    },
    cover: {
        width: 40,
        height: 40,
        borderRadius: 4,
    },
    info: {
        flex: 1,
        marginHorizontal: 12,
        width: '100%',
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    artist: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        marginTop: 2,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 8,
        paddingHorizontal: 16,
    },
    playButton: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    playIcon: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listButton: {
        padding: 4,
    },
});