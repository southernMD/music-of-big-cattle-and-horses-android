/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { backgroundPlayMusic } from '@/backgroundTasks/NativeMusicPlayer';
import { qrCodeBackground } from '@/backgroundTasks/ScanfQrcodeBackTask';
import { qrCodeNativeBackground } from '@/backgroundTasks/QrNativeBackTask';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('backgroundPlayMusic', () => backgroundPlayMusic);
AppRegistry.registerHeadlessTask('qrCodeBackgroundTask',()=> qrCodeBackground);
AppRegistry.registerHeadlessTask('qrCodeNativeBackground',()=> qrCodeNativeBackground);