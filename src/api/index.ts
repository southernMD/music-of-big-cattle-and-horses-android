import { QrCheckType, QrImageType, qrKeyType } from "@/types/api/qr";
import { customFetch as fetch } from "./init";

export const apiTest = async () => {
   return fetch('/user/playlist?uid=361080509')
};

export const qrKey = async ()=>{
    return fetch<qrKeyType>(`/login/qr/key`, {
        method: 'GET'
    });
}

export const qrImage = async (key: string)=> {
    console.log(key);
    return await fetch<QrImageType>(`/login/qr/create?key=${key}&qrimg=200y200`, {
        method: 'GET'
    });
};

export const qrCheck = async (key: string,controller: AbortController) => {
    return await fetch<QrCheckType>(`/login/qr/check?key=${key}`, {
        method: 'GET'
    },true,controller);
};