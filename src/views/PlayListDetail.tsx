import { View, StyleSheet, ScrollView } from 'react-native';
import { PlaylistHeader } from '@/components/PlayListDetail/PlayListHeader';
import { SongList } from '@/components/PlayListDetail/SongList';
import { RouteProp, useRoute } from '@react-navigation/native';
import { PlayListDetailStackParamList } from '@/types/NavigationType';
import { useEffect, useMemo, useState } from 'react';
import { djDetail, djProgramDetail, playlistDetail, SongDetail } from '@/api';
import { Playlist } from '@/types/PlayList';
import { Song } from '@/types/Song';
import { useMusicPlayer } from '@/store';
import { debounce } from '@/utils/Debounce';
import { FOOTER_BAR_HEIGHT } from '@/constants/bar';
import { RadioDetailInfo } from '@/types/api/RadioDetail';
import { djItemSong } from '@/types/api/djItem';

export default function PlayListDetail() {
    const route = useRoute<RouteProp<PlayListDetailStackParamList>>();
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
                console.log(djProgramDetail.programs);
                setPlayListSongs(djProgramDetail.programs)
                setPlayListDetailMsg(djDetail.data)
            }).catch(error=>{
                console.log(error);
            })

            console.log('我是电台');
        }
    },[])

    // 原始的 playSong 函数
    const handlePlaySong = async (song: Song | djItemSong, type: 'dj' | 'playList') => {
        console.log('Pressed song:', song.name)
        //以下实现的是将歌曲添加到播放列表并播放
        if(true){
            const indexInPlayingList = useMusicPlayer.playingList.findIndex((item)=>item.id === song.id)
            if(type === 'playList'){
                if(indexInPlayingList === -1){
                   await SongDetail([song.id]).then(({privileges,songs})=>{
                        const newIndex = useMusicPlayer.playingIndex + 1;
                        useMusicPlayer.playingIndex = newIndex;
                        useMusicPlayer.playingList.splice(newIndex,0,...songs)
                        useMusicPlayer.playingPrivileges.splice(newIndex,0,...privileges)
                    })
                }else{
                    useMusicPlayer.playingIndex = indexInPlayingList
                }
                useMusicPlayer.PlayingListId = -1
                useMusicPlayer.playingId = song.id
            }else if(type === 'dj'){
                if(indexInPlayingList === -1){
                    (song as djItemSong).id = (song as djItemSong).mainTrackId
                    const newIndex = useMusicPlayer.playingIndex + 1;
                    useMusicPlayer.playingIndex = newIndex;
                    useMusicPlayer.playingList.splice(newIndex,0,song)
                    useMusicPlayer.playingPrivileges.splice(newIndex,0,{
                        id:(song as djItemSong).mainTrackId,
                        maxBrLevel: "DJ",
                        playMaxBrLevel: "DJ",
                        downloadMaxBrLevel: "DJ",
                        plLevel: "DJ",
                        dlLevel: "DJ",
                        flLevel: "DJ",
                    } as any)
                    useMusicPlayer.PlayingListId = -1
                    useMusicPlayer.playingId = song.id
                }else{
                    useMusicPlayer.playingIndex = indexInPlayingList
                }
            }

        }else{
            //歌单全部歌曲添加到播放列表
            useMusicPlayer.PlayingListId = id
        }
    }
    
    // 使用 useCallback 和 debounce 创建防抖版本的 playSong
    // 设置 300ms 的防抖时间，并且设置为非立即执行模式
    const playSong = debounce(handlePlaySong, 300, false)

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