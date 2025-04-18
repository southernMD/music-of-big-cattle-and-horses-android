import { userProfile,userAccount } from "@/types/user/user"
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