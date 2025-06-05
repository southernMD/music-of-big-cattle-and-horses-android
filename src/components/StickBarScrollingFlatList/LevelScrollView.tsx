import React, { memo, useRef, useMemo, useCallback, forwardRef, useImperativeHandle, useEffect, useState, CSSProperties } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Gesture, GestureDetector, PanGesture } from "react-native-gesture-handler";
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
  runOnUI,
} from "react-native-reanimated";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { FOOTER_BAR_HEIGHT } from "@/constants/bar";

const screenWidth = Dimensions.get("window").width;

export interface LevelScrollViewRef {
  scrollRef: AnimatedRef<Animated.ScrollView>
}
// useAnimatedRef<Animated.ScrollView>
interface Props {
  contentContainerStyle?: StyleProp<ViewStyle>
  blockLen:number;
  loading: boolean
  Scrolling: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  horizontalScrollX: SharedValue<number>
  children: [React.ReactElement,React.ReactElement<FlatList>];
  panGesture?:PanGesture
  itemWidth?:number
  startIndex?:number
  FinishHorizontalScrollHandle?:(newindex:number,oldIndex:number)=>void
  heightList?:number[]
}

const LevelScrollView = forwardRef<LevelScrollViewRef, Props>(({
  children,
  blockLen = 0,
  loading,
  Scrolling,
  horizontalScrollX,
  panGesture,
  itemWidth = screenWidth,
  startIndex = 0,
  FinishHorizontalScrollHandle,
  heightList,
  contentContainerStyle
}, ref) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const isHorizontal = useSharedValue(true);

  useEffect(() => {
    runOnUI(() => {
      'worklet';
      scrollTo(scrollRef, startIndex * itemWidth, 0, false);
    })();
    // console.log(children[1]);
    console.log("执行 scrollTo:", startIndex * itemWidth);
    horizontalScrollX.value = startIndex * itemWidth;
  }, [children[1]]);
  
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
      const threshold = itemWidth * 0.2; // 比原来的“0.5页面”更灵敏

      let oldIndex = horizontalScrollX.value / itemWidth;
      let nextIndex = oldIndex;
      console.log(horizontalScrollX.value,"horizontalScrollX.value");
      
      if (offsetX > threshold) {
        nextIndex += 1; // 向左滑
      } else if (offsetX < -threshold) {
        nextIndex -= 1; // 向右滑
      }

      nextIndex = Math.round(Math.max(0, Math.min(nextIndex, blockLen - 1)));
      // console.log(nextIndex);
      const targetX = nextIndex * itemWidth;

      // 使用 withTiming 实现动画，并在动画结束后执行回调
      cancelAnimation(horizontalScrollX);
      horizontalScrollX.value = withTiming(
        targetX,
        { duration: 300 }, // 动画时长
        (isFinished) => {
          if (isFinished) {
            if(FinishHorizontalScrollHandle) {
              runOnJS(FinishHorizontalScrollHandle)(nextIndex,oldIndex); // 使用 runOnJS 包装函数调用
            }
            isHorizontal.value = true; 
          }
        }
      );
      scrollTo(scrollRef, targetX, 0, true);
    })
  const nativeScrollY = useSharedValue(0); 
  // const allowNativeGesture = useDerivedValue(() => {
  //   return isHorizontal.value; // true 时允许 Native Gesture，false 时禁用
  // });
  const nativeScroll = Gesture.Native()
  // .enabled(isHorizontal.value)
  .onTouchesDown((e,gestureStateManager) => {
    if (!isHorizontal.value) {
      gestureStateManager.fail();
    }
    // console.log( e.allTouches[0].y);
    nativeScrollY.value = e.allTouches[0].y;
  })
  .onTouchesUp((e,gestureStateManager) => {
    const abx = Math.abs(nativeScrollY.value - e.allTouches[0].y)
    // console.log(abx,"自然事件");
    
    if(abx < 60 && abx > 2){
      gestureStateManager.fail()
    }
  })
  const finialGesture = Gesture.Simultaneous(
    directionalPanGesture,
    panGesture || Gesture.Manual(),
    nativeScroll
  );

  useImperativeHandle(ref, () => {
    return {
      scrollRef
    };
  }, []);

  const [currentIndex,setCurrentIndex] = useState(0);
  useDerivedValue(() => {
    runOnJS(setCurrentIndex)(Math.floor(horizontalScrollX.value / itemWidth))
  }, [horizontalScrollX]);

  useEffect(() => {
    console.log(currentIndex,"现在的下标值为");
  }, [currentIndex]);

  return (
    <GestureDetector gesture={finialGesture} >
      <FlatList
        data={[0]}
        keyExtractor={() => "main"}
        onScroll={Scrolling}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        contentContainerStyle={contentContainerStyle} 
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
            style={{height:heightList?.[currentIndex] ?? 'auto'}}
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
