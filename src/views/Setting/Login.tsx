import { qrCheck, qrImage, qrKey, quitLogin } from "@/api";
import { OLD_NETEASE_CLOUD_MUSIC, NEW_NETEASE_CLOUD_MUSIC } from "@/constants/link";
import { CodeEnum } from "@/constants/network";
import { useLoadingModal } from "@/context/LoadingModalContext";
import { useBasicApi } from "@/store";
import { RootStackNavigationProps } from "@/types/NavigationType";
import { deleteFile } from "@/utils/deleteFile";
import { deleteCredentials, getCredentials, saveCredentials } from "@/utils/keychain";
import { saveBase64ImageToGallery } from "@/utils/saveFile";
import { clear, loadString, remove, saveString } from "@/utils/storage";
import { setIntervalWithSleep } from "@/utils/timer";
import { ActivityIndicator, Button, Icon, Provider, Toast } from "@ant-design/react-native";
import { CommonActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert, AppRegistry, AppState, BackHandler, DeviceEventEmitter, Image, Linking, Modal, NativeModules, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackgroundTimer from 'react-native-background-timer';
import FastImage from "react-native-fast-image";
import { useSnapshot } from "valtio";
//orpheuswidget://
//orpheus://
export const Login: React.FC = () => {
    const [codeImg, setCodeImg] = useState<string>('')
    const navigation = useNavigation<RootStackNavigationProps>()
    let timer: any | null = null;
    const [msg, setMsg] = useState<string>('二维码加载中')
    const [userMsg, setUserMsg] = useState<string>('')
    const QrCodeManager = NativeModules.QrCode;
    const [flag, setFlag] = useState<boolean>(false)
    const [path, setPath] = useState<string>('')
    const [timeOut, setTimeOut] = useState<boolean>(false)
    let cnt = 0
    // const [unikey , setUnikey] = useState<string>('')

    const { account, profile, reqLogin } = useSnapshot(useBasicApi)
    const qrCodeHandle = async () => {
        const controller = new AbortController();
        const unikey = (await loadString('unikey'))!
        const resCheck = await qrCheck(unikey, controller)
        console.log(resCheck, unikey,"我是前台任务");
        cnt++
        // setMsg('二维码已失效' + unikey + cnt + `|${timer}|`)
        // setTimeOut(true)
        // timer.clear()
        // return
        if (resCheck.code == CodeEnum.QR_OUT_LIMIT) { //过期
            timer?.clear();
            remove('unikey')
            const userMsg = await getCredentials()
            if (userMsg) {
                setMsg('登录成功' + unikey + cnt + `|${timer}|`)
                setUserMsg(userMsg.password)
            }
            else {
                setMsg('二维码已失效' + unikey + cnt + `|${timer}|`)
                setTimeOut(true)
            }
            setFlag(true)
        } else if (resCheck.code == CodeEnum.QR_WAIT_SCAN) {
            console.log('二维码未扫描');
            setMsg('二维码未扫描' + unikey + cnt + `|${timer}|`)
        } else if (resCheck.code == CodeEnum.QR_WAIT_CONFIRMATION) {
            console.log('二维码等待认证');
            setMsg('二维码等待认证' + unikey + cnt + `|${timer}|`)
        } else if (resCheck.code === CodeEnum.QR_SUCCESS) {
            controller.abort();
            timer.clear();
            await saveCredentials('user', resCheck.cookie);
            setUserMsg(resCheck.cookie)
            setMsg('登录成功' + unikey + cnt + `|${timer}|`)
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
                setMsg('二维码未扫描' + res.data.unikey)
                timer = setIntervalWithSleep(qrCodeHandle, 1500)
            }
            getCodeImg()

            return () => {
                console.log('timer', timer);

                timer?.clear();
            };
        }, [])
    );
    useFocusEffect(
        useCallback(() => {
            const handleAppStateChange = async (nextAppState: string) => {
                if (nextAppState === "background" || nextAppState === "inactive") {
                    console.log("应用进入最小化或后台", nextAppState,timer);
                    // 在这里执行进入最小化后的逻辑
                    timer?.clear();
                    const res = await QrCodeManager.startBackgroudTask()
                    console.log(res, "我是res");

                } else if (nextAppState === "active") {
                    console.log("应用回到前台");
                    BackgroundTimer.stopBackgroundTimer()
                    await QrCodeManager.stopBackgroudTask()
                    timer = setIntervalWithSleep(qrCodeHandle, 1500)
                    // 在这里执行回到前台后的逻辑
                }
            };

            // 添加监听
            const subscription = AppState.addEventListener("change", handleAppStateChange);

            // 清理监听
            return () => {
                QrCodeManager.stopBackgroudTask()
                subscription.remove();
            };
        }, [timer])
    );
    useEffect(() => {
        const eventListener = DeviceEventEmitter.addListener('backgroundTask', (event) => {
            console.log(event.msg, 6);
            console.log(event, 7);
        });

        return () => {
            eventListener.remove(); // 在组件卸载时移除监听器
        };
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', async () => {
            console.log('离开当前页面');
            setCodeImg('')
            timer?.clear();
            remove('unikey')
            setFlag(false)
            await QrCodeManager.stopBackgroudTask()
            BackgroundTimer.stopBackgroundTimer()
        });
        return unsubscribe;
    }, [navigation, timer]);

      const { showLoadingModal } = useLoadingModal()
    
    useEffect(() => {
        if (flag) {
            const { clear } = showLoadingModal()
            setIsLoading(true);
            console.log(flag, path, "球球你阻止我");
            if (path) deleteFile(path);
            setFlag(false);
            setPath('');
            (async () => {
                const cookie = await getCredentials()
                if (cookie) {
                    await reqLogin(cookie.password)
                    console.log(account, profile, useBasicApi.account, useBasicApi.profile);
                    setIsLoading(false)
                    clear()
                    queueMicrotask(() => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    { name: 'Main', params: { screen: 'HomeTab' } },
                                ],
                            })
                        );
                    })
                }
                setIsLoading(false)
                clear()
            })();
        }
    }, [flag, path]);
    const goNeteaseCloud = async () => {
        try {
            if (codeImg.length == 0) throw new Error('二维码加载中');
            //获取漂浮窗权限，存储权限，后台任务权限
            while (true) {
                const flagIgnoreBatteryPermission = await QrCodeManager.hasIgnoreBatteryPermissionTask()
                if (flagIgnoreBatteryPermission === false) await QrCodeManager.requestIgnoreBatteryTask() //获取电池
                else break
            }
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
        timer?.clear()
        setTimeOut(false)
        setCodeImg('')
        const res = await qrKey()
        await saveString('unikey', res.data.unikey)
        const imgRes = await qrImage(res.data.unikey)
        setCodeImg(imgRes.data.qrimg)
        setMsg('二维码未扫描')
        timer = setIntervalWithSleep(qrCodeHandle, 1500)

    }
    const [isLoading, setIsLoading] = useState(false); // 新增加载状态
    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                () => isLoading // 如果正在加载，拦截返回键
            );
            return () => backHandler.remove();
        }, [isLoading])
    );
    // 拦截导航返回（包括侧滑和编程式返回）
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (isLoading) {
                e.preventDefault(); // 阻止导航离开
                return;
            }
        });
        return unsubscribe;
    }, [navigation, isLoading]);
    return (
        <View style={styles.container}>

            <View style={styles.imageContainer}>
                {codeImg ? (
                    <View>
                        <FastImage
                            source={{ uri: codeImg }}
                            style={styles.image}
                        />
                        {timeOut && (
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

            <Button onPress={goNeteaseCloud} style={styles.button} disabled={timeOut}>
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
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});