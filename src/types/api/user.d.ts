import { userProfile,userAccount } from "@/types/user/user";
import { CodeEnum } from "@/constants/network"

export type LoginUserType = {
    data: {
        code: CodeEnum,
        account: userAccount | null,
        profile: {
            userId: number,
            userType: number,
            nickname: string,
            avatarImgId: number,
            avatarUrl: string,
            backgroundUrl: string,
            signature: string,
            createTime: number,
            accountType: number,
            birthday: number,
            authority: number,
            gender: number,
            accountStatus: number,
            province: number,
            city: number,
            authStatus: number,
            description: null,
            detailDescription: null,
            defaultAvatar: boolean,
            expertTags: null,
            experts: null,
            djStatus: number,
            locationStatus: number,
            vipType: number,
            followed: boolean,
            mutual: boolean,
            authenticated: boolean,
            lastLoginTime: number,
            lastLoginIP: string,
            remarkName: null,
            viptypeVersion: number,
            authenticationTypes: number,
            avatarDetail: null,
            anchor: boolean
        } | null
    }
}

export type UserDetailType = {
    code: CodeEnum,
    profile: userProfile,
}

export type QuitLoginType = {
    code: CodeEnum,
}

export type UserPlaylistType = {
    code: CodeEnum,
    playlist: playListItem[]
}

export type UserDjType = {
    code: CodeEnum,
    djRadios: djItem[],
    hasMore: false,
    count: number,
    subCount: number,
}