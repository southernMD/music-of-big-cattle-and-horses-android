import { playlistTrackAll } from "@/api";
import { useMusicPlayer } from "@/store";
import { djItemSong } from "@/types/api/djItem";

export type PlayAllMusicProps = { 
    willPlayId?: number
    willPlayListId?: number
    programs?:  djItemSong[]
}

export const playAllMusic = async ({ willPlayId,willPlayListId,programs }:PlayAllMusicProps) => { 
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
    //dj
    if(programs){
        useMusicPlayer.playingList = programs
        useMusicPlayer.playingPrivileges = programs.map((item)=>{
            return {
                id: (item as djItemSong).mainTrackId,
                maxBrLevel: "DJ",
                playMaxBrLevel: "DJ",
                downloadMaxBrLevel: "DJ",
                plLevel: "DJ",
                dlLevel: "DJ",
                flLevel: "DJ",
            } as any
        })
        const index = willPlayId ? useMusicPlayer.playingList.findIndex(item =>{
            return 'dj' in item? item?.mainTrackId === willPlayId : item.id === willPlayId
        }) : 0

        useMusicPlayer.playingIndex = index
        useMusicPlayer.playingId = willPlayId ? willPlayId :
        'dj' in useMusicPlayer.playingList[0] ? useMusicPlayer.playingList[0].mainTrackId : useMusicPlayer.playingList[0].id;
    }else{
        if(willPlayListId){
            const { songs,privileges } = await playlistTrackAll(willPlayListId)
            //暂时为替换，后续在设置内更改添加到播放列表或者是替换
            useMusicPlayer.playingList = songs
            useMusicPlayer.playingPrivileges = privileges
            useMusicPlayer.PlayingListId = willPlayListId
        }
        const index = willPlayId ? useMusicPlayer.playingList.findIndex(item => item.id === willPlayId) : 0
        useMusicPlayer.playingIndex = index
        useMusicPlayer.playingId = willPlayId ? willPlayId : useMusicPlayer.playingList[0].id;
    }
    //目前没有问题，但是DJ的歌曲id是mainTrackId

    return;
};