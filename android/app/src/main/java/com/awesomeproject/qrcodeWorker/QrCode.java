package com.awesomeproject.qrcodeWorker;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.content.Context;
import android.app.ActivityManager;

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

        workRequest = new OneTimeWorkRequest.Builder(QrCodeWorker.class).build();
    }

    @Override
    public String getName() {
        return "QrCode";
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
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
    public void startBackgroudTask(Promise promise) {
        if(timer!=null) {
            timer.cancel();
            timer=null;
        }

        timer = new Timer();
        task = new TimerTask() {
            @Override
            public void run() {
                try {
                    if(!isAppOnForeground(reactContext)) {
                        WritableMap params = Arguments.createMap();
                        params.putString("msg", "app已经在后台了，准备启动BackgroundPostionWorker");
                        sendEvent(reactContext, "backgroundTask", params);

                        WorkManager.getInstance(reactContext).enqueue(workRequest);

                        WritableMap params2 = Arguments.createMap();
                        params2.putString("msg", "Qrcode started");
                        promise.resolve(params2);
                    }else{
                        WritableMap params = Arguments.createMap();
                        params.putString("msg", "app并不在后台");
                        sendEvent(reactContext, "backgroundTask", params);
                        promise.resolve(params);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    promise.reject(TAGERROR, e);
                }
            }
        };
        // 3s后执行1次
        timer.schedule(task, 3000);
    }

//    @ReactMethod
//    public void stopBackgroudTask(Promise promise) {
//        if(timer!=null) {
//            timer.cancel();
//            timer=null;
//        }
//
//        // if(locationManager != null && locationListener != null) {
//        //   locationManager.removeUpdates(locationListener);
//        // }
//        WritableMap params = Arguments.createMap();
//        params.putString("msg", "BackgroundPostionWorker stop successed");
//
//        WorkManager.getInstance().cancelUniqueWork("BackgroundPositionWorker");
//        promise.resolve(params);
//    }
}
