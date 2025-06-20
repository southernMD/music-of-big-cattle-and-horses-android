import React, { createContext, useState, useContext, memo, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Dimensions, BackHandler, InteractionManager } from 'react-native';
import { List, Pause, Play } from 'lucide-react-native';
import { ParamListRoute } from '@react-navigation/native';
import { FOOTER_BAR_HEIGHT, NEED_FOOTER_BAR_ROUTE } from '@/constants/bar';
import { useSnapshot } from 'valtio';
import { useMusicPlayer } from '@/store';
import { SongUrl } from '@/api';
import { convertHttpToHttps } from '@/utils/fixHttp';
import FastImage from 'react-native-fast-image';
import Svg, { Circle } from 'react-native-svg';
import { getItem, usePersistentStore } from '@/hooks/usePersistentStore';
import ImageColors from 'react-native-image-colors';
import { AndroidImageColors } from 'react-native-image-colors/lib/typescript/types';
import { FlatList } from 'react-native-gesture-handler';
import LevelScrollView, { LevelScrollViewRef } from '@/components/StickBarScrollingFlatList/LevelScrollView';
import { useSharedValue } from 'react-native-reanimated';
import PlayingSongList from '@/components/PlayingSongList';
import { createRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { getCryptoRandomInt } from '@/utils/getCryptoRandomInt';
import { DEFAULT_MUSIC_NAME, PLAYING_LIST_TYPE } from '@/constants/values';
import { useAppTheme } from '@/context/ThemeContext';
import { getCurrentPlayMode } from '@/utils/playModeUtils';
import { PlayerEmitter, setupPlayer } from '@/backgroundTasks/TrackPlayerService';
import TrackPlayer, { useProgress, usePlaybackState, RepeatMode, PlaybackActiveTrackChangedEvent } from 'react-native-track-player';
import { Event, State } from 'react-native-track-player';
import { Song } from '@/types/Song';
import { djItemSong } from '@/types/api/djItem';
import { Toast } from '@ant-design/react-native';

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
    playNext: () => void;
    playPrev: () => void;
    removeFromPlayingList:(id:number,index:number) => void;
    removeAllFromPlayingList:() => void;
    updatePlayingList:(newList: (Song | djItemSong)[]) => void;
    loadAndPlaySongById:(id: number) => void;
}

interface MusicPlayerProps { 
    children: React.ReactNode;
    currentRoute: ParamListRoute<any>;
    openMusicPlayer: () => void;
    goBack:()=> void;
}

const MiniPlayerContext = createContext<MiniPlayerContextValue>({
    setMiniPlayer: () => { },
    hideMiniPlayer: () => { },
    updateProgress: () => { },
    getMiniPlayer: () => { return { title: '', artist: '', progress: 0, cover: '', currentTime: 0, durationTime: 0 } },
    showMiniPlayer: () => { },
    changeSoundPlaying: () => { },
    playNext: () => { },
    playPrev: () => { },
    removeFromPlayingList:() => {},
    removeAllFromPlayingList:() => {},
    updatePlayingList:() => {},
    loadAndPlaySongById:() => {}
});

const SIZE = 25;
const STROKE_WIDTH = 2;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const { width: screenWidth } = Dimensions.get('window');
const rowWidth = screenWidth * 0.75; // styles.row 的宽度

// 创建一个全局引用用于存储playNext和playPrev函数的引用
const playerControlRef = {
    playNext: null as any,
    playPrev: null as any
};

// 设置PlayerEmitter监听器，调用playerControlRef中存储的函数
PlayerEmitter.on('next', () => {
    console.log('我收到了下一曲');
    if (playerControlRef.playNext) {
        playerControlRef.playNext();
    }
});

PlayerEmitter.on('prev', () => {
    console.log('我收到了上一曲');
    if (playerControlRef.playPrev) {
        playerControlRef.playPrev();
    }
});

// 创建一个全局引用，这样可以从任何地方控制底部弹出层
export const playingSongListRef = createRef<BottomSheet>();

