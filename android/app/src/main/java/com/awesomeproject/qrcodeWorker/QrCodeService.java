package com.awesomeproject.qrcodeWorker;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy;
import com.facebook.react.jstasks.LinearCountingRetryPolicy;

import javax.annotation.Nullable;


public class QrCodeService extends HeadlessJsTaskService {
    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        LinearCountingRetryPolicy retryPolicy = new LinearCountingRetryPolicy(
                3, // Max number of retry attempts
                1000 // Delay between each retry attempt
        );
        return new HeadlessJsTaskConfig(
                "qrCodeNativeBackground",
                Arguments.fromBundle(extras),
                100000, // 任务的超时时间
                false, // 可选参数：是否允许任务在前台运行，默认为false
                retryPolicy
        );
    }
}
