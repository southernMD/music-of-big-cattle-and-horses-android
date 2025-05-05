import React, { createContext, useState, useContext, memo, useEffect, RefObject, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, InteractionManager } from 'react-native';
import { Play } from 'lucide-react-native';
import { NavigationContainerRef, ParamListRoute, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/NavigationType';
import { FOOTER_BAR_HEIGHT, NEED_FOOTER_BAR_ROUTE } from '@/constants/bar';

interface MiniPlayerProps {
    title: string;
    artist: string;
    progress?: number;
    onPress?: () => void;
}

interface MiniPlayerContextValue {
    setMiniPlayer: (title: string, artist: string, progress?: number, onPress?: () => void) => void;
    hideMiniPlayer: () => void;
    showMiniPlayer: () => void;
    updateProgress: (progress: number) => void;
}

const MiniPlayerContext = createContext<MiniPlayerContextValue>({
    setMiniPlayer: () => { },
    hideMiniPlayer: () => { },
    updateProgress: () => { },
    showMiniPlayer: () => { },
});

export const MiniPlayerProvider: React.FC<{ children: React.ReactNode, currentRoute?: ParamListRoute<any>  }> = memo(({ children, currentRoute }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [progress, setProgress] = useState(0);
    const [onPress, setOnPress] = useState<(() => void) | undefined>(undefined);

    const [safeNeedTransition, setSafeNeedTransition] = useState(false);
    const prevNeedTransitionRef = useRef<boolean>(false);
    
    useEffect(() => {
        const nextNeedTransition = NEED_FOOTER_BAR_ROUTE.includes(currentRoute?.name!);
        const prev = prevNeedTransitionRef.current;
    
        if (!prev && nextNeedTransition) {
            const timer = setTimeout(() => {
                setSafeNeedTransition(true);
            }, 250);
    
            return () => clearTimeout(timer);
        }
    
        if (!nextNeedTransition) {
            setSafeNeedTransition(false);
        }
    
        // 更新上一次的值
        prevNeedTransitionRef.current = nextNeedTransition;
        if(currentRoute?.name === 'MusicPlayer'){
            hideMiniPlayer()
        }else{
            // const timer = setTimeout(() => {
            //     setIsVisible(true)
            // }, 250);
    
            // return () => clearTimeout(timer);
        }
    }, [currentRoute]);
    
    const setMiniPlayer = (title: string, artist: string, progress = 0, onPress?: () => void) => {
        setTitle(title);
        setArtist(artist);
        setProgress(progress);
        setOnPress(() => onPress);
    };

    const hideMiniPlayer = () => {
        setIsVisible(false);
    };

    
    const showMiniPlayer = () => {
        setIsVisible(true);
    };

    const updateProgress = (progress: number) => {
        if (isVisible) setProgress(progress);
    };

    const contextValue: MiniPlayerContextValue = {
        setMiniPlayer,
        hideMiniPlayer,
        updateProgress,
        showMiniPlayer
    };

    return (
        <MiniPlayerContext.Provider value={contextValue}>
            {children}
            {isVisible && (
                <View style={[styles.container,{bottom:safeNeedTransition?FOOTER_BAR_HEIGHT:0}]}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progress, { width: `${progress}%` }]} />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.info}>
                            <Text style={styles.title} numberOfLines={1}>{title}</Text>
                            <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
                        </View>
                        <TouchableOpacity style={styles.playButton} onPress={onPress}>
                            <Play color="#fff" size={20} fill="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </MiniPlayerContext.Provider>
    );
});

export const useMiniPlayer = () => {
    return useContext(MiniPlayerContext);
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
    },
    progressBar: {
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    progress: {
        height: '100%',
        backgroundColor: '#fff',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
    },
    info: {
        flex: 1,
        marginRight: 16,
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
    playButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ff4757',
        alignItems: 'center',
        justifyContent: 'center',
    },
});