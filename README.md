# 大牛马音乐-安卓 bigNMuice-android
它与我另一个项目<a href="https://github.com/southernMD/music-of-big-cattle-and-horses-plus">大牛马音乐</a>没有关系，它是一个使用React Native重新开发的音乐播放器。

## 清除链接
adb disconnect

## 链接模拟器（mumu）
adb connect 127.0.0.1:7555

## 连接真机
adb devices 查看链接情况
adb tcpip 5555 
adb connect 手机ip:5555
adb connect 10.76.163.27:5555
adb connect 100.105.236.73:5555
adb connect 10.22.48.178:5555
adb connect 10.0.5.162:5555
adb connect 10.156.57.29:5555

## 调试面板
adb shell input keyevent 82 
或在运行中cmd按下j

## 链接debug
adb reverse tcp:9090 tcp:9090

## 打包
cd android && ./gradlew assembleRelease
生成的 APK 文件位于android/app/build/outputs/apk/release/app-release.apk
安装 adb install app/build/outputs/apk/release/app-release.apk
 
## 策划
# 底部bar
    1. home 首页 最近播放歌单 日推 歌单推荐 电台推荐
    2. 私人FM
    3. search topBar变成搜索框
    4. 收藏夹
    5. 登录
       1. 获取二维码 
       2. 点击按钮，保存二维码并弹出网易云音乐app(后台任务：监控二维码是否被认证，登录成功后后弹出app)