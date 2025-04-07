package com.awesomeproject.qrcodeWorker;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import android.os.Bundle;
import android.content.Intent;
import android.content.Context;

public class QrCodeWorker extends Worker{
    public QrCodeWorker(
            @NonNull Context context,
            @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Intent service = new Intent(getApplicationContext(), QrCodeService.class);
        Bundle bundle = new Bundle();
        bundle.putString("msg", "QrCode start");
        service.putExtras(bundle);
        getApplicationContext().startService(service);
        return Result.success();
    }
}
