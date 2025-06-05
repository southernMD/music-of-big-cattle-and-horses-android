import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, DeviceEventEmitter, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { PlayListDetailStackParamList } from "@/types/NavigationType";
import { RouteProp, useRoute } from "@react-navigation/native";
import { handlePlaySong } from "@/utils/player/handlePlaySong";
import { debounce } from "@/utils/Debounce";
import { useTheme } from "@/hooks/useTheme";
import { FOOTER_BAR_HEIGHT, HEADER_BAR_HEIGHT } from "@/constants/bar";
import { SongListItem } from "@/components/PlayListDetail/SongListItem";
import { Song } from "@/types/Song";
import { djItemSong } from "@/types/api/djItem";
import { filterSongs } from "@/utils/search/filterSongs";

const screenWidth = Dimensions.get("window").width;

export default function SongListSearch(){
    const route = useRoute<RouteProp<PlayListDetailStackParamList,'SongListSearch'>>();
    const { playlistType, songList } = useMemo(() => route.params, [route.params]);
    const { box } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    
    // 使用 debounce 创建防抖版本的 handlePlaySong
    const playSong = debounce(handlePlaySong, 300, false);
    
    // 过滤歌曲列表
    const filteredSongList = useMemo(() => {
        return filterSongs(songList, searchQuery);
    }, [songList, searchQuery]);
    
    useEffect(() => { 
        DeviceEventEmitter.addListener('searchQuery', (searchQuery:string) => {
            console.log(searchQuery);
            setSearchQuery(searchQuery);
        });
        return () => {
            DeviceEventEmitter.removeAllListeners('searchQuery');
        };
    }, []);
    
    return (
        <View style={[styles.container, { backgroundColor: box.background.shallow }]}>
            <FlatList<Song | djItemSong>
                style={{ width: screenWidth }}
                data={filteredSongList}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item, index }) => (
                    <SongListItem
                        item={item}
                        index={index}
                        onPress={playSong}
                        type={playlistType}
                    />
                )}
                contentContainerStyle={{ paddingBottom: FOOTER_BAR_HEIGHT, paddingTop: HEADER_BAR_HEIGHT }}
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
