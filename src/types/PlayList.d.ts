import { userProfile } from '@/types/user/user'
import { Song } from './Song'
export type Playlist = {
    id: number,
    name: string,
    coverImgId: number,
    coverImgUrl: string,
    coverImgId_str: string,
    adType: number,
    userId: number,
    createTime: number,
    status: number,
    opRecommend: boolean,
    highQuality: boolean,
    newImported: boolean,
    updateTime: number,
    trackCount: number,
    specialType: number,
    privacy: number,
    trackUpdateTime: number,
    commentThreadId: string,
    playCount: number,
    trackNumberUpdateTime: number,
    subscribedCount: number,
    cloudTrackCount: number,
    ordered: boolean,
    description: string,
    tags: Array<string>,
    updateFrequency: null,
    backgroundCoverId: number,
    backgroundCoverUrl: string,
    titleImage: number,
    titleImageUrl: string,
    detailPageTitle: string,
    englishTitle: string,
    officialPlaylistType: null,
    copied: boolean,
    relateResType: null,
    coverStatus: number,
    subscribers: Array<userProfile>,
    subscribed: null,
    creator: userProfile,
    tracks: Array<Song>,
    videoIds: null,
    videos: null,
    trackIds: Array<any>,
    bannedTrackIds: null,
    mvResourceInfos: null,
    shareCount: number,
    commentCount: number,
    remixVideo: null,
    newDetailPageRemixVideo: null,
    sharedUsers: null,
    historySharedUsers: null,
    gradeStatus: string,
    score: null,
    algTags: null,
    distributeTags: [],
    trialMode: number,
    displayTags: null,
    displayUserInfoAsTagOnly: boolean,
    playlistType: string,
    bizExtInfo: any
}