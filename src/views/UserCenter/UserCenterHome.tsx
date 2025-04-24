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
import LevelScrollView, { LevelScrollViewRef } from "@/components/LevelScrollView";

const screenWidth = Dimensions.get("window").width;

const UserCenterHome: React.FC = () => {
    const route = useRoute<RouteProp<UserCenterStackParamList>>();
    const { uid } = route.params;
    const scrollY = useSharedValue(0);
    const pullOffset = useSharedValue(0);
    const HEADER_BAR_HEIGHT = 56;
    const [translateY, setTranslateY] = useState(0);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    // const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const horizontalScrollX = useSharedValue(0);

    const Scrolling = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = event.nativeEvent.contentOffset;
        scrollY.value = y;
        useUserCenter.scrollY = y <= 80 ? y : 80;
        setTranslateY(levelScrollViewRef.current!.BaseTop.current - y <= HEADER_BAR_HEIGHT ? HEADER_BAR_HEIGHT : 0);
    };

    const tabs = useMemo(() => [
        { key: "music", name: "音乐" },
        { key: "broadcast", name: "播客" },
        { key: "start", name: "收藏" },
    ], []);

    const throttledTabChange = useThrottleCallback((key: string) => {
        const index = tabs.findIndex(tab => tab.key === key);
        if (index !== -1) {
            setActiveTabIndex(index);
            requestAnimationFrame(() => {
                levelScrollViewRef.current?.scrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
            });
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
    const levelScrollViewRef = useRef<LevelScrollViewRef>(null)

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

            <LevelScrollView
                Scrolling={Scrolling}
                tabs={tabs}
                activeTabIndex={activeTabIndex}
                setActiveTabIndex={setActiveTabIndex}
                scrollY={scrollY}
                pullOffset={pullOffset}
                profile={finialProfile}
                contentLists={contentLists}
                onTabChange={throttledTabChange}
                ref={levelScrollViewRef}
            />
        </View>
    );
};

export default memo(UserCenterHome);
