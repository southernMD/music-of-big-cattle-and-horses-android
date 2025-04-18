import { proxy } from 'valtio';
import { Login, getDetail, quitLogin } from '@/api'; // 假设这是你的 API 方法
import { BaseApiType, UserCenterType, GlobalType } from '@/types/store';
import { CodeEnum } from '@/constants/network';
import { deleteCredentials } from '@/utils/keychain';
// 定义 store
export const useBasicApi = proxy<BaseApiType>({
    account: null, // 初始状态
    profile: null, // 初始状态

    // 异步登录方法
    async reqLogin(cookie: string) {
        try {
            const result = await Login(cookie);
            useBasicApi.account = result.data.account!; // 更新 account 状态

            const result2 = await getDetail(useBasicApi.account!.id);
            useBasicApi.profile = result2.profile; // 更新 profile 状态
            return Promise.resolve(result.data.account!); // 返回 account
        } catch (error) {
            return null
        }
    },
    async reqQuitLogin() {
        try {
            const { code } = await quitLogin();
            if (code === CodeEnum.SUCCESS) {
                useBasicApi.profile = null
                useBasicApi.account = null
                await deleteCredentials();
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }

    }

});

export const useUserCenter = proxy<UserCenterType>({
    scrollY: 0
})

export const useGlobal = proxy<GlobalType>({
    theme: 'light',
    primaryColor: 'rgba(102, 204, 255,1)'
},)
