/**
 * 电台详情类型定义
 */

/**
 * 电台DJ用户信息
 */
export type RadioDjInfo = {
  defaultAvatar: boolean;
  province: number;
  authStatus: number;
  followed: boolean;
  avatarUrl: string;
  accountStatus: number;
  gender: number;
  city: number;
  birthday: number;
  userId: number;
  userType: number;
  nickname: string;
  signature: string;
  description: string;
  detailDescription: string;
  avatarImgId: number;
  backgroundImgId: number;
  backgroundUrl: string;
  authority: number;
  mutual: boolean;
  expertTags: null;
  experts: null;
  djStatus: number;
  vipType: number;
  remarkName: null;
  authenticationTypes: number;
  avatarDetail: null;
  avatarImgIdStr: string;
  backgroundImgIdStr: string;
  anchor: boolean;
  rewardCount: number;
  avatarImgId_str: string;
  canReward: boolean;
}

/**
 * 电台详情信息
 */
export type RadioDetailInfo = {
  id: number;
  name: string;
  dj: RadioDjInfo;
  picId: number;
  picUrl: string;
  desc: string;
  subCount: number;
  shareCount: number;
  likedCount: number;
  programCount: number;
  commentCount: number;
  createTime: number;
  categoryId: number;
  category: string;
  secondCategoryId: number;
  secondCategory: string;
  radioFeeType: number;
  feeScope: number;
  lastProgramCreateTime: number;
  lastProgramId: number;
  rcmdText: null;
  subed: boolean;
  commentDatas: any[];
  feeInfo: null;
  unlockInfo: null;
  original: boolean;
  playCount: number;
  privacy: boolean;
  disableShare: boolean;
  icon: null;
  activityInfo: null;
  toplistInfo: null;
  dynamic: boolean;
  labelDto: null;
  labels: null;
  detailRcmdTabOrpheus: string;
  toast: null;
  limitFreeToast: null;
} 