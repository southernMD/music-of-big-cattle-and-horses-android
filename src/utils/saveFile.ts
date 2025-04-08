import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { PermissionsAndroid } from "react-native";
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
        console.log('权限被拒绝');
        return;
    }

    try {
        const storeLocation = `${RNFS.PicturesDirectoryPath}`;//获取到的文档目录路径
        let pathName = new Date().getTime() + ".png";//生成的图片名，这里使用当前时间戳来作为图片名字
        let downloadDest = `${storeLocation}/${pathName}`;//最终保存图片的完整路径 拼接得来
        // const ret = RNFS.downloadFile({ fromUrl: base64Data, toFile: downloadDest });
        console.log(downloadDest);
        const res = await RNFS.writeFile(downloadDest, Base64Code, 'base64')
        console.log('保存成功',res);
    } catch (error) {
        console.error('保存图片失败', error);
    }
};