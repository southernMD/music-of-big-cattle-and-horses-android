import { playlistTrackAll } from "@/api";
import { useMusicPlayer } from "@/store";

export type PlayAllMusicProps = { 
    willPlayId?: number
    willPlayListId?: number
}

export const playAllMusic = async ({ willPlayId,willPlayListId }:PlayAllMusicProps) => { 
    // const index = willPlayId ? useMusicPlayer.playingList.findIndex(item => item.id === willPlayId) : -1
    // if(index !== -1){
    //     useMusicPlayer.playingId = willPlayId!
    //     useMusicPlayer.playingIndex = 0
    //     return
    // }else{
    //     //如果有willPlayListId,直接获取歌单
    //     if(willPlayListId){
    //         const { songs,privileges } = await playlistTrackAll(willPlayListId)
    //         //暂时为替换，后续在设置内更改添加到播放列表或者是替换
    //         useMusicPlayer.playingList = songs
    //         useMusicPlayer.playingPrivileges = privileges
    //         useMusicPlayer.playingId = willPlayId!
    //         useMusicPlayer.PlayingListId = willPlayListId
    //         useMusicPlayer.playingIndex = 0
    //         return 
    //     }
    // }
    if(willPlayListId){
        const { songs,privileges } = await playlistTrackAll(willPlayListId)
        //暂时为替换，后续在设置内更改添加到播放列表或者是替换
        useMusicPlayer.playingList = songs
        useMusicPlayer.playingPrivileges = privileges
        useMusicPlayer.PlayingListId = willPlayListId
    }
    const index = willPlayId ? useMusicPlayer.playingList.findIndex(item => item.id === willPlayId) : 0
    useMusicPlayer.playingIndex = index
    useMusicPlayer.playingId = willPlayId!
    return 
};