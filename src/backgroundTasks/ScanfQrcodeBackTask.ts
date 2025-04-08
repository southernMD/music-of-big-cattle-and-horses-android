import { qrCheck } from "@/api";
import { CodeEnum } from "@/constants/network";
import { QrCodeBackground } from "@/types/ScanfQrcode";
import { Linking } from "react-native";
import BackgroundTimer from 'react-native-background-timer';

export async function qrCodeBackground(data: QrCodeBackground) {
    try {
        const { unikey } = data
        BackgroundTimer.setInterval(async ()=>{
            console.log('我出来');
            // await Linking.openURL("mychat://");
        },1000)
        // const timer = BackgroundTimer.setInterval(async () => {
        //     const controller = new AbortController();
        //     const resCheck = await qrCheck(unikey, controller)
        //     if (resCheck.code == CodeEnum.QR_OUT_LIMIT) { 
        //         //过期
        //         console.log('timeout');
        //         BackgroundTimer.clearInterval(timer)
        //         return Promise.resolve()
        //     } else if (resCheck.code == CodeEnum.QR_WAIT_SCAN) {
        //         console.log('back','wait scanf');
        //         //未扫描
        //     } else if (resCheck.code == CodeEnum.QR_WAIT_CONFIRMATION) {
        //         console.log('back','wait ready');
        //         //已扫描等待认证
        //     } else if (resCheck.code === CodeEnum.QR_SUCCESS) {
        //         //登录成功返回
        //         console.log('finish');
        //         const t = await Linking.canOpenURL("mychat://")
        //         await Linking.openURL("mychat://");
        //         console.log(t,"可以吗");
        //         BackgroundTimer.clearInterval(timer)
        //         return Promise.resolve()
        //     }
        // }, 1500)
    } catch (error) {
        return Promise.reject()
    }
}