import { qrCheck, qrImage, qrKey } from "@/api";
import { OLD_NETEASE_CLOUD_MUSIC, NEW_NETEASE_CLOUD_MUSIC } from "@/constants/link";
import { CodeEnum } from "@/constants/network";
import { RootStackNavigationProps } from "@/types/NavigationType";
import { deleteFile } from "@/utils/deleteFile";
import { deleteCredentials, getCredentials, saveCredentials } from "@/utils/keychain";
import { saveBase64ImageToGallery } from "@/utils/saveFile";
import { clear, loadString, remove, saveString } from "@/utils/storage";
import { ActivityIndicator, Button, Icon, Provider, Toast } from "@ant-design/react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert, AppRegistry, AppState, DeviceEventEmitter, Image, Linking, NativeModules, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackgroundTimer from 'react-native-background-timer';
//orpheuswidget://
//orpheus://
export const Login: React.FC = () => {
    const [codeImg, setCodeImg] = useState<string>('')
    const navigation = useNavigation<RootStackNavigationProps>()
    let timer: NodeJS.Timeout | null = null;
    const [msg, setMsg] = useState<string>('二维码加载中')
    const [userMsg, setUserMsg] = useState<string>('')
    const QrCodeManager = NativeModules.QrCode;
    const [flag, setFlag] = useState<boolean>(false)
    const [path, setPath] = useState<string>('')
    const qrCodeHandle = async () => {
        const controller = new AbortController();
        const unikey = (await loadString('unikey'))!
        const resCheck = await qrCheck(unikey, controller)
        await saveString('unikey', unikey)
        if (resCheck.code == CodeEnum.QR_OUT_LIMIT) { //过期
            clearInterval(timer!);
            remove('unikey')
            const userMsg = await getCredentials()
            if (userMsg) {
                setMsg('登录成功')
                setUserMsg(userMsg.password)
            }
            else setMsg('二维码已失效')
            setFlag(true)
        } else if (resCheck.code == CodeEnum.QR_WAIT_SCAN) {
            console.log('二维码未扫描');
            setMsg('二维码未扫描')
        } else if (resCheck.code == CodeEnum.QR_WAIT_CONFIRMATION) {
            console.log('二维码等待认证');
            setMsg('二维码等待认证')
        } else if (resCheck.code === CodeEnum.QR_SUCCESS) {
            controller.abort();
            clearInterval(timer!);
            await saveCredentials('user', resCheck.cookie);
            setUserMsg(resCheck.cookie)
            setMsg('登录成功')
            setFlag(true)
        }
    }
    useFocusEffect(
        useCallback(() => {
            const getCodeImg = async () => {
                await deleteCredentials()
                setUserMsg("")
                const res = await qrKey()
                await saveString('unikey', res.data.unikey)
                const imgRes = await qrImage(res.data.unikey)
                setCodeImg(imgRes.data.qrimg)
                setMsg('二维码未扫描')
                timer = setInterval(qrCodeHandle, 1500)
            }
            getCodeImg()

            return () => {
                clearInterval(timer!);
            };
        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            const handleAppStateChange = async (nextAppState: string) => {
                if (nextAppState === "background" || nextAppState === "inactive") {
                    console.log("应用进入最小化或后台");
                    // 在这里执行进入最小化后的逻辑
                    clearInterval(timer!);
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
    DeviceEventEmitter.addListener('backgroundTask', (event) => {
        console.log(event.msg, 6);
        console.log(event, 7);
    })
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setCodeImg('')
            clearInterval(timer!);
            remove('unikey')
        });
        return unsubscribe;
    }, [navigation, timer]);

    useEffect(() => {
        if(flag && path){
            console.log(flag,path,"球球你阻止我");
            deleteFile(path)
            setFlag(false)
            setPath('')
        }
    }, [flag,path]);
    const goNeteaseCloud = async () => {
        try {
            if (codeImg.length == 0) throw new Error('二维码加载中');
            //获取漂浮窗权限，存储权限，后台任务权限
            await QrCodeManager.requestIgnoreBatteryTask() //获取电池
            const flagIgnoreBatteryPermission = await QrCodeManager.hasIgnoreBatteryPermissionTask()
            if (flagIgnoreBatteryPermission === false) return;
            const windowPermission = await QrCodeManager.hasFloatWindowPermissionTask() //是否可以漂浮窗
            if (windowPermission === false) {
                Alert.alert('提示', '点击确认设置漂浮窗权限', [
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
            } else {
                setPath(await saveBase64ImageToGallery(codeImg))
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

        } catch (error: any) {
            Toast.show({
                content: error.message,
                position: 'bottom'
            });
        }

    }

    const handleRefresh = async () => {
        clearInterval(timer!)
        setCodeImg('')
        const res = await qrKey()
        await saveString('unikey', res.data.unikey)
        const imgRes = await qrImage(res.data.unikey)
        setCodeImg(imgRes.data.qrimg)
        setMsg('二维码未扫描')
        timer = setInterval(qrCodeHandle, 1500)
    }
    return (
        <View style={styles.container}>

            <View style={styles.imageContainer}>
                {codeImg ? (
                    <View>
                        <Image
                            source={{ uri: codeImg }}
                            style={styles.image}
                        />
                        {msg === '二维码已失效' && (
                            <View style={styles.overlay}>
                                <TouchableOpacity
                                    style={styles.refreshButton}
                                    onPress={handleRefresh}
                                >
                                    <Icon name="reload" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.image}>
                        <ActivityIndicator />
                    </View>
                )}
            </View>


            <Text style={styles.msg}>{msg}</Text>

            <Button onPress={goNeteaseCloud} style={styles.button} disabled={msg === '二维码已失效'}>
                保存图片并打开网易云音乐
            </Button>

            <Text>{userMsg}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    button: {
        marginTop: 20,
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
    },
    msg: {
        marginTop: 20,
    },
    image: {
        width: 200,
        height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#999',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshButton: {
        backgroundColor: '#f4511e',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});