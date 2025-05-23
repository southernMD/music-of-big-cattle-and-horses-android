import { qrCheck, quitLogin } from '@/api';
import { CodeEnum } from '@/constants/network';
import { getCredentials, saveCredentials } from '@/utils/keychain';
import { loadString } from '@/utils/storage';
import { Linking, NativeModules } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
const QrCodeManager = NativeModules.QrCode;
export async function qrCodeNativeBackground(data: any) {
    BackgroundTimer.runBackgroundTimer(async () => {
        console.log('');
        let unikey =  await loadString('unikey')
        const controller = new AbortController();
        const resCheck = await qrCheck(unikey ?? '', controller)
        console.log(unikey,resCheck,"我是后台");
        if (resCheck.code == CodeEnum.QR_OUT_LIMIT) {
            //过期
            console.log('timeout');
            BackgroundTimer.stopBackgroundTimer()
            return Promise.resolve()
        } else if (resCheck.code == CodeEnum.QR_WAIT_SCAN) {
            console.log('back', 'wait scanf');
            //未扫描
        } else if (resCheck.code == CodeEnum.QR_WAIT_CONFIRMATION) {
            console.log('back', 'wait ready');
            //已扫描等待认证
        } else if (resCheck.code === CodeEnum.QR_SUCCESS) {
            //登录成功返回
            console.log('finish',resCheck.cookie,resCheck.nickname);
            await saveCredentials('user', resCheck.cookie)
            const res = await QrCodeManager.startBackgroudTask2()
            BackgroundTimer.stopBackgroundTimer()
            return Promise.resolve()
        }
    }, 1500)

    // return Promise.resolve();
}
