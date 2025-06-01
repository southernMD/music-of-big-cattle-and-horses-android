import { QrCheckType, QrImageType, qrKeyType } from "@/types/api/qr";
import { customFetch as fetch } from "./init";
import { LoginUserType, QuitLoginType, UserDetailType, UserDjType, UserPlaylistType } from "@/types/api/user";
import { PlaylistTrackType, PlayListType } from "@/types/api/PlayListType";
import { SongDetailsType, SongUrlType } from "@/types/api/song";

export const apiTest = async () => {
   return fetch('/user/playlist?uid=361080509')
};

export const qrKey = async ()=>{
    return fetch<qrKeyType>(`/login/qr/key`, {
        method: 'GET'
    });
}

export const qrImage = async (key: string)=> {
    return await fetch<QrImageType>(`/login/qr/create?key=${key}&qrimg=200y200`, {
        method: 'GET'
    });
};

export const qrCheck = async (key: string,controller: AbortController) => {
    return await fetch<QrCheckType>(`/login/qr/check?key=${key}`, {
        method: 'GET'
    },true,controller);
};

//登陆状态检查
export const Login = async (cookie:string)=>{
    return await fetch<LoginUserType>(`/login/status`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cookie
        })
    })
}

//获取详细profile
export const getDetail = async (uid:number)=>{
    return await fetch<UserDetailType>(`/user/detail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uid
        })
    });
}
//退出登录
export const quitLogin = async ()=>{
    //返回的是promise对象
    return await fetch<QuitLoginType>(`/logout`, {
        method: 'GET'
    });
}

export const userPlaylist = async (uid:number,limit = 30,offset = 0)=>{
    return await fetch<UserPlaylistType>(`/user/playlist?uid=${uid}`, {
        method: 'POST',
        body:JSON.stringify({
            limit,
            offset
        })
    });
}

export const userDj = async (uid:number)=>{
    return await fetch<UserDjType>(`/user/audio?uid=${uid}`, {
        method: 'GET'
    });
}

//获取歌单详情
export const playlistDetail = async (id:string | number)=>{
    return await fetch<PlayListType>(`/playlist/detail?id=${id}`, {
        method: 'GET'
    })
}


export const playlistTrackAll= (id:string | number,limit?:string | number,offset?:string | number)=>{
    return fetch<PlaylistTrackType>(`/playlist/track/all?id=${id}`,{
        method:'POST',
        body:JSON.stringify({
            limit,
            offset,
        })
    })
}

//一首歌的url
export const SongUrl = (id:number,controller?: AbortController,level:string = 'standard')=>{
    return fetch<SongUrlType>(`/song/url/v1?id=${id}&level=${level}`,{
        method:'POST',
    },true,controller)
}

//歌曲们的详情
export const SongDetail = (ids:number[])=>{
    return fetch<SongDetailsType>(`/song/detail?ids=${ids.join(',')}`,{
        method:'POST',
    })
}