export const MiniPlayerProvider: React.FC<MusicPlayerProps> = memo(({ children, currentRoute, openMusicPlayer,goBack }) => {
    const theme = useAppTheme(); // 获取主题
    const isDark = usePersistentStore<boolean>('isDark');
    const [isVisible, setIsVisible] = useState(false);
    const [title, setTitle] = useState(DEFAULT_MUSIC_NAME);
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
    const controllerRef = useRef<AbortController | null>(null); // 添加 AbortController 的 ref
    const currentLoadingIdRef = useRef<number>(-1); // 跟踪当前正在加载的歌曲ID
    const playLockRef = useRef<boolean>(false); // 使用 ref 来管理锁定状态
    const playingType = usePersistentStore<string>('playingType');
    useEffect(() => {
        if(playingType === PLAYING_LIST_TYPE.LOOP_ONE || useMusicPlayer.playingList.length === 1){
            TrackPlayer.setRepeatMode(RepeatMode.Track);
            console.log('设置为无限循环');
        }else{
            TrackPlayer.setRepeatMode(RepeatMode.Queue);
            console.log('设置为自然播放');
        }
    }, [playingType])

    // 初始化 Track Player
    useEffect(() => {
        let isSetup = false;
        
        // 设置播放器
        const setup = async () => {
            isSetup = await setupPlayer() as boolean;
        };
        
        setup();
        
        // 清理函数
        return () => {
            if (isSetup) {
                TrackPlayer.reset();
            }
        };
    }, []);
    
    // 添加一个 ref 来跟踪重试次数和当前正在重试的歌曲 ID
    const retryCountRef = useRef<{count: number, id: number}>({count: 0, id: -1});
    
    // 加载并播放歌曲的函数
    const loadAndPlaySongById = async (playingId: number) => {
        if (playingId <= 0) return;
        
        TrackPlayer.pause();
        console.log(`开始加载歌曲: ${playingId}`);
        TrackPlayer.setVolume(1);
        
        // 记录当前正在加载的歌曲ID
        const currentLoadingId = playingId;
        currentLoadingIdRef.current = currentLoadingId;

        // 设置锁
        playLockRef.current = true;
        
        // 取消之前的请求
        if (controllerRef.current) {
            console.log('取消之前的请求');
            controllerRef.current.abort();
            controllerRef.current = null;
        }
        
        // 创建新的控制器
        const controller = new AbortController();
        controllerRef.current = controller;
        
        try {
            const { data } = await SongUrl(currentLoadingId, controller);
            
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
            
            // 再次检查
            if (currentLoadingId !== currentLoadingIdRef.current) {
                console.log('ID已更改');
                playLockRef.current = false;
                return;
            }

            // 获取当前播放歌曲信息
            const playingSong = useMusicPlayer.playingList[useMusicPlayer.playingIndex];
            
            const name = 'dj' in playingSong ? playingSong.name : `${playingSong.name} ${playingSong.tns?.length ? `(${playingSong.tns[0]})` : ''} ${playingSong.alia?.length ? `(${playingSong.alia[0]})` : ''}`;
            const artist = 'ar' in playingSong ? 
                        playingSong.ar.map(item => item.name).join('/') : 
                        playingSong.dj.nickname;
            
            // 更新播放信息
            useMusicPlayer.playingName = name;
            useMusicPlayer.playingAl = 'al' in playingSong ? 
                                    {id:playingSong.al.id,name:playingSong.al.name}: 
                                    {id:playingSong.radio.id,name:playingSong.radio.name};
            useMusicPlayer.playingAr = 'ar' in playingSong ? 
                                    playingSong.ar.map(item => ({id:item.id,name:item.name})):
                                    [{id:playingSong.dj.userId,name:playingSong.dj.nickname}];
            setMiniPlayer(name, 
                artist + '-' + ('al' in playingSong ? playingSong.al.name : playingSong.radio.name),
                0,
                convertHttpToHttps('al' in playingSong ? playingSong.al.picUrl : playingSong.coverUrl)
            );
            
            let TrackQueue = [];
            // 添加将要播放歌曲到 TrackPlayer
            TrackQueue.push({
                id: 'dj' in playingSong ? playingSong.mainTrackId : playingSong.id,
                url: httpSong,
                title: name,
                artist: artist,
                album: 'al' in playingSong ? playingSong.al.name : playingSong.radio.name,
                artwork: convertHttpToHttps('al' in playingSong ? playingSong.al.picUrl : playingSong.coverUrl),
                duration: 0, 
            });
            
            //计算下一首曲目
            const currentPlayingType = await getItem('playingType');
            
            if(currentPlayingType === PLAYING_LIST_TYPE.LOOP_ONE || useMusicPlayer.playingList.length === 1 || currentPlayingType === PLAYING_LIST_TYPE.LOOP){
                const nextIndex = (useMusicPlayer.playingIndex + 1) % useMusicPlayer.playingList.length;
                const nextSong = useMusicPlayer.playingList[nextIndex];
                const nextName = 'dj' in nextSong ? `${nextSong.name}`: `${nextSong.name} ${nextSong.tns?.length ? `(${nextSong.tns[0]})` : ''} ${nextSong.alia?.length ? `(${nextSong.alia[0]})` : ''}`;
                const nextArtist = 'ar' in nextSong ? nextSong.ar.map(item => item.name).join('/') : nextSong.dj.nickname;
                const nexSong = useMusicPlayer.playingList[nextIndex];
                TrackQueue.push({
                    id: 'dj' in nexSong ? nexSong.mainTrackId : nexSong.id,
                    url: httpSong,
                    title: nextName,
                    artist: nextArtist,
                    album: 'al' in nextSong ? nextSong.al.name : nextSong.radio.name,
                    artwork: convertHttpToHttps('al' in nextSong ? nextSong.al.picUrl : nextSong.coverUrl),
                    duration: 0, 
                });
            } else if(currentPlayingType === PLAYING_LIST_TYPE.RANDOM){
                let randomIndex;
                do {
                    randomIndex = getCryptoRandomInt(0, useMusicPlayer.playingList.length - 1);
                } while (randomIndex === useMusicPlayer.playingIndex);
                const randomSong = useMusicPlayer.playingList[randomIndex];
                const randomName = 'dj' in randomSong ? `${randomSong.name}`: `${randomSong.name} ${randomSong.tns?.length ? `(${randomSong.tns[0]})` : ''} ${randomSong.alia?.length ? `(${randomSong.alia[0]})` : ''}`;
                const randomArtist = 'ar' in randomSong ? randomSong.ar.map(item => item.name).join('/') : randomSong.dj.nickname;
                TrackQueue.push({
                    id: 'dj' in randomSong? randomSong.mainTrackId : randomSong.id,
                    url: httpSong,
                    title: randomName,
                    artist: randomArtist,
                    album: 'al' in randomSong ? randomSong.al.name : randomSong.radio.name,
                    artwork: convertHttpToHttps('al' in randomSong ? randomSong.al.picUrl : randomSong.coverUrl),
                    duration: 0, 
                });
            }
            
            TrackQueue.push({
                id: new Date().getTime(),
                url: "https://www.southernmd.top",
                title: "好音乐用牛马",
                artist: "",
                album: "",
                artwork: "icon",
            });
            
            await TrackPlayer.setQueue(TrackQueue);
            await TrackPlayer.seekTo(0);
            await TrackPlayer.play();
            useMusicPlayer.playStatus = 'play';

            // 设置播放模式
            if (currentPlayingType === PLAYING_LIST_TYPE.LOOP_ONE || 
                (useMusicPlayer.playingList.length === 1)) {
                console.log("是单曲循环");
                await TrackPlayer.setRepeatMode(RepeatMode.Track);
            } else {
                console.log("是列表循环");
                await TrackPlayer.setRepeatMode(RepeatMode.Queue);
            }
        } catch (error: any) {
            if (error.message !== 'AbortError') {
                console.error('Error fetching song URL or playing track:', error);
            }
        } finally {
            // 释放锁
            playLockRef.current = false;
        }
    };
    useEffect(()=>{
        // 添加事件监听器并保存返回的订阅对象
        const subscription = TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
            if(event.state === State.Error){
                if(event.error.code === "android-io-bad-http-status"){
                    // 检查是否是同一首歌的重试
                    if(retryCountRef.current.id === useMusicPlayer.playingId) {
                        // 增加重试次数
                        retryCountRef.current.count++;
                        console.log(`重试播放歌曲 ${useMusicPlayer.playingId}，第 ${retryCountRef.current.count} 次尝试`);
                        
                        // 如果重试次数小于 3，则重新加载歌曲
                        if(retryCountRef.current.count < 3) {
                            loadAndPlaySongById(useMusicPlayer.playingId);
                        } else {
                            console.warn(`歌曲 ${useMusicPlayer.playingId} 重试次数已达上限 (3次)，不再重试`);
                            Toast.fail('无法播放歌曲');
                        }
                    } else {
                        // 新的歌曲，重置重试计数器
                        retryCountRef.current = {count: 1, id: useMusicPlayer.playingId};
                        console.log(`开始重试播放歌曲 ${useMusicPlayer.playingId}，第 1 次尝试`);
                        loadAndPlaySongById(useMusicPlayer.playingId);
                    }
                }
            }
        });
        
        // 在组件卸载时移除事件监听器
        return () => {
            // 如果订阅对象有 remove 方法，则调用它
            if (subscription && typeof subscription.remove === 'function') {
                subscription.remove();
            }
        };
    },[])
    
    // 当播放ID变化时加载并播放歌曲
    useEffect(() => {
        // 重置重试计数器
        retryCountRef.current = {count: 0, id: musicPlayer.playingId};
        
        // 加载并播放歌曲
        loadAndPlaySongById(musicPlayer.playingId);
        
        // 返回清理函数
        return () => {
            // 如果ID已更改，取消当前请求
            if (controllerRef.current) {
                controllerRef.current.abort();
                controllerRef.current = null;
            }
        };
    }, [musicPlayer.playingId]);

    useEffect(() => { 
        TrackPlayer.getQueue().then(async (queue) => {
            const nextTrack = queue[1];
            if(!nextTrack)return
            if(useMusicPlayer.playingList.length <= 1)return;
            const playType = await getItem('playingType')
            if(playType === PLAYING_LIST_TYPE.LOOP_ONE || playType === PLAYING_LIST_TYPE.LOOP){
                const nextIndex = (useMusicPlayer.playingIndex + 1) % useMusicPlayer.playingList.length;
                const nextSong = useMusicPlayer.playingList[nextIndex];
                await TrackPlayer.remove(1)
                await TrackPlayer.add({
                    id: 'dj' in nextSong? nextSong.mainTrackId:nextSong.id,
                    url: nextTrack.url,
                    title: nextSong.name,
                    artist: artist,
                    album: 'al' in nextSong ? nextSong.al.name : nextSong.radio.name,
                    artwork: convertHttpToHttps('al' in nextSong ? nextSong.al.picUrl : nextSong.coverUrl),
                    duration: 0, 
                })
            }else{
                //RANDOM
                let nextRandomIndex;
                do {
                    nextRandomIndex = getCryptoRandomInt(0, useMusicPlayer.playingList.length - 1);
                } while (nextRandomIndex === useMusicPlayer.playingIndex && useMusicPlayer.playingList.length > 1);
                const nextSong = useMusicPlayer.playingList[nextRandomIndex];
                await TrackPlayer.remove(1)
                await TrackPlayer.add({
                    id: 'dj' in nextSong? nextSong.mainTrackId:nextSong.id,
                    url: nextTrack.url,
                    title: nextSong.name,
                    artist: artist,
                    album: 'al' in nextSong ? nextSong.al.name : nextSong.radio.name,
                    artwork: convertHttpToHttps('al' in nextSong ? nextSong.al.picUrl : nextSong.coverUrl),
                    duration: 0, 
                })
            }
        })
    }, [musicPlayer.playingList]);

    useEffect(() => {
        if (useMusicPlayer.playingList.length === 0) {
            hideMiniPlayer()
        } else {
            showMiniPlayer()
        }
    }, [musicPlayer.playingList])

    // 使用 usePlaybackState hook
    const playbackState = usePlaybackState();

    // 修改 changeSoundPlaying 函数
    const changeSoundPlaying = useCallback(async () => {
        console.log(playLockRef.current, "playLock");
        
        // 如果锁定中，不执行操作
        if (playLockRef.current) return;
        
        try {
            // 使用 playbackState 替代 TrackPlayer.getState()
            if (playbackState.state === State.Playing) {
                await TrackPlayer.pause();
            } else {
                await TrackPlayer.play();
            }
        } catch (error) {
            console.error('切换播放状态失败:', error);
        }
    }, [playbackState.state]);

    useEffect(() => {
        ImageColors.getColors(cover, { fallback: '#000000' }).then((colors) => {
            console.log(colors);
            useMusicPlayer.playingSongAlBkColor = (colors as AndroidImageColors)
        });
    }, [cover])

    const handleOpenMusicPlayer = () => {
        hideMiniPlayer()
        openMusicPlayer()
    }

    // 打开播放列表
    const openPlayingSongList = useCallback(() => {
        // 直接使用snapToIndex(0)来打开底部表单到70%
        // 这样避免了expand可能导致的多阶段动画问题
        if (playingSongListRef.current) {
            playingSongListRef.current.snapToIndex(0);
        }
    }, []);


    //播放下一首
    const playNext = useCallback(async () => {
        // 如果没有播放列表，直接返回
        if (useMusicPlayer.playingList.length <= 0) return;
        
        // 如果正在加载中，不执行操作
        if (playLockRef.current) return;
        await TrackPlayer.pause();
        await TrackPlayer.setVolume(0)
        
        const playingList = useMusicPlayer.playingList;
        
        // 获取当前播放模式
        
        // 如果只有一首歌，重新开始播放当前歌曲
        if (playingList.length === 1) {
            TrackPlayer.seekTo(0)
            return;
        }
        
        // 下一首已经提前计算因此直接下一首
        TrackPlayer.skipToNext()
    }, []);

    //播放上一首
    const playPrev = useCallback(async () => {
        // 如果没有播放列表，直接返回
        if (useMusicPlayer.playingList.length <= 0) return;
        
        // 如果正在加载中，不执行操作
        if (playLockRef.current) return;
        await TrackPlayer.pause();
        await TrackPlayer.setVolume(0)
        
        const playingList = useMusicPlayer.playingList;
        const currentIndex = useMusicPlayer.playingIndex;
        
        // 获取当前播放模式
        const currentPlayingType = await getItem('playingType');
        
        // 如果只有一首歌，重新开始播放当前歌曲
        if (playingList.length === 1) {
            TrackPlayer.seekTo(0)
            return;
        }
        
        // 根据播放模式选择上一首
        if (currentPlayingType === PLAYING_LIST_TYPE.RANDOM) {
            // 随机播放模式：随机选择一首不同的歌（与 playNext 相同逻辑）
            let nextRandomIndex;
            do {
                nextRandomIndex = getCryptoRandomInt(0, playingList.length - 1);
            } while (nextRandomIndex === currentIndex && playingList.length > 1);
            
            const song = playingList[nextRandomIndex]

            useMusicPlayer.playingIndex = nextRandomIndex;
            useMusicPlayer.playingId = 'dj' in song ? song.mainTrackId: song.id
        } else {
            // 列表循环或单曲循环：播放上一首
            const prevIndex = (currentIndex - 1 + playingList.length) % playingList.length;
            const song = playingList[prevIndex]

            useMusicPlayer.playingIndex = prevIndex;
            useMusicPlayer.playingId = 'dj' in song ? song.mainTrackId: song.id
        }
    }, []);

    //从播放列表中移除歌曲
    const removeFromPlayingList = useCallback(async (id: number,index:number) => { 
        console.log(id,index);
        useMusicPlayer.playingList.splice(index, 1);
        if(index < useMusicPlayer.playingIndex){
            useMusicPlayer.playingIndex--;
        }else{
            const nextSong = useMusicPlayer.playingList[useMusicPlayer.playingIndex]
            useMusicPlayer.playingId = 'dj' in nextSong ? nextSong.mainTrackId : nextSong.id
        }
    }, [musicPlayer.playingList,musicPlayer.playingId,musicPlayer.playingIndex]);
    
    //移除全部的歌曲
    const removeAllFromPlayingList = useCallback(async () => {
        useMusicPlayer.clearPlayingList()
        setMiniPlayer(DEFAULT_MUSIC_NAME,'',0,isDark ? 'icon' : 'icon_red')
        hideMiniPlayer()
        if(currentRoute.name === 'MusicPlayer') goBack()
        await TrackPlayer.reset();
        console.log(currentRoute,"????????");
    }, [currentRoute]);

    // 更新playerControlRef，使外部PlayerEmitter可以调用组件内部的函数
    useEffect(() => {
        playerControlRef.playNext = playNext;
        playerControlRef.playPrev = playPrev;
        
        return () => {
            // 组件卸载时清空引用
            playerControlRef.playNext = null;
            playerControlRef.playPrev = null;
        };
    }, [playNext, playPrev]);

    const updatePlayingList = useCallback((newList: (Song | djItemSong)[]) => {
        InteractionManager.runAfterInteractions(()=>{
            // 保存当前播放的歌曲ID
            const currentPlayingId = useMusicPlayer.playingId;
            
            // 更新播放列表
            useMusicPlayer.playingList = newList;
            
            // 找到当前播放歌曲在新列表中的索引
            const newPlayingIndex = newList.findIndex(item => item.id === currentPlayingId);
            
            // 更新播放索引
            if (newPlayingIndex !== -1) {
                useMusicPlayer.playingIndex = newPlayingIndex;
            }
        })

    }, [musicPlayer.playingId]);
    
    const contextValue: MiniPlayerContextValue = {
        setMiniPlayer,
        hideMiniPlayer,
        updateProgress,
        showMiniPlayer,
        getMiniPlayer,
        changeSoundPlaying,
        playNext,
        playPrev,
        removeFromPlayingList,
        removeAllFromPlayingList,
        updatePlayingList,
        loadAndPlaySongById
    };

    // 使用主题创建样式
    const styles = useMemo(() => createStyles(theme), [theme]);

    // 使用 TrackPlayer 的 useProgress hook
    const { position, duration } = useProgress();
    
    // 更新进度和时间
    useEffect(() => {
        if (duration > 0) {
            setProgress((position / duration) * 100);
            setCurrentTime(position * 1000); // 转换为毫秒
            setDurationTime(duration * 1000); // 转换为毫秒
        }
    }, [position, duration]);

    return (
        <MiniPlayerContext.Provider value={contextValue}>
            {children}
            {isVisible && (
                <Pressable onPress={handleOpenMusicPlayer}>
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
                                            stroke={theme.typography.colors.small.default}
                                            strokeWidth={STROKE_WIDTH}
                                            fill="none"
                                        />
                                        <Circle
                                            cx={SIZE / 2}
                                            cy={SIZE / 2}
                                            r={RADIUS}
                                            stroke={theme.colors.primary}
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
                                                <Pause color={theme.typography.colors.large.default} size={16} fill={theme.typography.colors.large.default} />
                                                : <Play color={theme.typography.colors.large.default} size={16} fill={theme.typography.colors.large.default} />
                                        }
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.listButton} onPress={openPlayingSongList}>
                                    <List color={theme.typography.colors.large.default} size={24} />
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
    const theme = useAppTheme(); // 获取主题
    const styles = useMemo(() => createStyles(theme), [theme]);
    
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = useAppTheme(); // 获取主题，用于SongItem组件
    const levelScrollViewRef = useRef<LevelScrollViewRef>(null)
    const horizontalScrollX = useSharedValue(0);
    
    // 添加一个状态来控制显示/隐藏
    const [isVisible, setIsVisible] = useState(true);

    const musicPlayer = useSnapshot(useMusicPlayer)

    const playingSongNearly = useMemo(() => { 
        const index = useMusicPlayer.playingIndex
        if(index === -1) return []
        const length = useMusicPlayer.playingList.length;
        const prevIndex = (index - 1 + length) % length;
        const nextIndex = (index + 1) % length;
        return [
            useMusicPlayer.playingList[prevIndex],
            useMusicPlayer.playingList[index],
            useMusicPlayer.playingList[nextIndex]
        ];
    }, [musicPlayer.playingList, musicPlayer.playingIndex])

    const FinishHorizontalScrollHandle = (newIndex:number, oldIndex:number) => {
        if(newIndex === oldIndex) return;
        
        // TODO: 非最佳解决办法，只是展示屏蔽了切换显示
        setIsVisible(false);
        
        const index = useMusicPlayer.playingList.findIndex(item=>item.id === playingSongNearly[newIndex].id);
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
        useMusicPlayer.playingId = 'dj' in playingSongNearly[newIndex] ? playingSongNearly[newIndex].mainTrackId : playingSongNearly[newIndex].id
        
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
                    const name = 'dj' in item ? `${item.name}`: `${item.name} ${item.tns?.length ? `(${item.tns[0]})` : ''} ${item.alia?.length ? `(${item.alia[0]})` : ''}`
                    const artist = 'ar' in item ? item.ar.map(item => item.name).join('/') + '-' + item.al.name : item.dj.nickname + '-' + item.radio.name
                    const cover = convertHttpToHttps('al' in item ? item.al.picUrl : item.coverUrl)
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

// 修改样式创建函数，接受主题参数
const createStyles = (theme: any) => StyleSheet.create({
    container: {
        backgroundColor: theme.box.background.deep,
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
        borderRadius: theme.borderRadius.rounded / 2,
    },
    info: {
        flex: 1,
        marginHorizontal: 12,
        width: '100%',
    },
    title: {
        color: theme.typography.colors.large.default,
        fontSize: theme.typography.sizes.small,
        fontWeight: '500',
    },
    artist: {
        color: theme.typography.colors.small.default,
        fontSize: theme.typography.sizes.xsmall,
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