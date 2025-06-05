import React, { memo, useRef, useCallback, cloneElement, useState } from "react";
import {
    View,
    NativeScrollEvent,
    NativeSyntheticEvent,
    LayoutChangeEvent,
    Dimensions,
    FlatList,
} from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, SharedValue, runOnJS } from "react-native-reanimated";
import TabBar from "@/components/UserCenter/TabBar";
import { useThrottleCallback } from "@/hooks/useThrottleCallback";
import LevelScrollView, { LevelScrollViewRef } from "@/components/StickBarScrollingFlatList/LevelScrollView";
import { useFullScreenImage } from "@/context/imgFullPreviewContext";
import { PanGesture } from "react-native-gesture-handler";
import { FOOTER_BAR_HEIGHT, HEADER_BAR_HEIGHT } from "@/constants/bar";

const screenWidth = Dimensions.get("window").width;

interface Props {
    children: {
        HeaderBar:React.ReactElement | null,
        HeaderContent:React.ReactElement,
        FlatListContent:React.ReactElement<FlatList>
    };
    tabs?: { key: string; name: string }[];
    Scrolling?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    loading: boolean
    panGesture?:PanGesture
    itemWidth?: number
    heightList?:number[]
}
const StickBarScrollingFlatList: React.FC<Props> = ({ children, tabs, Scrolling, loading,panGesture,itemWidth = screenWidth,heightList }) => {
    const horizontalScrollX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const [startIndex,setStartIndex] = useState(0);
    const throttledTabChange = useThrottleCallback((key: string) => {
        const index = tabs!.findIndex(tab => tab.key === key);
        if (index !== -1) {
            levelScrollViewRef.current?.scrollRef.current?.scrollTo({ x: index * itemWidth, animated: true });
            horizontalScrollX.value = index * itemWidth;
            runOnJS(setStartIndex)(index)
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
    const FinishHorizontalScrollHandle = useCallback(()=>{
        setStartIndex(horizontalScrollX.value / itemWidth)
    },[])

    return (
        <View>
            <Animated.View
                style={tabBarAnimatedStyle}>
                {tabs ? <TabBar
                    position="absolute"
                    onTabChange={throttledTabChange}
                    tabs={tabs}
                    scrollX={horizontalScrollX}
                /> : StickElementTop()}
            </Animated.View>

            <LevelScrollView
                startIndex={startIndex}
                Scrolling={ScrollingUserCenter}
                blockLen={tabs?.length || 0}
                loading={loading}
                ref={levelScrollViewRef}
                horizontalScrollX={horizontalScrollX}
                panGesture={panGesture}
                itemWidth={itemWidth}
                heightList={heightList}
                contentContainerStyle={{paddingBottom:FOOTER_BAR_HEIGHT}}
                FinishHorizontalScrollHandle={FinishHorizontalScrollHandle}
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
            <View style={{ height: FOOTER_BAR_HEIGHT }} />
        </View>
    );
};

export default memo(StickBarScrollingFlatList);
