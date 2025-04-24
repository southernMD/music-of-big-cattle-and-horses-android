import React, { memo, useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    SharedValue,
    useDerivedValue,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { useFullScreenImage } from '@/context/imgFullPreviewContext';
import { AnimatedOrRegular } from '@/utils/AnimatedOrRegular';

const screenWidth = Dimensions.get("window").width;

interface TabBarProps {
    onTabChange: (tab: string) => void;
    tabs: { key: string; name: string }[];
    translateY?: number
    position: 'relative' | 'absolute'
    onLayout?: (e: LayoutChangeEvent) => void
    scrollX?: SharedValue<number>
}

function TabBar({onTabChange, tabs, translateY, position, onLayout, scrollX }: TabBarProps) {
    const { typography, box } = useTheme();
    const activeLeft = useSharedValue(0);
    const activeWidth = useSharedValue(0);
    const primaryColor = usePersistentStore<string>('primaryColor')
    const measures = useSharedValue<{ pageX: number, width: number }[]>([]);

    const textRefs = useRef<(Text | null)[]>([]);
    const [layoutReady, setLayoutReady] = useState(false);

    const animatedStyle = useAnimatedStyle(() => {
        const index = Math.floor((scrollX?.value ?? 0) / screenWidth);
        const progress = (scrollX?.value ?? 0) / screenWidth - index;

        if (!measures.value[index]) {
            return {
                left: 0,
                width: 0,
            };
        }

        const currentMeasure = measures.value[index];
        const nextMeasure = measures.value[index + 1];

        let left = currentMeasure.pageX;
        let width = currentMeasure.width;

        if (nextMeasure) {
            left += progress * (nextMeasure.pageX - currentMeasure.pageX);
            width += progress * (nextMeasure.width - currentMeasure.width);
        }

        return { left, width };
    });

    useEffect(() => {
        if (!layoutReady) return;

        const newMeasures: { pageX: number, width: number }[] = [];
        let measureCount = 0;

        tabs.forEach((_, index) => {
            textRefs.current[index]?.measure((x, y, width, height, pageX) => {
                newMeasures[index] = { pageX, width };
                measureCount++;
                if (measureCount === tabs.length) {
                    measures.value = newMeasures; // 赋值给 shared value
                }
            });
        });

    }, [layoutReady, tabs]);


    const onTextLayout = (index: number) => () => {
        if (index === tabs.length - 1) {
            // 所有 tab 都 layout 完
            setLayoutReady(true);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            position: position,
            backgroundColor: box.background.shallow,
            top: translateY,
            zIndex: 1
        },
        tab: {
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
        },
        tabText: {
            fontSize: typography.sizes.medium,
            color: typography.colors.medium.default,
        },
        activeTabText: {
            color: typography.colors.medium.active,
            fontWeight: '600',
        },
        underline: {
            height: 4,
            backgroundColor: primaryColor,
            position: 'absolute',
            bottom: 10,
            borderRadius: 2,
        },
    });
    const { isVisible } = useFullScreenImage();


    // 获取当前索引
    const currentIndex = useDerivedValue(() => {
        return Math.round((scrollX?.value ?? 0) / screenWidth);
    });

    const animatedTextStyle = (index: number) =>
        useAnimatedStyle(() => {
            const isActive = index === currentIndex.value;
            return {
                color: isActive
                    ? typography.colors.medium.active
                    : typography.colors.medium.default,
                fontWeight: isActive ? '600' : 'normal',
            };
        });
    return (
        <View style={styles.container} onLayout={onLayout}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={tab.key}
                    style={styles.tab}
                    onPress={() => onTabChange(tab.key)}
                >
                    <AnimatedOrRegular
                        ref={(ref: Text | null) => (textRefs.current[index] = ref)}
                        isAnimated={!isVisible}
                        component={Text}
                        animatedStyle={animatedTextStyle(index)}
                        style={styles.tabText}
                        onLayout={onTextLayout(index)}
                    >{tab.name}</AnimatedOrRegular>
                </TouchableOpacity>
            ))}
            <AnimatedOrRegular
                isAnimated={!isVisible}
                component={View}
                animatedStyle={animatedStyle}
                style={styles.underline}
            />
        </View>
    );
}

export default memo(TabBar);
