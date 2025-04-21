import { UserCenterStackParamList } from "@/types/NavigationType";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { View, Text, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, LayoutChangeEvent } from "react-native";
import { useUserCenter } from '@/store/index';
import ProfileHeader from "@/components/UserCenter/ProfileHeader";
import { useTheme } from "@/hooks/useTheme";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import PlaylistItem from "@/components/PlaylistItem";
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle
} from "react-native-reanimated";

import TabBar from "@/components/UserCenter/TabBar";

const playlists = [
    {
        id: '1',
        image: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: '我喜欢的音乐',
        count: 301,
        plays: 3673,
    },
    {
        id: '2',
        image: 'https://images.pexels.com/photos/1835712/pexels-photo-1835712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'nicorap netrap',
        count: 41,
        plays: 254,
    },
    {
        id: '3',
        image: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: '开发专用歌单',
        count: 84,
        plays: 62,
    },
    {
        id: '4',
        image: 'https://images.pexels.com/photos/1616096/pexels-photo-1616096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: 'ls',
        count: 2,
        plays: 24,
    },
    {
        id: '5',
        image: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        title: '@南山有壶酒的十年精选辑',
        count: 18,
        plays: 29,
    },
];


export const UserCenterHome: React.FC = () => {
    const route = useRoute<RouteProp<UserCenterStackParamList>>();
    const { uid } = route.params;
    console.log(uid, "头顶尖尖页面");

    const { box } = useTheme();
    const scrollY = useSharedValue(0);
    const pullOffset = useSharedValue(0);
    const HEADER_BAR_HEIGHT = 56;
    const BaseTop = useRef(0)
    const [translateY, setTranslateY] = useState(0)
    const TabBarLayoutBar = (event: LayoutChangeEvent) => {
        const { y } = event.nativeEvent.layout;
        BaseTop.current = y
    };

    const Scrolling = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = event.nativeEvent.contentOffset;
        scrollY.value = y;

        if (y <= 80) {
            useUserCenter.scrollY = y;
        } else {
            useUserCenter.scrollY = 80;
        }
        
        if (BaseTop.current - y <= HEADER_BAR_HEIGHT) {
            setTranslateY(HEADER_BAR_HEIGHT)
        } else {
            setTranslateY(0)
        }
    };

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (scrollY.value <= 0 && e.translationY > 0) {
                pullOffset.value = e.translationY;
            }
        })
        .onEnd(() => {
            pullOffset.value = withSpring(0, {
                stiffness: 150,
                damping: 20,
            });
        });

    const composedGesture = Gesture.Simultaneous(panGesture, Gesture.Native());

    const [activeTab, setActiveTab] = useState('music');

    const styles = StyleSheet.create({
        list: {
            padding: 16,
            backgroundColor: box.background.middle,
        }
    });

    return (
        <View>
            <View style={{opacity:translateY == 0?0:1}}>
                <TabBar
                    position='absolute'
                    translateY={translateY}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={[
                        { key: 'music', name: '音乐' },
                        { key: 'broadcast', name: '播客' },
                        { key: 'start', name: '收藏' },
                    ]}
                />
            </View>
            <GestureDetector gesture={composedGesture}>
                <Animated.ScrollView onScroll={Scrolling} scrollEventThrottle={16}>
                    <ProfileHeader pullOffset={pullOffset} />

                   <TabBar
                        position='relative'
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        tabs={[
                            { key: 'music', name: '音乐' },
                            { key: 'broadcast', name: '播客' },
                            { key: 'start', name: '收藏' },
                        ]}
                        onLayout={TabBarLayoutBar}
                    />
                    {activeTab === 'music' && (
                        <View style={styles.list}>
                            {playlists.map((playlist) => (
                                <PlaylistItem
                                    key={playlist.id}
                                    image={playlist.image}
                                    title={playlist.title}
                                    count={playlist.count}
                                    plays={playlist.plays}
                                    onPress={() => console.log('Playlist pressed:', playlist.title)}
                                />
                            ))}
                        </View>
                    )} 

                    <Text>
                        {/* 内容占位，你可以替换成更多歌单或播客 */}
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                    </Text>
                </Animated.ScrollView>
            </GestureDetector>
        </View>

    );
};
