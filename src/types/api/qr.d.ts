import { CodeEnum } from "@/constants/network"

export type qrKeyType = {
    code:CodeEnum,
    data:{
        unikey:string
    }
}

export type QrImageType = {
    code:CodeEnum,
    data:{
        qrimg:string
        qrurl:string
    }
}

export type QrCheckType = {
    code:CodeEnum,
    message:string,
    cookie:string,
    avatarUrl?:string,
    nickname?:string
}