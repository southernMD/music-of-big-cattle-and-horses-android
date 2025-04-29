import React, { memo, useRef, useMemo, useCallback, forwardRef, useImperativeHandle, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedRef,
  useSharedValue,
  scrollTo,
  withSpring,
  runOnJS,
  SharedValue,
  AnimatedRef,
  useDerivedValue,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";

const screenWidth = Dimensions.get("window").width;

export interface LevelScrollViewRef {
  scrollRef: AnimatedRef<Animated.ScrollView>
}
// useAnimatedRef<Animated.ScrollView>
interface Props {
  tabs?: { key: string; name: string }[];
  scrollY: SharedValue<number>;
  pullOffset: SharedValue<number>;
  loading: boolean
  Scrolling: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  horizontalScrollX: SharedValue<number>
  children: [React.ReactElement,React.ReactElement];
}

const LevelScrollView = forwardRef<LevelScrollViewRef, Props>(({
  children,
  tabs,
  scrollY,
  pullOffset,
  loading,
  Scrolling,
  horizontalScrollX
}, ref) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  console.log(children);

  const len = useDerivedValue(() => {
    return tabs?.length ?? 0
  }, [tabs]);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const isHorizontal = useSharedValue(true);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scrollY.value <= 0 && e.translationY > 0) {
        pullOffset.value = e.translationY;
      }
    })
    .onEnd(() => {
      pullOffset.value = withSpring(0, { stiffness: 150, damping: 20 });
    });

  const directionalPanGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((e) => {
      startX.value = e.allTouches[0].x;
      startY.value = e.allTouches[0].y;
    })
    .onTouchesMove((e, gestureStateManager) => {
      const dx = e.allTouches[0].x - startX.value;
      const dy = e.allTouches[0].y - startY.value;
      // console.log(dx,dy);
      
      if (Math.abs(dx) > Math.abs(dy)) {
        // console.log("x手势");
        isHorizontal.value = false;
        gestureStateManager.activate();
      } else {
        // console.log("y手势");
        isHorizontal.value = true;
        gestureStateManager.fail();
      }
      startX.value = e.allTouches[0].x;
      startY.value = e.allTouches[0].y;
    })
    .onUpdate((e) => {
      scrollTo(scrollRef, -e.translationX + horizontalScrollX.value, 0, false);
    })
    .onEnd((e) => {
      
      const offsetX = -e.translationX; // 用户滑动的距离（右滑为负）
      const threshold = screenWidth * 0.2; // 比原来的“0.5页面”更灵敏

      let nextIndex = horizontalScrollX.value / screenWidth;

      if (offsetX > threshold) {
        nextIndex += 1; // 向左滑
      } else if (offsetX < -threshold) {
        nextIndex -= 1; // 向右滑
      }

      nextIndex = Math.round(Math.max(0, Math.min(nextIndex, len.value - 1)));
      const targetX = nextIndex * screenWidth;

      // 使用 withTiming 实现动画，并在动画结束后执行回调
      cancelAnimation(horizontalScrollX);
      horizontalScrollX.value = withTiming(
        targetX,
        { duration: 300 }, // 动画时长
        (isFinished) => {
          if (isFinished) {
            console.log('动画结束');
            isHorizontal.value = true; 
          }
        }
      );
      scrollTo(scrollRef, targetX, 0, true);
    })
  const nativeScrollY = useSharedValue(0); 
  const nativeScroll = Gesture.Native()
  .enabled(isHorizontal.value)
  .onTouchesDown((e) => {
    console.log( e.allTouches[0].y);
    nativeScrollY.value = e.allTouches[0].y;
  })
  .onTouchesUp((e,gestureStateManager) => {
    const abx = Math.abs(nativeScrollY.value - e.allTouches[0].y)
    console.log(abx,"自然事件");
    
    if(abx < 60 && abx > 2){
      gestureStateManager.fail()
    }
  })
  const finialGesture = Gesture.Simultaneous(
    directionalPanGesture,
    panGesture,
    nativeScroll
  );

  useImperativeHandle(ref, () => {
    return {
      scrollRef
    };
  }, []);

  return (
    <GestureDetector gesture={finialGesture}>
      <FlatList
        data={[0]}
        keyExtractor={() => "main"}
        onScroll={Scrolling}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        ListHeaderComponent={
          children[0]
        }
        renderItem={() => (
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {
              loading ?
                <LoadingPlaceholder visible={loading} timeout={1000 * 30} />
                : children[1]
            }

          </Animated.ScrollView>

        )}
      />
    </GestureDetector>
  );
})

export default memo(LevelScrollView);
