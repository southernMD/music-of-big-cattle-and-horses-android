import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { NativeModules, PermissionsAndroid } from "react-native";
import RNFS from "react-native-fs";

const requestStoragePermission = async () => {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
            title: '存储权限',
            message: '应用需要访问您的存储以保存图片',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确定',
        }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
};
export const saveBase64ImageToGallery = async (base64Data: string) => {
    const Base64Code = base64Data.split("data:image/png;base64,")[1];
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
        throw new Error('权限被拒绝');
    }

    try {
        const storeLocation = `${RNFS.DownloadDirectoryPath}`;//获取到的文档目录路径
        let pathName = new Date().getTime() + ".png";//生成的图片名，这里使用当前时间戳来作为图片名字
        let downloadDest = `${storeLocation}/${pathName}`;//最终保存图片的完整路径 拼接得来
        console.log(downloadDest);
        const res = await RNFS.writeFile(downloadDest, Base64Code, 'base64')
        const msg = await NativeModules.QrCode.refreshImg(downloadDest)
        return downloadDest
    } catch (error) {
        console.log(error);
        throw new Error('保存图片失败');
    }
};