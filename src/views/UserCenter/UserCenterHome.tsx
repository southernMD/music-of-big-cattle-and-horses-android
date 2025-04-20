//orpheuswidget://

import { UserCenterStackParamList } from "@/types/NavigationType";
import { getCredentials } from "@/utils/keychain";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, NativeScrollEvent, NativeSyntheticEvent, DeviceEventEmitter, Animated, StyleSheet, LayoutChangeEvent } from "react-native";
import { useUserCenter } from '@/store/index'
import ProfileHeader from "@/components/UserCenter/ProfileHeader";
import { ActionBar } from "@/components/UserCenter/ActionBar";
import AppSS from './ss'
import { useSharedValue, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import TabBar from "@/components/UserCenter/TabBar";
import PlaylistItem from "@/components/PlaylistItem";
import { useTheme } from "@/hooks/useTheme";
//orpheus://

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
    const { uid } = route.params; // 获取传递的 uid 参数
    console.log(uid, "头顶尖尖页面");
    const pullOffset = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const { box } = useTheme()
    const [translateY, setTranslateY] = useState(0)
    const BaseTop = useRef(0)
    const HEADER_BAR_HEIGHT = 56;
    const TabBarLayoutBar = (event: LayoutChangeEvent) => {
        const { y } = event.nativeEvent.layout
        BaseTop.current = y
    }
    const Scrolling = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        //0 - 80 
        const { y } = event.nativeEvent.contentOffset;
        scrollY.value = y
        if (y <= 80) {
            useUserCenter.scrollY = y;
        } else {
            useUserCenter.scrollY = 80;
        }
        if(BaseTop.current - y <= HEADER_BAR_HEIGHT && BaseTop.current - y >=0){
            setTranslateY(y - BaseTop.current + HEADER_BAR_HEIGHT)
        }else if(BaseTop.current - y < 0){
            setTranslateY(HEADER_BAR_HEIGHT)
        }else{
            setTranslateY(0)
        }
    }
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

    const composedGesture = Gesture.Simultaneous(
        panGesture,
        Gesture.Native()
    );
    const [activeTab, setActiveTab] = useState('music');

    const styles = StyleSheet.create({
        list: {
            padding: 16,
            backgroundColor: box.background.middle
        }
    })
    //歌单 播客 收藏
    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.ScrollView
                onScroll={Scrolling}
                stickyHeaderIndices={[1]}
            >
                <ProfileHeader pullOffset={pullOffset} />

                <TabBar
                    translateY={translateY}
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
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, odio quidem obcaecati impedit fugit adipisci architecto commodi expedita libero. Commodi repudiandae quisquam, saepe corrupti vero excepturi enim nemo dignissimos similique?
                </Text>
            </Animated.ScrollView>
        </GestureDetector>
    );
};