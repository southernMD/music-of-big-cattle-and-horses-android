import { View, StyleSheet, ScrollView } from 'react-native';
import { PlaylistHeader } from '@/components/PlayListDetail/PlayListHeader';
import { SongList } from '@/components/PlayListDetail/SongList';
import { RouteProp, useRoute } from '@react-navigation/native';
import { PlayListDetailStackParamList } from '@/types/NavigationType';
import { useEffect, useMemo, useState } from 'react';
import { playlistDetail, SongDetail } from '@/api';
import { Playlist } from '@/types/PlayList';
import { Song } from '@/types/Song';
import { useMusicPlayer } from '@/store';
import { debounce } from '@/utils/Debounce';
import { FOOTER_BAR_HEIGHT } from '@/constants/bar';

export default function PlayListDetail() {
    const route = useRoute<RouteProp<PlayListDetailStackParamList>>();
    const { id, name, type, createId } = useMemo(() => route.params, [route.params]);
    const [playListSongs, setPlayListSongs] = useState<Playlist['tracks']>([]);
    const [playlistDetailMsg, setPlayListDetailMsg] = useState<Playlist>();
    
    useEffect(() => {
        if(type == 'Album'){
            playlistDetail(id).then((res) => {
                setPlayListSongs(res.playlist.tracks)
                setPlayListDetailMsg(res.playlist)
            })
        }

    },[])

    // 原始的 playSong 函数
    const handlePlaySong = async (song: Song, type: 'dj' | 'Album') => {
        console.log('Pressed song:', song.name)
        //以下实现的是将歌曲添加到播放列表并播放
        if(true){
            const indexInPlayingList = useMusicPlayer.playingList.findIndex((item)=>item.id === song.id)
            
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