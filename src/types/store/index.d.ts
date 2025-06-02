import { userProfile,userAccount } from "@/types/user/user"
import { Song,SongPrivilege } from '@/types/Song'
import { AndroidImageColors } from 'react-native-image-colors/lib/typescript/types';

export type BaseApiType = {
    account:userAccount | null
    profile:userProfile | null
    reqLogin:(cookie:string) => Promise<any>
    reqQuitLogin:()=>Promise<boolean>
}
export type UserCenterType = {
    scrollY:number
}

export type GlobalType = {
    theme: 'light' | 'dark'
    primaryColor: string
}

export type useMusicPlayerType = {
    playingList:Array<Song>
    playingPrivileges:Array<SongPrivilege>
    playingId:number
    playingIndex:number
    playStatus:'play' | 'stop'
    PlayingListId:number
    playingSongAlBkColor:AndroidImageColors
    playingName:string
    playingAl:{id:number,name:string}
    playingAr:Array<{id:number,name:string}>
    //上一个播放的歌单id(限自己的歌单暂时)，在开始播放后会变成正在播放的歌单
    //0已下载 -1默认状态 -2本地  -3最近 -4私人FM -5个人排行 -6 top50
    // addPlayingList:Array<number>
}