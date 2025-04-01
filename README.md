# 大牛马音乐-安卓 bigNMuice-android
它与我另一个项目<a href="https://github.com/southernMD/music-of-big-cattle-and-horses-plus">大牛马音乐</a>没有关系，它是一个使用React Native重新开发的音乐播放器。

## 链接模拟器
adb connect 127.0.0.1:7555

## 调试面板
adb shell input keyevent 82 
或在运行中cmd按下j

## 链接debug
adb reverse tcp:9090 tcp:9090

## 打包
cd android && ./gradlew assembleRelease
生成的 APK 文件位于android/app/build/outputs/apk/release/app-release.apk