import { QrCheckType, QrImageType, qrKeyType } from "@/types/api/qr";
import { customFetch as fetch } from "./init";
import { LoginUserType, QuitLoginType, UserDetailType } from "@/types/api/user";

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