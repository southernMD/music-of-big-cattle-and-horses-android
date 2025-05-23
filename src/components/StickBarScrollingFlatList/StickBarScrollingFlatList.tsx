import React, { memo, useRef, useCallback, cloneElement } from "react";
import {
    View,
    NativeScrollEvent,
    NativeSyntheticEvent,
    LayoutChangeEvent,
    Dimensions,
} from "react-native";
import { useSharedValue, useAnimatedStyle, SharedValue } from "react-native-reanimated";
import TabBar from "@/components/UserCenter/TabBar";
import { useThrottleCallback } from "@/hooks/useThrottleCallback";
import LevelScrollView, { LevelScrollViewRef } from "@/components/StickBarScrollingFlatList/LevelScrollView";
import { AnimatedOrRegular } from "@/utils/AnimatedOrRegular";
import { useFullScreenImage } from "@/context/imgFullPreviewContext";
import { PanGesture } from "react-native-gesture-handler";
import { HEADER_BAR_HEIGHT } from "@/constants/bar";

const screenWidth = Dimensions.get("window").width;

interface Props {
    children: {
        HeaderBar:React.ReactElement | null,
        HeaderContent:React.ReactElement,
        FlatListContent:React.ReactElement
    };
    tabs?: { key: string; name: string }[];
    Scrolling?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    loading: boolean
    panGesture?:PanGesture
    itemWidth?: number
}
const StickBarScrollingFlatList: React.FC<Props> = ({ children, tabs, Scrolling, loading,panGesture,itemWidth = screenWidth }) => {
    const horizontalScrollX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const throttledTabChange = useThrottleCallback((key: string) => {
        const index = tabs!.findIndex(tab => tab.key === key);
        if (index !== -1) {
            levelScrollViewRef.current?.scrollRef.current?.scrollTo({ x: index * itemWidth, animated: true });
            horizontalScrollX.value = index * itemWidth;
        }
    }, 200);
    const levelScrollViewRef = useRef<LevelScrollViewRef>(null)

    const tabBarAnimatedStyle = useAnimatedStyle(() => ({
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        opacity: translateY.value === 0 ? 0 : 1,
        transform: [{ translateY: translateY.value }],
    }));
    const { isVisible } = useFullScreenImage();
    const BaseTop = useRef(0);
    const TabBarLayoutBar = (event: LayoutChangeEvent) => {
        const { y } = event.nativeEvent.layout;
        BaseTop.current = y;
    };
    
    const StickElementTop = useCallback(() => {
        return children.HeaderBar ? cloneElement(children.HeaderBar, {
            position: "absolute"
        }) : null
    }, [children.HeaderBar])

    const StickElement = useCallback(() => {
        return children.HeaderBar ? cloneElement(children.HeaderBar, {
            position: "relative",
        }) : null
    }, [children.HeaderBar])

    const ScrollingUserCenter = (event: NativeSyntheticEvent<NativeScrollEvent>)=>{
        if(Scrolling)Scrolling(event)
        const { y } = event.nativeEvent.contentOffset;
        translateY.value = BaseTop.current - y <= HEADER_BAR_HEIGHT ? HEADER_BAR_HEIGHT : 0;
    }

    return (
        <View>
            <AnimatedOrRegular
                isAnimated={!isVisible}
                component={View}
                animatedStyle={tabBarAnimatedStyle}>
                {tabs ? <TabBar
                    position="absolute"
                    onTabChange={throttledTabChange}
                    tabs={tabs}
                    scrollX={horizontalScrollX}
                /> : StickElementTop()}
            </AnimatedOrRegular>

            <LevelScrollView
                Scrolling={ScrollingUserCenter}
                blockLen={tabs?.length || 0}
                loading={loading}
                ref={levelScrollViewRef}
                horizontalScrollX={horizontalScrollX}
                panGesture={panGesture}
                itemWidth={itemWidth}
            >
                <>
                    {children.HeaderContent}
                    {tabs ? <TabBar
                        position="relative"
                        onTabChange={throttledTabChange}
                        tabs={tabs}
                        onLayout={TabBarLayoutBar}
                        scrollX={horizontalScrollX}
                    /> : <View onLayout={TabBarLayoutBar}>{StickElement()}</View>}
                </>
                <>
                    {children.FlatListContent}
                </>
            </LevelScrollView>
        </View>
    );
};

export default memo(StickBarScrollingFlatList);
