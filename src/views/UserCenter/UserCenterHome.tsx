import { UserCenterStackParamList } from "@/types/NavigationType";
import { RouteProp, useRoute } from "@react-navigation/native";
import { memo, useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    LayoutChangeEvent,
    FlatList,
} from "react-native";
import { useBasicApi, useUserCenter } from "@/store/index";
import ProfileHeader from "@/components/UserCenter/ProfileHeader";
import { useTheme } from "@/hooks/useTheme";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import PlaylistItem from "@/components/PlaylistItem";
import Animated, {
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import TabBar from "@/components/UserCenter/TabBar";
import { userProfile } from "@/types/user/user";
import { getDetail, userDj, userPlaylist } from "@/api";
import { useLoadingModal } from "@/context/LoadingModalContext";
import { playListItem } from "@/types/api/playListItem";
import { convertHttpToHttps } from "@/utils/fixHttp";
import { djItem } from "@/types/api/djItem";
import { InteractionManager } from "react-native";
import { useThrottleCallback } from "@/hooks/useThrottleCallback";

const UserCenterHome: React.FC = () => {
    const route = useRoute<RouteProp<UserCenterStackParamList>>();
    const { uid } = route.params;
    console.log(uid, "头顶尖尖页面");

    const { box } = useTheme();
    const scrollY = useSharedValue(0);
    const pullOffset = useSharedValue(0);
    const HEADER_BAR_HEIGHT = 56;
    const BaseTop = useRef(0);
    const [translateY, setTranslateY] = useState(0);
    const TabBarLayoutBar = (event: LayoutChangeEvent) => {
        const { y } = event.nativeEvent.layout;
        BaseTop.current = y;
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
            setTranslateY(HEADER_BAR_HEIGHT);
        } else {
            setTranslateY(0);
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

    const [activeTab, setActiveTab] = useState("music");

    const styles = StyleSheet.create({
        list: {
            paddingHorizontal: 16,
            backgroundColor: box.background.middle,
        },
    });

    const [finialProfile, setFinialProfile] = useState<userProfile | null>(null);
    const { showLoadingModal } = useLoadingModal();

    useEffect(() => {
        if (useBasicApi.profile?.userId === uid) {
            setFinialProfile(useBasicApi.profile);
        } else {
            const { clear } = showLoadingModal();
            getDetail(uid).then((res) => {
                setFinialProfile(res.profile);
                clear();
            });
        }
    }, [route.params]);

    const [finialPlayList, setFinialPlayList] = useState<
        Array<playListItem | djItem>
    >([]);
    const [userlayList, setUserPlayList] = useState<playListItem[]>([]);
    const [userStartPlayList, setUserStartPlayList] = useState<playListItem[]>(
        []
    );
    const [userCreateDj, setUserCreateDj] = useState<djItem[]>([]);
    const [limit, setLimit] = useState(5);
    const [offset, setOffset] = useState(0);
    const [isDataReady, setIsDataReady] = useState(false);

    useEffect(() => {
        Promise.all([
            userPlaylist(uid).then(({ playlist }) => {
                const index = playlist.findIndex(
                    (item) => item.creator.userId !== uid
                );
                if (index === -1) {
                    setUserPlayList(playlist);
                    setUserStartPlayList([]);
                } else {
                    setUserPlayList(playlist.slice(0, index));
                    setUserStartPlayList(playlist.slice(index));
                }
            }),
            userDj(uid).then((res) => {
                setUserCreateDj(res.djRadios);
            }),
        ]).then(() => {
            setIsDataReady(true);
        });
    }, []);

    useEffect(() => {
        if (!isDataReady) return;

        switch (activeTab) {
            case "music":
                InteractionManager.runAfterInteractions(() => {
                    setFinialPlayList(userlayList);
                });
                break;
            case "broadcast":
                InteractionManager.runAfterInteractions(() => {
                    setFinialPlayList(userCreateDj);
                });
                break;
            case "start":
                InteractionManager.runAfterInteractions(() => {
                    setFinialPlayList(userStartPlayList);
                });
                break;
        }
    }, [activeTab, isDataReady]);

    const tabs = useMemo(() => [
        { key: "music", name: "音乐" },
        { key: "broadcast", name: "播客" },
        { key: "start", name: "收藏" },
    ], []);
    const throttledTabChange = useThrottleCallback((tabKey: string) => {
        console.log(tabKey,'hnimmmamaa');
        setActiveTab(tabKey);
      }, 1000);
      
    return (
        <View>
            {/* 顶部悬浮TabBar */}
            <View style={{ opacity: translateY === 0 ? 0 : 1 }}>
                <TabBar
                    position="absolute"
                    translateY={translateY}
                    activeTab={activeTab}
                    onTabChange={throttledTabChange}
                    tabs={tabs}
                />
            </View>

            {/* 主列表 */}
            <GestureDetector gesture={composedGesture}>
                <FlatList
                    data={finialPlayList}
                    keyExtractor={(item) => item.id.toString()}
                    onScroll={Scrolling}
                    scrollEventThrottle={16}
                    removeClippedSubviews={false} 
                    ListHeaderComponent={
                        <>
                            <ProfileHeader pullOffset={pullOffset} profile={finialProfile} />
                            <TabBar
                                position="relative"
                                activeTab={activeTab}
                                onTabChange={throttledTabChange}
                                tabs={tabs}
                                onLayout={TabBarLayoutBar}
                            />
                        </>
                    }
                    renderItem={({ item }) => {
                        const imageUrl =
                            (item as playListItem).coverImgUrl ??
                            (item as djItem).picUrl;
                        const songNumber =
                            (item as playListItem).trackCount ??
                            (item as djItem).programCount;
                        const playOrStartNumber = 
                            (item as djItem).subCount ??
                            (item as playListItem).playCount 
                        return (
                            <View style={styles.list}>
                                <PlaylistItem
                                    type={(item as djItem).dj ?'dj':'song'}
                                    image={convertHttpToHttps(imageUrl)}
                                    title={item.name}
                                    count={songNumber}
                                    plays={playOrStartNumber}
                                    onPress={() => console.log("Playlist pressed:", item.name)}
                                />
                            </View>
                        );
                    }}
                />
            </GestureDetector>
        </View>
    );
};

export default memo(UserCenterHome);
