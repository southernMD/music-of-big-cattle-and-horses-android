import { qrCheck, qrImage, qrKey } from "@/api";
import { OLD_NETEASE_CLOUD_MUSIC, NEW_NETEASE_CLOUD_MUSIC } from "@/constants/link";
import { CodeEnum } from "@/constants/network";
import { RootStackNavigationProps } from "@/types/NavigationType";
import { saveBase64ImageToGallery } from "@/utils/saveFile";
import { clear, loadString, remove, saveString } from "@/utils/storage";
import { Button, Provider, Toast } from "@ant-design/react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert, AppRegistry, AppState, DeviceEventEmitter, Image, Linking, NativeModules, Text, View } from "react-native";
import BackgroundTimer from 'react-native-background-timer';
//orpheuswidget://
//orpheus://
export const My: React.FC = () => {
    const [codeImg, setCodeImg] = useState<string>('')
    const navigation = useNavigation<RootStackNavigationProps>()
    let timer: NodeJS.Timeout
    const [msg, setMsg] = useState<string>('')
    const QrCodeManager = NativeModules.QrCode;
    const qrCodeHandle = async () => {
        const controller = new AbortController();
        const unikey = (await loadString('unikey'))!
        const resCheck = await qrCheck(unikey, controller)
        await saveString('unikey', unikey)
        if (resCheck.code == CodeEnum.QR_OUT_LIMIT) { //过期
            clearInterval(timer);
            remove('unikey')
            Alert.alert('二维码已失效，请重新扫描')
            setMsg('二维码已失效，请重新扫描')
        } else if (resCheck.code == CodeEnum.QR_WAIT_SCAN) {
            console.log('二维码未扫描');
            setMsg('二维码未扫描')
        } else if (resCheck.code == CodeEnum.QR_WAIT_CONFIRMATION) {
            console.log('二维码等待认证');
            setMsg('二维码等待认证')
        } else if (resCheck.code === CodeEnum.QR_SUCCESS) {
            controller.abort();
            clearInterval(timer);
            console.log(resCheck.cookie, "登录成功");
            setMsg('登录成功')
        }
    }
    useFocusEffect(
        useCallback(() => {
            const getCodeImg = async () => {
                const res = await qrKey()
                await saveString('unikey', res.data.unikey)
                const imgRes = await qrImage(res.data.unikey)
                setCodeImg(imgRes.data.qrimg)
                timer = setInterval(qrCodeHandle, 1500)
            }
            getCodeImg()

            return () => {
                clearInterval(timer);
            };
        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            const handleAppStateChange = async (nextAppState: string) => {
                if (nextAppState === "background" || nextAppState === "inactive") {
                    console.log("应用进入最小化或后台");
                    // 在这里执行进入最小化后的逻辑
                    clearInterval(timer);
                    await QrCodeManager.startBackgroudTask()
                } else if (nextAppState === "active") {
                    console.log("应用回到前台");
                    BackgroundTimer.stopBackgroundTimer()
                    timer = setInterval(qrCodeHandle, 1500)
                    await QrCodeManager.stopBackgroudTask()
                    // 在这里执行回到前台后的逻辑
                }
            };

            // 添加监听
            const subscription = AppState.addEventListener("change", handleAppStateChange);

            // 清理监听
            return () => {
                subscription.remove();
            };
        }, [])
    );
    DeviceEventEmitter.addListener('backgroundTask',(event)=>{
        console.log(event.msg,6);
        console.log(event,7);
    })
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setCodeImg('')
        });
        return unsubscribe;
    }, [navigation]);
    const goNeteaseCloud = async () => {
        try {
            //获取漂浮窗权限，存储权限，后台任务权限
            await QrCodeManager.requestIgnoreBatteryTask() //获取电池
            const flagIgnoreBatteryPermission = await QrCodeManager.hasIgnoreBatteryPermissionTask()
            console.log(typeof flagIgnoreBatteryPermission);
            if(flagIgnoreBatteryPermission == false) return ;
            const windowPermission = await QrCodeManager.hasFloatWindowPermissionTask() //是否可以漂浮窗
            if(windowPermission == false){
                Alert.alert('提示', '点击确认设置漂浮窗权限',  [
                    {
                      text: '取消',
                      onPress: () => {
                        console.log('取消按钮被点击');
                      },
                      style: 'cancel', // 取消按钮通常使用 'cancel' 样式
                    },
                    {
                      text: '确定',
                      onPress: () => {
                        console.log('确定按钮被点击');
                        QrCodeManager.requestFloatWindowTask(); // 执行确认后的操作
                      },
                    },
                ])
            }else{
                await saveBase64ImageToGallery(codeImg)
                const oldSupported = await Linking.canOpenURL(OLD_NETEASE_CLOUD_MUSIC);
                const newSupported = await Linking.canOpenURL(NEW_NETEASE_CLOUD_MUSIC);
                if (oldSupported) {
                    await Linking.openURL(OLD_NETEASE_CLOUD_MUSIC);
                }
                if (newSupported) {
                    await Linking.openURL(NEW_NETEASE_CLOUD_MUSIC);
                }
                if (!oldSupported && !newSupported) {
                    throw new Error('无法打开网易云音乐');
                }
            }

        } catch (error:any) {
            Toast.show({
                content: error.message,
                position: 'bottom'
            });
        }

    }
    return (
        <View>
            <Button onPress={goNeteaseCloud}>保存图片并打开网易云音乐</Button>
            <Image
                style={{
                    width: 200,
                    height: 200,
                }}
                source={{
                    uri: codeImg
                }}
            />
            <Text>{msg}</Text>
        </View>
    );
};