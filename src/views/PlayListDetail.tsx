import { View, StyleSheet, ScrollView, DeviceEventEmitter } from 'react-native';
import { PlaylistHeader } from '@/components/PlayListDetail/PlayListHeader';
import { SongList } from '@/components/PlayListDetail/SongList';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PlayListDetailStackParamList, RootStackNavigationProps } from '@/types/NavigationType';
import { useEffect, useMemo, useState } from 'react';
import { djDetail, djProgramDetail, playlistDetail, SongDetail } from '@/api';
import { Playlist } from '@/types/PlayList';
import { Song } from '@/types/Song';
import { useMusicPlayer } from '@/store';
import { debounce } from '@/utils/Debounce';
import { FOOTER_BAR_HEIGHT } from '@/constants/bar';
import { RadioDetailInfo } from '@/types/api/RadioDetail';
import { djItemSong } from '@/types/api/djItem';
import { handlePlaySong } from '@/utils/player/handlePlaySong';

export default function PlayListDetail() {
    const route = useRoute<RouteProp<PlayListDetailStackParamList,'PlayListDetailHome'>>();
    const { id, name, type, createId } = useMemo(() => route.params, [route.params]);
    const [playListSongs, setPlayListSongs] = useState<Playlist['tracks'] | djItemSong[]>([]);
    const [playlistDetailMsg, setPlayListDetailMsg] = useState<Playlist | RadioDetailInfo>();
    
    useEffect(() => {
        if(type == 'playList'){
            playlistDetail(id).then((res) => {
                setPlayListSongs(res.playlist.tracks)
                setPlayListDetailMsg(res.playlist)
            })
        }else{
            Promise.all([
                djDetail(id),
                djProgramDetail(id)
            ]).then(([djDetail, djProgramDetail])=>{
                // console.log(djProgramDetail.programs);
                setPlayListSongs(djProgramDetail.programs)
                setPlayListDetailMsg(djDetail.data)
            }).catch(error=>{
                console.log(error);
            })

            console.log('我是电台');
        }
    },[])

    // 使用 useCallback 和 debounce 创建防抖版本的 playSong
    // 设置 300ms 的防抖时间，并且设置为非立即执行模式
    const playSong = debounce(handlePlaySong, 300, false)
    const navigation = useNavigation<RootStackNavigationProps>();
    useEffect(()=>{
        DeviceEventEmitter.addListener('SongListSearch',()=>{
            navigation.navigate('PlayListDetail',{
                screen:'SongListSearch',
                params:{
                    playlistType:type,songList:playListSongs
                }
            });
        })
        return ()=>{
            DeviceEventEmitter.removeAllListeners('SongListSearch');
        }
    },[playListSongs])
    return (
        <>
            <View style={styles.container}>
                {playlistDetailMsg ?
                    <SongList
                        type={type}
                        playlistDetailMsg={playlistDetailMsg}
                        songs={playListSongs}
                        onSongPress={playSong} />
                    : ''}
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
    },
});