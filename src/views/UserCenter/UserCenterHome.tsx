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
    InteractionManager,
} from "react-native";
import { useBasicApi, useUserCenter } from "@/store/index";
import { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import TabBar from "@/components/UserCenter/TabBar";
import { userProfile } from "@/types/user/user";
import { getDetail, userDj, userPlaylist } from "@/api";
import { useLoadingModal } from "@/context/LoadingModalContext";
import { playListItem } from "@/types/api/playListItem";
import { djItem } from "@/types/api/djItem";
import { useThrottleCallback } from "@/hooks/useThrottleCallback";
import LevelScrollView, { LevelScrollViewRef } from "@/components/LevelScrollView";
import { AnimatedOrRegular } from "@/utils/AnimatedOrRegular";
import { useFullScreenImage } from "@/context/imgFullPreviewContext";

const screenWidth = Dimensions.get("window").width;

const UserCenterHome: React.FC = () => {
    const route = useRoute<RouteProp<UserCenterStackParamList>>();
    const { uid } = route.params;
    const scrollY = useSharedValue(0);
    const pullOffset = useSharedValue(0);
    const HEADER_BAR_HEIGHT = 56;
    const horizontalScrollX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const Scrolling = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = event.nativeEvent.contentOffset;
        scrollY.value = y;
        useUserCenter.scrollY = y <= 80 ? y : 80;
        translateY.value = levelScrollViewRef.current!.BaseTop.current - y <= HEADER_BAR_HEIGHT ? HEADER_BAR_HEIGHT : 0;
    };
    const tabs = useMemo(() => [
        { key: "music", name: "音乐" },
        { key: "broadcast", name: "播客" },
        { key: "start", name: "收藏" },
    ], []);

    const throttledTabChange = useThrottleCallback((key: string) => {
        const index = tabs.findIndex(tab => tab.key === key);
        if (index !== -1) {
            levelScrollViewRef.current?.scrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
            horizontalScrollX.value = index * screenWidth;
        }
    }, 200);

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
    const levelScrollViewRef = useRef<LevelScrollViewRef>(null)

    const tabBarAnimatedStyle = useAnimatedStyle(() => ({
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        opacity: translateY.value === 0 ? 0 : 1,
        transform: [{ translateY: translateY.value }],
    }));
    const { isVisible } = useFullScreenImage();


    return (
        <View>
            <AnimatedOrRegular
                isAnimated={!isVisible}
                component={View}
                animatedStyle={tabBarAnimatedStyle}>
                <TabBar
                    position="absolute"
                    onTabChange={throttledTabChange}
                    tabs={tabs}
                    scrollX={horizontalScrollX}
                />
            </AnimatedOrRegular>


            <LevelScrollView
                Scrolling={Scrolling}
                tabs={tabs}
                scrollY={scrollY}
                pullOffset={pullOffset}
                profile={finialProfile}
                contentLists={contentLists}
                onTabChange={throttledTabChange}
                ref={levelScrollViewRef}
                horizontalScrollX={horizontalScrollX}
            />
        </View>
    );
};

export default memo(UserCenterHome);
