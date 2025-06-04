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
import { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import TabBar from "@/components/UserCenter/TabBar";
import { userProfile } from "@/types/user/user";
import { getDetail, userDj, userPlaylist } from "@/api";
import { useLoadingModal } from "@/context/LoadingModalContext";
import { playListItem } from "@/types/api/playListItem";
import { djItem } from "@/types/api/djItem";
import { useThrottleCallback } from "@/hooks/useThrottleCallback";
import LevelScrollView, { LevelScrollViewRef } from "@/components/StickBarScrollingFlatList/LevelScrollView";
import ProfileHeader from "@/components/UserCenter/ProfileHeader";
import { convertHttpToHttps } from "@/utils/fixHttp";
import PlaylistItem from "@/components/PlaylistItem";
import { useTheme } from "@/hooks/useTheme";
import StickBarScrollingFlatList from "@/components/StickBarScrollingFlatList/StickBarScrollingFlatList";
import { Gesture } from "react-native-gesture-handler";

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

    const panGesture = Gesture.Pan()
    .onUpdate((e) => {
        if (scrollY.value <= 0 && e.translationY > 0) {
        pullOffset.value = e.translationY;
        }
    })
    .onEnd(() => {
        pullOffset.value = withSpring(0, { stiffness: 150, damping: 20 });
    });

    const [itemHeight, setItemHeight] = useState<number>(0);
    const playlistItemRef = useRef<View>(null);
    
    const onPlaylistItemLayout = useCallback((event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setItemHeight(height);
        console.log('PlaylistItem 高度:', height);
    }, []);

    const heightList = useMemo(()=>{
        return [
            userPlayList.length * itemHeight,
            userCreateDj.length * itemHeight,
            userStartPlayList.length * itemHeight,
        ]
    },[userPlayList, userCreateDj, userStartPlayList, itemHeight])
    
    useEffect(() => {
        console.log(heightList,"itemHeight");
    }, [heightList]);

    return (
        <StickBarScrollingFlatList
            Scrolling={Scrolling}
            tabs={tabs}
            loading={loading}
            panGesture={panGesture}
            heightList={heightList}
            children={{
                HeaderBar: null,
                HeaderContent: <ProfileHeader pullOffset={pullOffset} profile={finialProfile} />,
                FlatListContent: <>
                    {
                        <FlatList
                            horizontal={true}
                            data={contentLists}
                            removeClippedSubviews={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item:list, index:idx }) => (
                                <View key={idx} style={{ width: screenWidth }} >
                                    <FlatList
                                        data={list}
                                        keyExtractor={(item) => item.id.toString()}
                                        removeClippedSubviews={false}
                                        renderItem={({ item,index }: { item: playListItem | djItem,index:number }) => {
                                            const imageUrl = (item as playListItem).coverImgUrl ?? (item as djItem).picUrl;
                                            const songNumber = (item as playListItem).trackCount ?? (item as djItem).programCount;
                                            const playOrStartNumber = (item as djItem).subCount ?? (item as playListItem).playCount;
                                            const createId = (item as djItem).dj ? (item as djItem).dj.userId : (item as playListItem).creator.userId;
                                            return (
                                                <View 
                                                    style={styles.list} 
                                                    ref={index === 0 ? playlistItemRef : null}
                                                    onLayout={index === 0 ? onPlaylistItemLayout : undefined}
                                                >
                                                    <PlaylistItem
                                                        createId={createId}
                                                        id={item.id}
                                                        type={(item as djItem).dj ? 'dj' : 'playList'}
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
                            )}
                        />
                    }
                </>
            }}
        >
        </StickBarScrollingFlatList>
    );
};

export default memo(UserCenterHome);
