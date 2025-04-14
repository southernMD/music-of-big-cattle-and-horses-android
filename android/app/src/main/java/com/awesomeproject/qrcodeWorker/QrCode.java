package com.awesomeproject.qrcodeWorker;

import com.awesomeproject.MainActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.annotation.SuppressLint;
import android.content.Context;
import android.app.ActivityManager;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;

import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import java.util.Timer;
import java.util.TimerTask;
import java.util.List;
import javax.annotation.Nullable;
import java.util.concurrent.TimeUnit;

public class QrCode extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private Timer timer = null;//计时器
    private TimerTask task = null;
    // private LocationManager locationManager;
    // private LocationListener locationListener;
    private OneTimeWorkRequest workRequest;
    private static final String TAGERROR = "START_BACKGROUND_TASK_ERROR";

    public QrCode(ReactApplicationContext context) {
        super(context);
        reactContext = context;

    }

    @Override
    public String getName() {
        return "QrCode";
    }

    private static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    /**
     * 忽略电池优化防止杀死后台任务
     * */
    @SuppressLint("ObsoleteSdkInt")
    public static void requestIgnoreBatteryOptimizations(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String packageName = context.getPackageName();
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);

            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                @SuppressLint("BatteryLife") Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.setData(Uri.parse("package:" + packageName));
                System.out.println("请求用户允许应用忽略电池优化");
                context.startActivity(intent);
            }
        }
    }
    /**
     * 检查应用是否具有漂浮窗权限
     *
     * @param context 上下文对象
     * @return true 表示有权限，false 表示无权限
     */
    public static boolean hasFloatWindowPermission(Context context) {
        return Settings.canDrawOverlays(context);
    }
    /**
     * 检查应用是否能始终在后台运行
     *
     * @param context 上下文对象
     * @return true 表示有权限，false 表示无权限
     */
    @SuppressLint("ObsoleteSdkInt")
    public static Boolean hasIgnoreBatteryOptimizations(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String packageName = context.getPackageName();
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            return pm.isIgnoringBatteryOptimizations(packageName);
        }else{
            return true;
        }
    }

    /**
     * 请求漂浮窗权限
     *
     * @param context 上下文对象
     */
    public static void requestFloatWindowPermission(Context context) {
        // 如果没有权限，则引导用户到系统设置页面
        if (!hasFloatWindowPermission(context)) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            intent.setData(Uri.parse("package:" + context.getPackageName()));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
    }

    public static void isRunningForegroundToApp1(Context context, final Class Class) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> taskInfoList = activityManager.getRunningTasks(20);
        /**枚举进程*/

        for (ActivityManager.RunningTaskInfo taskInfo : taskInfoList) {
            //*找到本应用的 task，并将它切换到前台
            if (taskInfo.baseActivity.getPackageName().equals(context.getPackageName())) {
                activityManager.moveTaskToFront(taskInfo.id, ActivityManager.MOVE_TASK_WITH_HOME);
                Intent intent = new Intent(context, Class);
                intent.addCategory(Intent.CATEGORY_LAUNCHER);
                intent.setAction(Intent.ACTION_MAIN);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
                context.startActivity(intent);
                break;
            }
        }
    }


    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
    }
    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    private boolean isAppOnForeground(Context context) {
        /**
         我们需要先检查应用当前是否在前台运行，否则应用会崩溃。
         http://stackoverflow.com/questions/8489993/check-android-application-is-in-foreground-or-not
         **/
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses =
                activityManager.getRunningAppProcesses();
        if (appProcesses == null) {
            return false;
        }
        final String packageName = context.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance ==
                    ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                    appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }


    @ReactMethod
    public void refreshImg(String filePath, Promise promise) {
        MediaScannerConnection.scanFile(
                reactContext,
                new String[]{filePath},
                new String[]{"img/png"},
                (path, uri) -> {
                    if (uri != null) {
                        promise.resolve("文件已添加到媒体库: " + uri.toString());
                    } else {
                        promise.resolve("文件添加到媒体库失败");
                    }
                }
        );
    }
    @ReactMethod
    public void startBackgroudTask2(Promise promise) {
        isRunningForegroundToApp1(reactContext, MainActivity.class);
        promise.resolve("后台启动应用");
    }

    @ReactMethod
    public void startBackgroudTask(Promise promise) {
        if(timer != null) {
            timer.cancel();
            timer = null;
        }

        timer = new Timer();
        task = new TimerTask() {
            @Override
            public void run() {
                try {
                    if(!isAppOnForeground(reactContext)) {
                        // 应用在后台，执行后台任务
                        WritableMap params = Arguments.createMap();
                        params.putString("msg", "app已经在后台了，准备启动BackgroundPostionWorker");
                        sendEvent(reactContext, "backgroundTask", params);

                        workRequest = new OneTimeWorkRequest.Builder(QrCodeWorker.class)
                                .setConstraints(
                                        new Constraints.Builder()
                                                .setRequiresCharging(false)
                                                .setRequiresBatteryNotLow(false)
                                                .build()
                                )
                                .build();
                        WorkManager.getInstance(reactContext).enqueue(workRequest);

                        // 成功启动后取消定时器
                        timer.cancel();
                        timer = null;

                        WritableMap params2 = Arguments.createMap();
                        params2.putString("msg", "Qrcode started");
                        promise.resolve("Qrcode started");
                    } else {
                        // 应用在前台，3秒后重试
                        WritableMap params = Arguments.createMap();
                        params.putString("msg", "app在前台，3秒后重试检查");
                        sendEvent(reactContext, "backgroundTask", params);

                        // 不需要额外操作，定时器会自动在3秒后再次执行
                    }
                } catch (Exception e) {
                    WritableMap params = Arguments.createMap();
                    params.putString("msg", e.toString());
                    sendEvent(reactContext, "backgroundTask", params);
                    e.printStackTrace();
                    promise.reject(TAGERROR, e);

                    // 发生错误也取消定时器
                    if(timer != null) {
                        timer.cancel();
                        timer = null;
                    }
                }
            }
        };
        // 每3秒执行一次检查
        timer.schedule(task, 0, 3000); // 立即开始，然后每3秒重复
    }
    @ReactMethod
    public void stopBackgroudTask(Promise promise) {
        if(timer!=null) {
            timer.cancel();
            timer=null;
        }

        // if(locationManager != null && locationListener != null) {
        //   locationManager.removeUpdates(locationListener);
        // }
        WritableMap params = Arguments.createMap();
        WorkManager.getInstance(reactContext).cancelWorkById(workRequest.getId());
        params.putString("msg", "BackgroundPostionWorker stop successed");
        promise.resolve(params);
    }

    @ReactMethod
    public void requestIgnoreBatteryTask(Promise promise) {
        requestIgnoreBatteryOptimizations(reactContext);
        promise.resolve("");
    }

    @ReactMethod
    public void requestFloatWindowTask(Promise promise){
        requestFloatWindowPermission(reactContext);
        promise.resolve("");
    }

    @ReactMethod
    public void hasFloatWindowPermissionTask(Promise promise){
        promise.resolve(hasFloatWindowPermission(reactContext));
    }

    @ReactMethod
    public void hasIgnoreBatteryPermissionTask(Promise promise){
        promise.resolve(hasIgnoreBatteryOptimizations(reactContext));
    }
}
