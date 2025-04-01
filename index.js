/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {backgroundPlayMusic} from './src/utils';

AppRegistry.registerHeadlessTask('backgroundPlayMusic', () => backgroundPlayMusic);
AppRegistry.registerComponent(appName, () => App);
