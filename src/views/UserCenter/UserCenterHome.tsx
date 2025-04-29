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
    Text,
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
import LevelScrollView, { LevelScrollViewRef } from "@/components/StickBarScrollingFlatList/LevelScrollView";
import { AnimatedOrRegular } from "@/utils/AnimatedOrRegular";
import { useFullScreenImage } from "@/context/imgFullPreviewContext";
import ProfileHeader from "@/components/UserCenter/ProfileHeader";
import { convertHttpToHttps } from "@/utils/fixHttp";
import PlaylistItem from "@/components/PlaylistItem";
import { useTheme } from "@/hooks/useTheme";
import StickBarScrollingFlatList from "@/components/StickBarScrollingFlatList/StickBarScrollingFlatList";

const screenWidth = Dimensions.get("window").width;

const UserCenterHome: React.FC = () => {
    const route = useRoute<RouteProp<UserCenterStackParamList>>();
    const { uid } = route.params;
    const scrollY = useSharedValue(0);
    const pullOffset = useSharedValue(0);
    const Scrolling = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = event.nativeEvent.contentOffset;
        scrollY.value = y;
        useUserCenter.scrollY = y <= 80 ? y : 80;
    };
    const tabs = useMemo(() => [
        { key: "music", name: "音乐" },
        { key: "broadcast", name: "播客" },
        { key: "start", name: "收藏" },
    ], []);

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
    const loading = useMemo(() => {
        return contentLists.reduce((acc, cur) => acc + cur.length, 0) === 0
    }, [contentLists])

    const { box } = useTheme();
    const styles = StyleSheet.create({
        list: {
            paddingHorizontal: 16,
            backgroundColor: box.background.middle, // 你可以接收 props 或用主题
        },
    });

    return (
        <StickBarScrollingFlatList
            Scrolling={Scrolling}
            tabs={tabs}
            loading={loading}
            children={{
                HeaderBar: null,
                HeaderContent: <ProfileHeader pullOffset={pullOffset} profile={finialProfile} />,
                FlatListContent: <>
                    {
                        (contentLists.map((list, idx) => (
                            <View key={idx} style={{ width: screenWidth }}>
                                <FlatList
                                    data={list}
                                    keyExtractor={(item) => item.id.toString()}
                                    removeClippedSubviews={false}
                                    renderItem={({ item }: { item: playListItem | djItem }) => {
                                        const imageUrl = (item as playListItem).coverImgUrl ?? (item as djItem).picUrl;
                                        const songNumber = (item as playListItem).trackCount ?? (item as djItem).programCount;
                                        const playOrStartNumber = (item as djItem).subCount ?? (item as playListItem).playCount;
                                        const createId = (item as djItem).dj ? (item as djItem).dj.userId : (item as playListItem).creator.userId;
                                        return (
                                            <View style={styles.list}>
                                                <PlaylistItem
                                                    createId={createId}
                                                    id={item.id}
                                                    type={(item as djItem).dj ? 'dj' : 'Album'}
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
                        )))
                    }

                </>
            }}
        >
        </StickBarScrollingFlatList>
    );
};

export default memo(UserCenterHome);
