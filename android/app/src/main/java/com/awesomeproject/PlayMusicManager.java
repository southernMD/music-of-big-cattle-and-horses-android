package com.awesomeproject;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import android.media.MediaPlayer;

public class PlayMusicManager extends ReactContextBaseJavaModule {

    private MediaPlayer mediaPlayer;
    private ReactApplicationContext reactContext;

    public PlayMusicManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
    @Override
    public String getName() {
        return "PlayMusicManager";
    }

    @ReactMethod
    public void control(String mp3FileName, String playerStatus, Promise promise) {
        try {
            // 实现控制音乐播放的逻辑
            // 例如：播放、暂停、停止等
            // 这里是一个简单的示例
            if (playerStatus.equals("play")) {
                // 播放音乐
                playMusic(promise);
                // break;
                // promise.resolve("Music started playing: " + mp3FileName);
            } else if (playerStatus.equals("pause")) {
                // 暂停音乐
                promise.resolve("Music paused: " + mp3FileName);
            } else if (playerStatus.equals("stop")) {
                // 停止音乐
                promise.resolve("Music stopped: " + mp3FileName);
            } else {
                promise.reject("INVALID_STATUS", "Invalid player status");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
    private void playMusic(Promise promise) {
        if (mediaPlayer == null) {
            // 初始化 MediaPlayer
            mediaPlayer = MediaPlayer.create(reactContext, R.raw.music);
            mediaPlayer.setOnCompletionListener(mp -> {
                // 音乐播放完成时释放资源
                releaseMediaPlayer();
            });
        }
        if (!mediaPlayer.isPlaying()) {
            mediaPlayer.start();
            promise.resolve("Music started playing");
        } else {
            promise.resolve("Music is already playing");
        }
    }

    private void pauseMusic(Promise promise) {
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.pause();
            promise.resolve("Music paused");
        } else {
            promise.resolve("Music is not playing");
        }
    }

    private void stopMusic(Promise promise) {
        if (mediaPlayer != null) {
            mediaPlayer.stop();
            releaseMediaPlayer();
            promise.resolve("Music stopped");
        } else {
            promise.resolve("Music is not playing");
        }
    }

    private void releaseMediaPlayer() {
        if (mediaPlayer != null) {
            mediaPlayer.release();
            mediaPlayer = null;
        }
    }
}