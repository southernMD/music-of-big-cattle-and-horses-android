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
import PlaylistItem from "@/components/PlaylistItem";
import { convertHttpToHttps } from "@/utils/fixHttp";
import { playListItem } from "@/types/api/playListItem";
import { djItem } from "@/types/api/djItem";
import TabBar from "@/components/UserCenter/TabBar";
import ProfileHeader from "@/components/UserCenter/ProfileHeader";
import { userProfile } from "@/types/user/user";
import { useTheme } from "@/hooks/useTheme";
import LoadingPlaceholder from "./LoadingPlaceholder";

const screenWidth = Dimensions.get("window").width;

export interface LevelScrollViewRef {
  BaseTop: React.MutableRefObject<number>;
  scrollRef: AnimatedRef<Animated.ScrollView>
}
// useAnimatedRef<Animated.ScrollView>
interface Props {
  tabs: { key: string; name: string }[];
  scrollY: SharedValue<number>;
  pullOffset: SharedValue<number>;
  profile: userProfile | null;
  contentLists: Array<Array<any>>
  onTabChange: (key: string) => void;
  Scrolling: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  horizontalScrollX: SharedValue<number>
}

const LevelScrollView = forwardRef<LevelScrollViewRef, Props>(({
  tabs,
  scrollY,
  pullOffset,
  profile,
  contentLists,
  onTabChange,
  Scrolling,
  horizontalScrollX
}, ref) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const BaseTop = useRef(0);
  const { box } = useTheme();

  const styles = StyleSheet.create({
    list: {
      paddingHorizontal: 16,
      backgroundColor: box.background.middle, // 你可以接收 props 或用主题
    },
  });

  const TabBarLayoutBar = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    BaseTop.current = y;
  };

  const len = useDerivedValue(() => {
    return tabs.length;
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

  const loading = useMemo(() => {
    return contentLists.reduce((acc, cur) => acc + cur.length, 0) === 0
  }, [contentLists])

  useImperativeHandle(ref, () => {
    return {
      BaseTop, scrollRef
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
          <>
            <ProfileHeader pullOffset={pullOffset} profile={profile} />
            <TabBar
              position="relative"
              onTabChange={onTabChange}
              tabs={tabs}
              onLayout={TabBarLayoutBar}
              scrollX={horizontalScrollX}
            />
          </>
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
                : (contentLists.map((list, idx) => (
                  <View key={idx} style={{ width: screenWidth }}>
                    <FlatList
                      data={list}
                      keyExtractor={(item) => item.id.toString()}
                      removeClippedSubviews={false}
                      renderItem={({ item }: { item: playListItem | djItem }) => {
                        const imageUrl = (item as playListItem).coverImgUrl ?? (item as djItem).picUrl;
                        const songNumber = (item as playListItem).trackCount ?? (item as djItem).programCount;
                        const playOrStartNumber = (item as djItem).subCount ?? (item as playListItem).playCount;
                        return (
                          <View style={styles.list}>
                            <PlaylistItem
                              type={(item as djItem).dj ? 'dj' : 'song'}
                              image={convertHttpToHttps(imageUrl)}
                              title={item.name}
                              count={songNumber}
                              plays={playOrStartNumber}
                              onPress={() => console.log("Playlist pressed:", item.name)}
                            />
                          </View>
                        );
                      }}
                    />
                  </View>
                )))
            }

          </Animated.ScrollView>

        )}
      />
    </GestureDetector>
  );
})

export default memo(LevelScrollView);
