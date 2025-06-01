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
import { getItem, usePersistentStore } from '@/hooks/usePersistentStore';
import ImageColors from 'react-native-image-colors';
import { AndroidImageColors } from 'react-native-image-colors/lib/typescript/types';
import { HorizontaSlidingGesture } from '@/components/HorizontaSlidingGesture';
import StickBarScrollingFlatList from '@/components/StickBarScrollingFlatList/StickBarScrollingFlatList';
import { FlatList } from 'react-native-gesture-handler';
import LevelScrollView, { LevelScrollViewRef } from '@/components/StickBarScrollingFlatList/LevelScrollView';
import { runOnUI, scrollTo, useSharedValue } from 'react-native-reanimated';
import PlayingSongList from '@/components/PlayingSongList';
import { createRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { getCryptoRandomInt } from '@/utils/getCryptoRandomInt';
import { PLAYING_LIST_TYPE } from '@/constants/values';

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

// 创建一个全局引用，这样可以从任何地方控制底部弹出层
export const playingSongListRef = createRef<BottomSheet>();

export const MiniPlayerProvider: React.FC<{ children: React.ReactNode, currentRoute?: ParamListRoute<any>, openMusicPlayer: () => void }> = memo(({ children, currentRoute, openMusicPlayer }) => {
    const isDark = usePersistentStore<boolean>('isDark');
    const playingType = usePersistentStore<PLAYING_LIST_TYPE>('playingType', PLAYING_LIST_TYPE.LOOP);
    const [isVisible, setIsVisible] = useState(false);
    const [title, setTitle] = useState('好音乐，用牛马');
    const [artist, setArtist] = useState('');
    const [progress, setProgress] = useState(0);
    const [cover, setCover] = useState(isDark ? 'icon' : 'icon_red')
    const [safeNeedTransition, setSafeNeedTransition] = useState(false);
    const prevNeedTransitionRef = useRef<boolean>(false);
    const [durationTime, setDurationTime] = useState(0)
    let playLock = false
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
    const controllerRef = useRef<AbortController | null>(null); // 添加 AbortController 的 ref
    const currentLoadingIdRef = useRef<number>(-1); // 跟踪当前正在加载的歌曲ID
    const playLockRef = useRef<boolean>(false); // 使用 ref 来管理锁定状态
    
    // 创建一个安全的释放函数
    const safeReleaseSoundRef = useCallback(() => {
        if (soundRef.current) {
            const sound = soundRef.current;
            soundRef.current = null; // 立即清空引用
            
            // 停止并释放
            sound.stop(() => {
                sound.release();
                console.log('Sound safely released');
            });
        }
    }, []);

    useEffect(() => {
        if (musicPlayer.playingId <= 0) return;
        
        console.log(`开始加载歌曲: ${musicPlayer.playingId}`);
        
        // 记录当前正在加载的歌曲ID
        const currentLoadingId = musicPlayer.playingId;
        currentLoadingIdRef.current = currentLoadingId;

        // 设置锁
        playLockRef.current = true;
        
        // 取消之前的请求
        if (controllerRef.current) {
            console.log('取消之前的请求');
            controllerRef.current.abort();
            controllerRef.current = null;
        }
        
        // 释放之前的音频
        safeReleaseSoundRef();
        
        // 创建新的控制器
        const controller = new AbortController();
        controllerRef.current = controller;
        
        // 创建一个标记，表示这个加载过程是否已经被取消
        let isCancelled = false;
        
        SongUrl(currentLoadingId, controller)
            .then(({ data }) => {
                // 如果请求已被取消或ID已更改，不继续处理
                if (controller.signal.aborted || currentLoadingId !== currentLoadingIdRef.current) {
                    console.log('请求已取消或ID已更改，不加载音频');
                    playLockRef.current = false;
                    return;
                }
                
                controllerRef.current = null;
                const [{ url }] = data;
                const httpSong = convertHttpToHttps(url);
                console.log(httpSong, 'songURl');
                
                // 在创建Sound之前再次检查
                if (currentLoadingId !== currentLoadingIdRef.current) {
                    console.log('ID已更改，不创建Sound实例');
                    playLockRef.current = false;
                    return;
                }

                const sound = new Sound(httpSong, undefined, (error) => {
                    // 检查这个Sound实例是否还应该继续
                    if (isCancelled || currentLoadingId !== currentLoadingIdRef.current) {
                        console.log('Sound加载回调：已取消或ID已更改，释放实例');
                        sound.release();
                        playLockRef.current = false;
                        return;
                    }
                    
                    if (error) {
                        console.error('Failed to load the sound', error);
                        playLockRef.current = false;
                        return;
                    }
                    
                    // 再次确保没有其他实例
                    safeReleaseSoundRef();
                    
                    // 设置当前实例
                    soundRef.current = sound;

                    const duration = sound.getDuration();
                    console.log('音乐总时长:', duration, '秒');
                    setDurationTime(duration * 1000);
                    
                    const playingSong = useMusicPlayer.playingList[useMusicPlayer.playingIndex];
                    const name = `${playingSong.name} ${playingSong.tns?.length ? `(${playingSong.tns[0]})` : ''} ${playingSong.alia?.length ? `(${playingSong.alia[0]})` : ''}`;
                    const artist = playingSong.ar.map(item => item.name).join('/') + '-' + playingSong.al.name;
                    setMiniPlayer(name, artist, 0, convertHttpToHttps(playingSong.al.picUrl));
                    
                    // 创建定时器
                    let interval: NodeJS.Timeout | null = setInterval(() => {
                        // 检查 sound 是否还有效
                        if (!soundRef.current || soundRef.current !== sound) {
                            if (interval) {
                                clearInterval(interval);
                                interval = null;
                            }
                            return;
                        }
                        
                        sound.getCurrentTime((currentTime) => {
                            setProgress(currentTime / duration * 100);
                            setCurrentTime(currentTime * 1000);
                        });
                    }, 200);
                    
                    // 播放音频
                    useMusicPlayer.playStatus = 'play';
                    sound.play((success) => {
                        // 如果这个实例已不是当前实例，不处理
                        if (soundRef.current !== sound) {
                            return;
                        }
                        
                        useMusicPlayer.playStatus = 'stop';
                        
                        if (success) {
                            console.log('Sound played successfully');
                            
                            // 根据播放模式处理歌曲完成后的行为
                            handleSongCompletion(interval);
                        } else {
                            console.log('Sound playback failed');
                            
                            // 清理
                            if (interval) {
                                clearInterval(interval);
                                interval = null;
                            }
                        }
                    });
                    
                    // 释放锁
                    playLockRef.current = false;
                    
                    // 清理函数
                    return () => {
                        if (interval) {
                            clearInterval(interval);
                            interval = null;
                        }
                    };
                });
            })
            .catch(error => {
                if (error.message !== 'AbortError') {
                    console.error('Error fetching song URL:', error);
                }
                playLockRef.current = false;
            });
        
        // 返回清理函数
        return () => {
            // 标记当前加载过程已取消
            isCancelled = true;
            
            // 如果ID已更改，取消当前请求
            if (currentLoadingId === currentLoadingIdRef.current && controllerRef.current) {
                controllerRef.current.abort();
                controllerRef.current = null;
            }
        };
    }, [musicPlayer.playingId, safeReleaseSoundRef]);

    useEffect(() => {
        if (useMusicPlayer.playingList.length === 0) {
            hideMiniPlayer()
        } else {
            showMiniPlayer()
        }
    }, [musicPlayer.playingList])
    const changeSoundPlaying = useCallback(() => {
        console.log(playLockRef.current, "playLock");
        
        // 如果没有音频实例但有播放列表，加载当前歌曲
        if (!soundRef.current && useMusicPlayer.playingList[useMusicPlayer.playingIndex]) {
            useMusicPlayer.playingId = useMusicPlayer.playingList[useMusicPlayer.playingIndex].id;
            return;
        }
        
        // 如果锁定中，不执行操作
        if (playLockRef.current) return;
        
        // 播放/暂停切换
        if (soundRef.current!.isPlaying()) {
            soundRef.current!.pause(() => {
                useMusicPlayer.playStatus = 'stop';
            });
        } else {
            soundRef.current!.play();
            useMusicPlayer.playStatus = 'play';
        }
    }, []);

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

    // 打开播放列表
    const openPlayingSongList = useCallback(() => {
        playingSongListRef.current?.expand();
    }, []);

    // 修改 handleSongCompletion 函数，使用 async/await 更清晰
    const handleSongCompletion = async (interval: NodeJS.Timeout | null) => {
        // 清理定时器
        if (interval) {
            clearInterval(interval);
        }
        
        if (useMusicPlayer.playingList.length === 0) return;
        if (!soundRef.current) return;
        
        // 获取当前播放模式
        const currentPlayingType = await getItem('playingType');
        
        // 判断是否是单曲循环或只有一首歌的情况
        const isOneSongLoop = currentPlayingType === PLAYING_LIST_TYPE.LOOP_ONE || 
            (currentPlayingType === PLAYING_LIST_TYPE.LOOP && useMusicPlayer.playingList.length === 1) ||
            (currentPlayingType === PLAYING_LIST_TYPE.RANDOM && useMusicPlayer.playingList.length === 1);
        
        const playingList = useMusicPlayer.playingList;
        const currentIndex = useMusicPlayer.playingIndex;
        
        console.log("播放完成，当前模式:", currentPlayingType);
        
        // 根据播放模式处理
        if (isOneSongLoop) {
            // 单曲循环：重置播放进度并重新播放
            soundRef.current.setCurrentTime(0);
            
            // 创建新的定时器
            const newInterval = setInterval(() => {
                if (soundRef.current) {
                    soundRef.current.getCurrentTime((time) => {
                        const duration = soundRef.current!.getDuration();
                        setProgress(time / duration * 100);
                        setCurrentTime(time * 1000);
                    });
                } else {
                    clearInterval(newInterval);
                }
            }, 200);
            
            // 播放并设置回调
            soundRef.current.play(async (success) => {
                if (soundRef.current) {
                    useMusicPlayer.playStatus = 'stop';
                    
                    if (success) {
                        console.log('循环播放完成');
                        await handleSongCompletion(newInterval);
                    } else {
                        console.log('循环播放失败');
                        clearInterval(newInterval);
                    }
                }
            });
            
            useMusicPlayer.playStatus = 'play';
        } else {
            // 非单曲循环：释放资源
            const sound = soundRef.current;
            soundRef.current = null;
            
            sound.release();
            setProgress(100);
            
            // 根据播放模式选择下一首
            if (currentPlayingType === PLAYING_LIST_TYPE.LOOP) {
                // 列表循环
                const nextIndex = (currentIndex + 1) % playingList.length;
                useMusicPlayer.playingIndex = nextIndex;
                useMusicPlayer.playingId = playingList[nextIndex].id;
            } else if (currentPlayingType === PLAYING_LIST_TYPE.RANDOM) {
                // 随机播放
                let nextRandomIndex;
                if (playingList.length > 1) {
                    do {
                        nextRandomIndex = getCryptoRandomInt(0, playingList.length - 1);
                    } while (nextRandomIndex === currentIndex);
                } else {
                    nextRandomIndex = 0;
                }
                
                useMusicPlayer.playingIndex = nextRandomIndex;
                useMusicPlayer.playingId = playingList[nextRandomIndex].id;
            }
        }
    };
    
    const contextValue: MiniPlayerContextValue = {
        setMiniPlayer,
        hideMiniPlayer,
        updateProgress,
        showMiniPlayer,
        getMiniPlayer,
        changeSoundPlaying,
    };


    return (
        <MiniPlayerContext.Provider value={contextValue}>
            {children}
            {isVisible && (
                <Pressable onPress={openMusicPlayer}>
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

                                <TouchableOpacity style={styles.listButton} onPress={openPlayingSongList}>
                                    <List color="#fff" size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Pressable>
            )}
            
            {/* 集成 PlayingSongList 组件 */}
            <PlayingSongList ref={playingSongListRef} />
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