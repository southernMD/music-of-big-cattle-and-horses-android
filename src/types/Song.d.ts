export type SongSimple = {
    name: string,
    mainTitle: null,
    additionalTitle: null,
    id: number,
    pst: number,
    t: number,
    ar: Array<SongArSimple>,
    alia: Array<string>,
    pop: number,
    st: number,
    rt: null,
    fee: number,
    v: number,
    crbt: null,
    cf: string,
    al: SongAlSimple,
    dt: number,
    h: SongQualitySimple,
    m: SongQualitySimple,
    l: SongQualitySimple,
    sq: SongQualitySimple,
    hr: null,
    a: null,
    cd: string,
    no: number,
    rtUrl: null,
    ftype: number,
    rtUrls: [],
    djId: number,
    copyright: number,
    s_id: number,
    mark: number,
    originCoverType: number,
    originSongSimpleData: null,
    tagPicList: null,
    resourceState: true,
    version: number,
    songJumpInfo: null,
    entertainmentTags: null,
    awardTags: null,
    displayTags: null,
    single: number,
    noCopyrightRcmd: null,
    alg: null,
    displayReason: null,
    rtype: number,
    rurl: null,
    mst: number,
    cp: number,
    mv: number,
    publishTime: number
    tns:Array<string>
}

export type SongArSimple = {
    id: number,
    name: string,
    tns:Array<string>,
    alias: Array<string>
}

export type SongAlSimple = {
    id: number,
    name: string,
    picUrl: string,
    tns: Array<string>,
    pic_str: string,
    pic: number
}

export type SongQualitySimple = {
    br: number,
    fid: number,
    size: number,
    vd: number,
}