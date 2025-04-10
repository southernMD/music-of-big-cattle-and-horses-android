export type userProfile = {
    avatarDetail: null,
    createTime: number,
    gender: number,
    nickname: string,
    avatarImgId: number,
    birthday: number,
    vipType: number,
    mutual: boolean,
    remarkName: null,
    accountStatus: number,
    userType: number,
    authStatus: number,
    avatarUrl: string
    backgroundUrl: string,
    city: number,
    detailDescription: string,
    djStatus: number,
    expertTags: null,
    followed: boolean,
    province: number,
    defaultAvatar: boolean,
    avatarImgIdStr: string,
    backgroundImgIdStr: string,
    description: string,
    userId: number,
    signature: string,
    authority: number,
    followeds: number,
    follows: number,
    blacklist: boolean,
    eventCount: number,
    allSubscribedCount: number,
    playlistBeSubscribedCount: number,
    avatarImgId_str: string,
    followTime: null,
    followMe: boolean,
    artistIdentity: Array<any>,
    cCount: number,
    inBlacklist: boolean,
    sDJPCount: number,
    playlistCount: number,
    sCount: number,
    newFollows: number
}

export type userAccount = {
    id: number,
    userName: string,
    type: number,
    status: number,
    whitelistAuthority: number,
    createTime: number,
    tokenVersion: number,
    ban: number,
    baoyueVersion: number,
    donateVersion: number,
    vipType: number,
    anonimousUser: boolean,
    paidFee: boolean
}