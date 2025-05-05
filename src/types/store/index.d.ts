import { userProfile,userAccount } from "@/types/user/user"
import { Song,SongPrivilege } from '@/types/Song'
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
}