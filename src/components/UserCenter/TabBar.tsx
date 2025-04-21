import React, { memo, useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { usePersistentStore } from '@/hooks/usePersistentStore';
import { useFullScreenImage } from '@/context/imgFullPreviewContext';
import { AnimatedOrRegular } from '@/utils/AnimatedOrRegular';

interface TabBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    tabs: { key: string; name: string }[];
    translateY?: number
    position:'relative' | 'absolute'
    onLayout?: (e:LayoutChangeEvent) => void
}

function TabBar({ activeTab, onTabChange, tabs, translateY,position,onLayout }: TabBarProps) {
    const { typography, box } = useTheme();

    const activeLeft = useSharedValue(0);
    const activeWidth = useSharedValue(0);
    const primaryColor = usePersistentStore<string>('primaryColor')

    const textRefs = useRef<(Text | null)[]>([]);
    const [layoutReady, setLayoutReady] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
        width: activeWidth.value,
        left: activeLeft.value,
    }));

    useEffect(() => {
        if (!layoutReady) return;

        const index = tabs.findIndex(t => t.key === activeTab);
        if (index === -1 || !textRefs.current[index]) return;

        textRefs.current[index]?.measure((x, y, w, h, pageX) => {
            activeLeft.value = withTiming(pageX, { duration: 300 });
            activeWidth.value = withTiming(w, { duration: 300 });
        });
    }, [activeTab, layoutReady]);

    const onTextLayout = (index: number) => () => {
        if (index === tabs.length - 1) {
            // 所有 tab 都 layout 完
            setLayoutReady(true);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            position:position,
            backgroundColor: box.background.shallow,
            top: translateY,
            zIndex:1
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

    return (
        <View style={styles.container} onLayout={onLayout}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={tab.key}
                    style={styles.tab}
                    onPress={() => onTabChange(tab.key)}
                >
                    <Text
                        ref={ref => (textRefs.current[index] = ref)}
                        onLayout={onTextLayout(index)}
                        style={[
                            styles.tabText,
                            activeTab === tab.key && styles.activeTabText,
                        ]}
                    >
                        {tab.name}
                    </Text>
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
