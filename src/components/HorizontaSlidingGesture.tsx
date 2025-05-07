import React, { memo, useRef } from 'react';
import { View, StyleSheet, StyleProp } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { StyleProps, useSharedValue, withSpring } from 'react-native-reanimated';

const SWIPE_THRESHOLD = 50; // 滑动阈值，超过该值才触发

export const HorizontaSlidingGesture: React.FC<{
    children: React.ReactNode,
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    styles: StyleProp<StyleProps>
}> = memo(
    ({ children, onSwipeLeft, onSwipeRight, styles }) => {
        const translateX = useSharedValue(0); // 用于动画的位移值

        const gestureHandler = Gesture.Pan()
            .onBegin((event) => {
                translateX.value = event.translationX; // 更新位移值
            })
            .onEnd((event) => {
                if (event.translationX > SWIPE_THRESHOLD) {
                    // onSwipeRight(); // 右滑触发
                    console.log('向右滑了');
                } else if (event.translationX < -SWIPE_THRESHOLD) {
                    // onSwipeLeft(); // 左滑触发
                    console.log('向左滑了');
                }
                translateX.value = withSpring(0); // 滑动结束后复位
            })

        return (
            <GestureDetector gesture={gestureHandler} >
                <Animated.View
                    style={[
                        styles,
                        { transform: [{ translateX }] }, // 绑定位移值
                    ]}
                >
                    {children}
                </Animated.View>
            </GestureDetector>
        );
    }
)