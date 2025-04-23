import { UserCenterStackParamList } from "@/types/NavigationType";
import { RouteProp, useRoute } from "@react-navigation/native";
import { memo, useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
    View,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    LayoutChangeEvent,
    FlatList,
    Dimensions,
} from "react-native";
import { useBasicApi, useUserCenter } from "@/store/index";
import ProfileHeader from "@/components/UserCenter/ProfileHeader";
import { useTheme } from "@/hooks/useTheme";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import PlaylistItem from "@/components/PlaylistItem";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedRef, scrollTo, withSpring, runOnJS, useDerivedValue } from "react-native-reanimated";
import TabBar from "@/components/UserCenter/TabBar";
import { userProfile } from "@/types/user/user";
import { getDetail, userDj, userPlaylist } from "@/api";
import { useLoadingModal } from "@/context/LoadingModalContext";
import { playListItem } from "@/types/api/playListItem";
import { convertHttpToHttps } from "@/utils/fixHttp";
import { djItem } from "@/types/api/djItem";
import { useThrottleCallback } from "@/hooks/useThrottleCallback";

const screenWidth = Dimensions.get("window").width;

const UserCenterHome: React.FC = () => {
    const route = useRoute<RouteProp<UserCenterStackParamList>>();
    const { uid } = route.params;
    const { box } = useTheme();
    const scrollY = useSharedValue(0);
    const pullOffset = useSharedValue(0);
    const HEADER_BAR_HEIGHT = 56;
    const BaseTop = useRef(0);
    const [translateY, setTranslateY] = useState(0);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const horizontalScrollX = useSharedValue(0);

    const styles = StyleSheet.create({
        list: {
            paddingHorizontal: 16,
            backgroundColor: box.background.middle,
        },
    });

    const TabBarLayoutBar = (event: LayoutChangeEvent) => {
        const { y } = event.nativeEvent.layout;
        BaseTop.current = y;
    };

    const Scrolling = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = event.nativeEvent.contentOffset;
        scrollY.value = y;
        useUserCenter.scrollY = y <= 80 ? y : 80;
        setTranslateY(BaseTop.current - y <= HEADER_BAR_HEIGHT ? HEADER_BAR_HEIGHT : 0);
    };

    const tabs = useMemo(() => [
        { key: "music", name: "音乐" },
        { key: "broadcast", name: "播客" },
        { key: "start", name: "收藏" },
    ], []);

    const len = useSharedValue(useMemo(() => {
        return tabs.length
    }, [tabs]))

    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const isHorizontal = useSharedValue(false);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (scrollY.value <= 0 && e.translationY > 0) {
                pullOffset.value = e.translationY;
            }
        })
        .onEnd(() => {
            pullOffset.value = withSpring(0, { stiffness: 150, damping: 20 });
        });


    const directionalPanGesture = Gesture.Pan()
        .manualActivation(true)
        .onTouchesDown((e) => {
            startX.value = e.allTouches[0].x;
            startY.value = e.allTouches[0].y;
        })
        .onTouchesMove((e, gestureStateManager) => {
            const dx = e.allTouches[0].x - startX.value;
            const dy = e.allTouches[0].y - startY.value;

            if (Math.abs(dx) > Math.abs(dy)) {
                isHorizontal.value = true;
                gestureStateManager.activate(); // 水平优先，激活手势
            } else {
                isHorizontal.value = false;
                gestureStateManager.fail(); // 不激活，走其他方向
            }
        })
        .onUpdate((e) => {
            // 做你的 horizontal 滚动逻辑
            scrollTo(scrollRef, -e.translationX + horizontalScrollX.value, 0, false);
        })
        .onEnd((e) => {
            // 跳页逻辑
            let nextIndex = Math.round((horizontalScrollX.value - e.translationX) / screenWidth);
            nextIndex = Math.max(0, Math.min(nextIndex, len.value - 1));
            scrollTo(scrollRef, nextIndex * screenWidth, 0, true);
            horizontalScrollX.value = nextIndex * screenWidth;
            runOnJS(setActiveTabIndex)(nextIndex);
        });

        const composedGesture = Gesture.Simultaneous(
            directionalPanGesture,
            panGesture,
            Gesture.Native()
        );    

    const throttledTabChange = useThrottleCallback((key: string) => {
        const index = tabs.findIndex(tab => tab.key === key);
        if (index !== -1) {
            setActiveTabIndex(index);
            scrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
            horizontalScrollX.value = index * screenWidth;
        }
    }, 1000);

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

    const [userPlayList, setUserPlayList] = useState<playListItem[]>([]);
    const [userStartPlayList, setUserStartPlayList] = useState<playListItem[]>([]);
    const [userCreateDj, setUserCreateDj] = useState<djItem[]>([]);

    useEffect(() => {
        Promise.all([
            userPlaylist(uid).then(({ playlist }) => {
                const index = playlist.findIndex(item => item.creator.userId !== uid);
                const userListRes = index === -1 ? playlist : playlist.slice(0, index);
                const userStartListRes = index === -1 ? [] : playlist.slice(index);
                setUserPlayList(userListRes);
                setUserStartPlayList(userStartListRes);
            }),
            userDj(uid).then(res => setUserCreateDj(res.djRadios)),
        ]);
    }, []);

    const contentLists = useMemo(() => [userPlayList, userCreateDj, userStartPlayList], [userPlayList, userCreateDj, userStartPlayList]);

    return (
        <View>
            <View style={{ opacity: translateY === 0 ? 0 : 1 }}>
                <TabBar
                    position="absolute"
                    translateY={translateY}
                    activeTab={tabs[activeTabIndex].key}
                    onTabChange={throttledTabChange}
                    tabs={tabs}
                />
            </View>

            <GestureDetector gesture={composedGesture}>
                <FlatList
                    data={[0]}
                    keyExtractor={() => "main"}
                    onScroll={Scrolling}
                    scrollEventThrottle={16}
                    removeClippedSubviews={false}
                    ListHeaderComponent={
                        <>
                            <ProfileHeader pullOffset={pullOffset} profile={finialProfile} />
                            <TabBar
                                position="relative"
                                activeTab={tabs[activeTabIndex].key}
                                onTabChange={throttledTabChange}
                                tabs={tabs}
                                onLayout={TabBarLayoutBar}
                            />
                        </>
                    }
                    renderItem={() => (
                        <Animated.ScrollView
                            ref={scrollRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            scrollEventThrottle={16}
                        >
                            {contentLists.map((list, idx) => (
                                <View key={idx} style={{ width: screenWidth }}>
                                    <FlatList
                                        data={list}
                                        keyExtractor={(item) => item.id.toString()}
                                        removeClippedSubviews={false}
                                        renderItem={({ item }:{item:playListItem | djItem}) => {
                                            const imageUrl = (item as playListItem).coverImgUrl ?? (item as djItem).picUrl;
                                            const songNumber = (item as playListItem).trackCount ?? (item as djItem).programCount;
                                            const playOrStartNumber = (item as djItem).subCount ?? (item as playListItem).playCount;
                                            return (
                                                <View style={styles.list}>
                                                    <PlaylistItem
                                                        type={(item as djItem).dj ? 'dj' : 'song'}
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
                                </View>
                            ))}
                        </Animated.ScrollView>
                    )}
                />
            </GestureDetector>
        </View>
    );
};

export default memo(UserCenterHome);
