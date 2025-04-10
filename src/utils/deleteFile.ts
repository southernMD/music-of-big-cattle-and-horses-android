import { NativeModules } from "react-native";
import RNFS from "react-native-fs";
export const deleteFile = async (filePath: string) => {
  const fileUri = filePath;
  try {
    await RNFS.unlink(fileUri);
    // const msg = await NativeModules.QrCode.refreshImg(filePath)
    // console.log(`File deleted: ${msg}`);
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
  }
};
