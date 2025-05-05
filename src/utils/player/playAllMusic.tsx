import { useMusicPlayer } from "@/store";
import { useSnapshot } from "valtio";

export type PlayAllMusicProps = { 
    willPlayId?: number
    willPlayListId?: number
}

export const playAllMusic = async ({ willPlayId,willPlayListId }:PlayAllMusicProps) => { 
    const { playingList,playingId } = useSnapshot(useMusicPlayer)
    const index = willPlayId ? playingList.findIndex(item => item.id === willPlayId) : -1
    if(index !== -1){
        //--播放--
        useMusicPlayer.playingId = willPlayId!
    }else{
        //如果有willPlayListId,直接获取歌单
        if(willPlayListId){
            //--发起歌单请求--
            useMusicPlayer.playingId = willPlayId!
            useMusicPlayer.PlayingListId = willPlayListId
            return 
        }
    }
};